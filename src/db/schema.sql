-- Habilitar la extensión pgcrypto para gen_random_uuid() si no está habilitada
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Habilitar la extensión vector para pgvector si no está habilitada
CREATE EXTENSION IF NOT EXISTS vector;

-- Tabla: landings_context
CREATE TABLE IF NOT EXISTS landings_context (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url TEXT,
    content TEXT,
    created_at TIMESTAMP DEFAULT now()
);

-- Tabla: semantic_vectors
CREATE TABLE IF NOT EXISTS semantic_vectors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    landing_id UUID REFERENCES landings_context(id) ON DELETE CASCADE,
    embedding VECTOR(1536),
    metadata JSONB
);

-- Tabla: audit_logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action TEXT,
    decision_reason TEXT,
    cost_impact DECIMAL,
    status TEXT,
    created_at TIMESTAMP DEFAULT now()
);
