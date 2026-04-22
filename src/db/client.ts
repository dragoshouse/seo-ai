import postgres from "npm:postgres";

const connectionString = Deno.env.get("DATABASE_URL");

if (!connectionString) {
  throw new Error("DATABASE_URL no está configurada. Por favor, verifica tus variables de entorno.");
}

// Configuración de postgres.js con soporte de reconexión (implícito y configurable)
const sql = postgres(connectionString, {
  max: 10,           // Número máximo de conexiones
  idle_timeout: 20,  // Cierra conexiones inactivas después de 20 segundos
  connect_timeout: 10, // Timeout de conexión de 10 segundos
  // En caso de que se necesite soporte explícito SSL (suele ser necesario en NeonDB)
  ssl: 'require',
});

export default sql;
