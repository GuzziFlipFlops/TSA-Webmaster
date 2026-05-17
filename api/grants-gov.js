const GRANTS_GOV_SEARCH_URL = "https://api.grants.gov/v1/api/search2";

const allowedStatuses = new Set(["posted", "forecasted", "closed", "archived"]);
const allowedFundingCategories = new Set([
  "AG",
  "AR",
  "BC",
  "CD",
  "CP",
  "D",
  "ED",
  "EL",
  "EN",
  "ENV",
  "FN",
  "HL",
  "HO",
  "HU",
  "II",
  "IS",
  "L",
  "NR",
  "RA",
  "ST",
  "T"
]);
const allowedEligibilityCodes = new Set(["05", "06", "12", "13", "20", "21", "25"]);

function pipeList(value, allowed, fallback = "") {
  if (!value) return fallback;
  const values = String(value)
    .split("|")
    .map((item) => item.trim())
    .filter((item) => allowed.has(item));
  return values.length ? values.join("|") : fallback;
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    response.status(405).json({ error: "Use POST for Grants.gov search." });
    return;
  }

  try {
    const body = request.body ?? {};
    const rows = Math.min(Math.max(Number(body.rows) || 20, 1), 50);
    const keyword = String(body.keyword ?? "STEM education school youth").slice(0, 160);
    const upstreamBody = {
      rows,
      keyword,
      oppStatuses: pipeList(body.oppStatuses, allowedStatuses, "posted|forecasted"),
      fundingCategories: pipeList(body.fundingCategories, allowedFundingCategories, "ED|ST"),
      eligibilities: pipeList(body.eligibilities, allowedEligibilityCodes, "05|06|12|13|20|25"),
      fundingInstruments: "G",
      startRecordNum: Math.max(Number(body.startRecordNum) || 0, 0),
      sortBy: "openDate|desc"
    };

    const upstream = await fetch(GRANTS_GOV_SEARCH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(upstreamBody)
    });

    const payload = await upstream.text();
    response.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate=3600");
    response.setHeader("Content-Type", "application/json");
    response.status(upstream.status).send(payload);
  } catch (error) {
    response.status(502).json({
      error: "Unable to reach Grants.gov right now.",
      detail: error instanceof Error ? error.message : String(error)
    });
  }
}
