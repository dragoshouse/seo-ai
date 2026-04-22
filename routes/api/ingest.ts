import { Handlers } from "$fresh/server.ts";
import db from "../../db/client.ts";
import { organizations } from "../../db/schema.ts";
import { eq } from "drizzle-orm";

export const handler: Handlers = {
  async POST(req) {
    try {
      const { slug, url } = await req.json();
      const tenant = await db.select().from(organizations).where(eq(organizations.slug, slug)).limit(1);

      if (tenant.length === 0) {
        return new Response(JSON.stringify({ error: "Tenant not found" }), { status: 404 });
      }

      return new Response(JSON.stringify({ 
        message: `Ingestion started for ${tenant[0].name}`,
        url: url 
      }), { status: 202 });
    } catch (e) {
      return new Response(JSON.stringify({ error: "Invalid request" }), { status: 400 });
    }
  },
};
