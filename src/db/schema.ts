import { relations, sql } from "drizzle-orm";
import { customType, decimal, jsonb, pgTable, text, uuid } from "drizzle-orm/pg-core";

const vector = customType<{ data: number[]; driverData: string }>({
  dataType() {
    return "vector(1536)";
  },
  toDriver(value) {
    return `[${value.join(",")}]`;
  },
  fromDriver(value) {
    return value
      .slice(1, -1)
      .split(",")
      .map((item) => Number.parseFloat(item));
  },
});

export const organizations = pgTable("organizations", {
  id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  googleAdsConfig: jsonb("google_ads_config"),
  aiConfig: jsonb("ai_config"),
  budgetSettings: jsonb("budget_settings"),
});

export const landingsContext = pgTable("landings_context", {
  id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  content: text("content").notNull(),
});

export const semanticVectors = pgTable("semantic_vectors", {
  id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
  landingId: uuid("landing_id")
    .notNull()
    .references(() => landingsContext.id, { onDelete: "cascade" }),
  embedding: vector("embedding").notNull(),
});

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  action: text("action").notNull(),
  decisionReason: text("decision_reason"),
  costImpact: decimal("cost_impact", { precision: 12, scale: 2 }),
  status: text("status").notNull(),
});

export const organizationsRelations = relations(organizations, ({ many }) => ({
  landings: many(landingsContext),
  auditLogs: many(auditLogs),
}));

export const landingsContextRelations = relations(landingsContext, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [landingsContext.organizationId],
    references: [organizations.id],
  }),
  semanticVectors: many(semanticVectors),
}));

export const semanticVectorsRelations = relations(semanticVectors, ({ one }) => ({
  landing: one(landingsContext, {
    fields: [semanticVectors.landingId],
    references: [landingsContext.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  organization: one(organizations, {
    fields: [auditLogs.organizationId],
    references: [organizations.id],
  }),
}));
