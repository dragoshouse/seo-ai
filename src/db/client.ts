import postgres from "postgres";

export interface LandingContext {
  id: number;
  url: string;
  content: string;
  created_at: string;
}

export interface SemanticVector {
  id: number;
  landing_id: number;
  embedding: number[];
  metadata: Record<string, unknown> | null;
}

export interface AuditLog {
  id: number;
  action: string;
  decision_reason: string;
  cost_impact: number;
  status: string;
}

const connectionString = Deno.env.get("DATABASE_URL");

if (!connectionString) {
  throw new Error("DATABASE_URL no está configurada. Por favor, verifica tus variables de entorno.");
}

const sql = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
  ssl: "require",
  prepare: false,
});

export default sql;
