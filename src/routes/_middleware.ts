import { MiddlewareHandlerContext } from "$fresh/server.ts";

interface NeonSession {
  sub: string;
  iss: string;
  aud: string | string[];
  exp: number;
  iat?: number;
  email?: string;
}

interface AppState {
  session?: NeonSession;
}

const LOGIN_PATH = "/login";
const SESSION_COOKIE_NAME = "neon_auth_session";

const toBase64Url = (value: string): string =>
  btoa(value).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");

const fromBase64Url = (value: string): string => {
  const base64 = value.replaceAll("-", "+").replaceAll("_", "/");
  const padding = (4 - (base64.length % 4)) % 4;
  return atob(base64 + "=".repeat(padding));
};

const parseJwtPayload = (token: string): Record<string, unknown> | null => {
  const parts = token.split(".");

  if (parts.length !== 3) {
    return null;
  }

  try {
    const payload = fromBase64Url(parts[1]);
    return JSON.parse(payload) as Record<string, unknown>;
  } catch {
    return null;
  }
};

const signHmacSha256 = async (data: string, secret: string): Promise<string> => {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signatureBuffer = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  const signature = String.fromCharCode(...new Uint8Array(signatureBuffer));

  return toBase64Url(signature);
};

const getTokenFromRequest = (request: Request): string | null => {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length).trim();
  }

  const cookies = request.headers.get("cookie");
  if (!cookies) {
    return null;
  }

  const match = cookies
    .split(";")
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(`${SESSION_COOKIE_NAME}=`));

  if (!match) {
    return null;
  }

  return decodeURIComponent(match.split("=").slice(1).join("="));
};

const isValidSession = async (
  token: string,
  issuer: string,
  clientId: string,
  secret: string,
): Promise<NeonSession | null> => {
  const parts = token.split(".");
  if (parts.length !== 3) {
    return null;
  }

  const [header, payload, signature] = parts;
  const expectedSignature = await signHmacSha256(`${header}.${payload}`, secret);

  if (expectedSignature !== signature) {
    return null;
  }

  const claims = parseJwtPayload(token);
  if (!claims) {
    return null;
  }

  const session: NeonSession = {
    sub: String(claims.sub ?? ""),
    iss: String(claims.iss ?? ""),
    aud: (claims.aud as string | string[]) ?? "",
    exp: Number(claims.exp ?? 0),
    iat: claims.iat ? Number(claims.iat) : undefined,
    email: claims.email ? String(claims.email) : undefined,
  };

  if (!session.sub || !session.iss || !session.exp) {
    return null;
  }

  const audienceMatches = Array.isArray(session.aud)
    ? session.aud.includes(clientId)
    : session.aud === clientId;

  const isExpired = session.exp <= Math.floor(Date.now() / 1000);

  if (session.iss !== issuer || !audienceMatches || isExpired) {
    return null;
  }

  return session;
};

export async function handler(request: Request, context: MiddlewareHandlerContext<AppState>) {
  const pathname = new URL(request.url).pathname;

  if (!pathname.startsWith("/dashboard")) {
    return await context.next();
  }

  const issuer = Deno.env.get("NEON_AUTH_ISSUER");
  const clientId = Deno.env.get("NEON_AUTH_CLIENT_ID");
  const secret = Deno.env.get("NEON_AUTH_SECRET");

  if (!issuer || !clientId || !secret) {
    return new Response("Neon Auth no está configurado correctamente.", { status: 500 });
  }

  const token = getTokenFromRequest(request);

  if (!token) {
    return Response.redirect(new URL(LOGIN_PATH, request.url), 302);
  }

  const session = await isValidSession(token, issuer, clientId, secret);

  if (!session) {
    return Response.redirect(new URL(LOGIN_PATH, request.url), 302);
  }

  context.state.session = session;

  return await context.next();
}
