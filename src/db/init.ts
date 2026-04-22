import sql from "./client.ts";

async function initializeDatabase() {
  try {
    console.log("Reading schema.sql...");
    const schema = await Deno.readTextFile(new URL("./schema.sql", import.meta.url));

    console.log("Executing schema.sql on NeonDB...");
    await sql.unsafe(schema);

    console.log("Database initialized successfully.");
  } catch (error) {
    console.error("Error initializing database:", error);
  } finally {
    // Close the database connection
    await sql.end();
  }
}

// Permitir ejecutar el script directamente
if (import.meta.main) {
  initializeDatabase();
}

export { initializeDatabase };
