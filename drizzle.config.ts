import { defineConfig } from "drizzle-kit";

const url = Deno.env.get("DATABASE_URL");

if (!url) {
  throw new Error("DATABASE_URL no está configurada.");
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url,
  },
});
