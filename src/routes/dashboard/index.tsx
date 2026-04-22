import { Handlers, PageProps } from "$fresh/server.ts";

import { db } from "../../db/client.ts";
import { organizations } from "../../db/schema.ts";

type OrganizationView = {
  id: string;
  name: string;
  slug: string;
  googleAdsConfig: unknown;
  budgetSettings: unknown;
};

export const handler: Handlers<OrganizationView[]> = {
  async GET(_request, context) {
    const rows = await db.select().from(organizations);

    const payload: OrganizationView[] = rows.map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      googleAdsConfig: row.googleAdsConfig,
      budgetSettings: row.budgetSettings,
    }));

    return context.render(payload);
  },
};

export default function DashboardIndex({ data }: PageProps<OrganizationView[]>) {
  return (
    <section>
      <div class="org-grid">
        {data.length === 0
          ? (
            <article class="org-card empty">
              <h2>Sin organizaciones</h2>
              <p>Crea la primera organización para empezar a gestionar campañas.</p>
            </article>
          )
          : data.map((organization) => (
            <article class="org-card" key={organization.id}>
              <h2>{organization.name}</h2>
              <p class="slug">/{organization.slug}</p>
              <pre>{JSON.stringify(organization.budgetSettings ?? {}, null, 2)}</pre>
            </article>
          ))}
      </div>

      <style>{`
        .org-grid {
          display: grid;
          gap: 1rem;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        }

        .org-card {
          background: #fffdf9;
          border: 1px solid #e8e1d9;
          border-radius: 14px;
          padding: 1.25rem;
          min-height: 180px;
        }

        .org-card h2 {
          margin: 0;
          font-size: 1.05rem;
          font-weight: 550;
        }

        .org-card .slug {
          margin: 0.25rem 0 1rem;
          color: #746d63;
          font-size: 0.88rem;
        }

        .org-card pre {
          margin: 0;
          font-size: 0.78rem;
          white-space: pre-wrap;
          color: #433f39;
        }
      `}</style>
    </section>
  );
}
