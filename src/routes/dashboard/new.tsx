export default function NewOrganizationPage() {
  return (
    <section class="panel">
      <h2>Nueva organización</h2>
      <form method="POST" action="/api/organizations" class="form-grid">
        <label>
          Name
          <input name="name" type="text" required />
        </label>

        <label>
          Slug
          <input name="slug" type="text" required pattern="[a-z0-9-]+" />
        </label>

        <label>
          Google Ads Config (JSON)
          <textarea name="googleAdsConfig" rows={6} placeholder='{"customerId":"123-456-7890"}' required />
        </label>

        <label>
          Budget Daily Limit
          <input name="budgetDailyLimit" type="number" min="0" step="0.01" required />
        </label>

        <button type="submit">Guardar organización</button>
      </form>

      <style>{`
        .panel {
          background: #fffdf9;
          border: 1px solid #e8e1d9;
          border-radius: 16px;
          padding: 1.5rem;
        }

        h2 {
          margin-top: 0;
          font-size: 1.25rem;
          font-weight: 550;
        }

        .form-grid {
          display: grid;
          gap: 1rem;
        }

        label {
          display: grid;
          gap: 0.45rem;
          font-size: 0.92rem;
          color: #433f39;
        }

        input,
        textarea {
          border: 1px solid #d8d0c6;
          border-radius: 10px;
          padding: 0.7rem 0.8rem;
          font: inherit;
          background: #fff;
        }

        button {
          justify-self: start;
          border: 0;
          border-radius: 999px;
          padding: 0.7rem 1.2rem;
          background: #24211d;
          color: #fff;
          font: inherit;
          cursor: pointer;
        }
      `}</style>
    </section>
  );
}
