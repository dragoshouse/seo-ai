import { eq } from "drizzle-orm";

import { getDb } from "./db/client.ts";
import { organizations } from "./db/schema.ts";

type IngestPayload = {
  slug: string;
  url: string;
};

const jsonResponse = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

Deno.serve(async (request) => {
  const requestUrl = new URL(request.url);

  console.log("Incoming request", {
    method: request.method,
    path: requestUrl.pathname,
    url: request.url,
  });

  if (requestUrl.pathname === "/") {
    return jsonResponse({
      service: "seo-ai",
      status: "ok",
      endpoints: {
        ingest: {
          method: "POST",
          path: "/api/ingest",
          body: { slug: "string", url: "string" },
        },
      },
    });
  }

  if (requestUrl.pathname !== "/api/ingest") {
    return jsonResponse({ message: "Not Found" }, 404);
  }

  if (request.method !== "POST") {
    return jsonResponse({ message: "Method Not Allowed" }, 405);
  }

  let payload: IngestPayload;

  try {
    payload = (await request.json()) as IngestPayload;
  } catch {
    return jsonResponse({ message: "Invalid JSON body" }, 400);
  }

  if (typeof payload.slug !== "string" || typeof payload.url !== "string") {
    return jsonResponse({ message: "Body must be { slug: string, url: string }" }, 400);
  }

  const [organization] = await getDb()
    .select()
    .from(organizations)
    .where(eq(organizations.slug, payload.slug))
    .limit(1);

  if (!organization) {
    return jsonResponse({ message: "Organization not found" }, 404);
  }

  return jsonResponse({ message: `Ingestion started for ${organization.name}` }, 202);
});
