import { ComponentChildren } from "preact";

type DashboardLayoutProps = {
  children: ComponentChildren;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div class="dashboard-shell">
      <header class="dashboard-header">
        <div>
          <p class="eyebrow">Organization Manager</p>
          <h1>Dashboard</h1>
        </div>
        <a href="/dashboard/new" class="primary-link">Nueva organización</a>
      </header>
      <main>{children}</main>
      <style>{`
        :root {
          --bg: #f7f5f1;
          --panel: #fffdf9;
          --text: #2d2a26;
          --muted: #746d63;
          --border: #e8e1d9;
          --accent: #24211d;
        }

        body {
          margin: 0;
          font-family: "Inter", "Neue Haas Grotesk", "Segoe UI", sans-serif;
          background: var(--bg);
          color: var(--text);
          line-height: 1.6;
        }

        .dashboard-shell {
          max-width: 1024px;
          margin: 0 auto;
          padding: 3rem 1.5rem 4rem;
        }

        .dashboard-header {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 2.5rem;
        }

        .eyebrow {
          margin: 0;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--muted);
          font-size: 0.75rem;
        }

        h1 {
          margin: 0.25rem 0 0;
          font-size: clamp(1.6rem, 4vw, 2.5rem);
          font-weight: 500;
        }

        .primary-link {
          text-decoration: none;
          color: #fff;
          background: var(--accent);
          padding: 0.65rem 1rem;
          border-radius: 999px;
          font-size: 0.9rem;
        }

        @media (max-width: 640px) {
          .dashboard-header {
            flex-direction: column;
            align-items: start;
          }
        }
      `}</style>
    </div>
  );
}
