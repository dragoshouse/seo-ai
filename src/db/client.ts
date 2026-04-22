import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema.ts";

const connectionString = Deno.env.get("DATABASE_URL");

if (!connectionString) {
  throw new Error("DATABASE_URL no está configurada. Por favor, verifica tus variables de entorno.");
}

const queryClient = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
  ssl: "require",
  prepare: false,
});

export const db = drizzle(queryClient, { schema });

export default db;
