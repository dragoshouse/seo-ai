import { Handlers } from "$fresh/server.ts";

import { getDb } from "../../db/client.ts";
import { organizations } from "../../db/schema.ts";

type GoogleAdsConfig = Record<string, unknown>;

export const handler: Handlers = {
  async POST(request) {
    const formData = await request.formData();

    const name = String(formData.get("name") ?? "").trim();
    const slug = String(formData.get("slug") ?? "").trim();
    const googleAdsConfigText = String(formData.get("googleAdsConfig") ?? "").trim();
    const budgetDailyLimitRaw = String(formData.get("budgetDailyLimit") ?? "").trim();

    if (!name || !slug || !googleAdsConfigText || !budgetDailyLimitRaw) {
      return new Response("Missing required fields", { status: 400 });
    }

    let googleAdsConfig: GoogleAdsConfig;
    try {
      googleAdsConfig = JSON.parse(googleAdsConfigText) as GoogleAdsConfig;
    } catch {
      return new Response("Google Ads Config must be valid JSON", { status: 400 });
    }

    const budgetDailyLimit = Number.parseFloat(budgetDailyLimitRaw);

    if (!Number.isFinite(budgetDailyLimit) || budgetDailyLimit < 0) {
      return new Response("Budget Daily Limit must be a valid non-negative number", { status: 400 });
    }

    await getDb().insert(organizations).values({
      name,
      slug,
      googleAdsConfig,
      budgetSettings: {
        dailyLimit: budgetDailyLimit,
      },
    });

    return Response.redirect(new URL("/dashboard", request.url), 303);
  },
};
