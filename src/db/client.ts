import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema.ts";

const databaseUrlError =
  "DATABASE_URL no está configurada. Por favor, verifica tus variables de entorno.";

let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

export const getDb = () => {
  if (dbInstance) {
    return dbInstance;
  }

  const connectionString = Deno.env.get("DATABASE_URL");

  if (!connectionString) {
    throw new Error(databaseUrlError);
  }

  const queryClient = postgres(connectionString, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
    ssl: "require",
    prepare: false,
  });

  dbInstance = drizzle(queryClient, { schema });
  return dbInstance;
};

export default getDb;
