import { titleCase } from "../utils/resourceUtils";

export const GRANTS_GOV_CATEGORY_OPTIONS = [
  { value: "ED|ST", label: "Education + science/technology" },
  { value: "ED", label: "Education" },
  { value: "ST", label: "Science and technology" },
  { value: "AR", label: "Arts" },
  { value: "ENV", label: "Environment" },
  { value: "CD", label: "Community development" },
  { value: "HL", label: "Health" }
];

export const GRANTS_GOV_ELIGIBILITY_OPTIONS = [
  { value: "05|06|12|13|20|25", label: "Schools, colleges, nonprofits, others" },
  { value: "05", label: "Independent school districts" },
  { value: "06|20", label: "Public/private colleges" },
  { value: "12|13", label: "Nonprofit organizations" },
  { value: "21", label: "Individuals" },
  { value: "25", label: "Other applicants" }
];

export const GRANTS_GOV_STATUS_OPTIONS = [
  { value: "posted|forecasted", label: "Posted + forecasted" },
  { value: "posted", label: "Posted only" },
  { value: "forecasted", label: "Forecasted only" },
  { value: "posted|forecasted|closed", label: "Include recently closed" }
];

const categoryLabelMap = {
  ED: "Classroom Supplies",
  ST: "STEM & Robotics",
  AR: "Art & Creative Projects",
  ENV: "Environmental Projects",
  CD: "Community Service",
  HL: "Student & Family Support"
};

function stripHtml(value) {
  return String(value ?? "")
    .replace(/&ndash;/g, "-")
    .replace(/&amp;/g, "&")
    .replace(/<[^>]*>/g, "")
    .trim();
}

function parseGrantsGovDate(value) {
  if (!value) return null;
  const [month, day, year] = String(value).split("/");
  if (!month || !day || !year) return null;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function deriveCategories(codes = "") {
  const categories = String(codes)
    .split("|")
    .map((code) => categoryLabelMap[code])
    .filter(Boolean);
  return categories.length ? [...new Set(categories)] : ["STEM & Robotics", "Classroom Supplies"];
}

export function buildGrantsGovKeywordFromAnswers(answers = {}) {
  const projectKeywords = {
    tutoring: "education tutoring youth school",
    stem: "STEM robotics engineering education",
    art: "arts education youth school",
    supplies: "classroom supplies education",
    club: "STEM school club youth education",
    service: "youth community service education",
    environment: "environmental education youth school",
    accessibility: "accessibility inclusion education youth",
    career: "career readiness youth education",
    devices: "internet device access education"
  };
  return projectKeywords[answers.project] ?? "STEM education school youth";
}

export function normalizeGrantsGovHit(hit, context = {}) {
  const title = stripHtml(hit.title);
  const closeDate = parseGrantsGovDate(hit.closeDate);
  const categories = deriveCategories(context.fundingCategories);
  const status = titleCase(stripHtml(hit.oppStatus || hit.docType || "posted"));
  const officialUrl = `https://www.grants.gov/search-results-detail/${hit.id}`;

  return {
    id: `grantsgov-${hit.id}`,
    title,
    funder: stripHtml(hit.agency || hit.agencyCode || "Grants.gov"),
    description: `Live Grants.gov opportunity ${stripHtml(hit.number)} from ${stripHtml(hit.agency || "a federal agency")}. Confirm full eligibility, award details, and deadlines on the official Grants.gov page.`,
    categories,
    eligibleApplicants: ["schools", "colleges", "nonprofits", "community organizations"],
    fundingAmountMin: null,
    fundingAmountMax: null,
    deadline: closeDate,
    deadlineType: closeDate ? "fixed" : "check official source",
    status,
    applicationDifficulty: "advanced",
    requiresNonprofit: false,
    requiresSchoolSponsor: true,
    individualEligible: String(context.eligibilities ?? "").includes("21"),
    schoolEligible: true,
    clubEligible: false,
    teacherEligible: false,
    associationEligible: true,
    nonprofitEligible: true,
    youthGroupEligible: true,
    sponsorRequired: "Federal grants usually require an eligible school, college, nonprofit, government, or organization applicant.",
    schoolSponsorAllowed: true,
    geographicScope: "national",
    locationRestrictions: "United States federal opportunity; verify eligibility on Grants.gov.",
    projectTypes: categories,
    ageRequirements: "Student projects should apply through an eligible school, nonprofit, college, or organization sponsor.",
    officialUrl,
    sourceUrl: officialUrl,
    verifiedDate: new Date().toISOString().slice(0, 10),
    sourceCitation: "Live Grants.gov API search result",
    tags: ["grants-gov", "federal", "live-api", "education", "school", "youth", ...categories.map((category) => category.toLowerCase())],
    bestFor: ["teachers", "schools", "nonprofits", "community-groups", "STEM"],
    featured: false,
    spotlightEligible: false,
    isSample: false,
    sampleData: false,
    dataStatus: "live-api",
    serviceArea: "Grants.gov live federal search",
    coordinatesApproximate: false
  };
}

export async function searchGrantsGov({
  keyword = "STEM education school youth",
  fundingCategories = "ED|ST",
  eligibilities = "05|06|12|13|20|25",
  oppStatuses = "posted|forecasted",
  rows = 20
} = {}) {
  const response = await fetch("/api/grants-gov", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ keyword, fundingCategories, eligibilities, oppStatuses, rows })
  });

  if (!response.ok) {
    throw new Error(`Grants.gov search failed with status ${response.status}`);
  }

  const payload = await response.json();
  if (payload.errorcode && payload.errorcode !== 0) {
    throw new Error(payload.msg || "Grants.gov returned an error.");
  }

  const hits = payload?.data?.oppHits ?? [];
  return hits.map((hit) => normalizeGrantsGovHit(hit, { fundingCategories, eligibilities }));
}
