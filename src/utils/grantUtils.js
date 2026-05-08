import { grants } from "../data/communityData";
import { formatDate, normalizeText, titleCase } from "./resourceUtils";

export function formatMoney(value) {
  if (value === null || value === undefined) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

export function grantAmountLabel(grant) {
  if (!grant.fundingAmountMin && !grant.fundingAmountMax) return "Amount varies";
  if (grant.fundingAmountMin === grant.fundingAmountMax) return formatMoney(grant.fundingAmountMax);
  if (!grant.fundingAmountMin) return `Up to ${formatMoney(grant.fundingAmountMax)}`;
  return `${formatMoney(grant.fundingAmountMin)}-${formatMoney(grant.fundingAmountMax)}`;
}

export function grantDeadlineLabel(grant) {
  if (grant.sampleData) return "Deadline needs verification";
  if (grant.deadlineType === "rolling") return "Rolling deadline";
  if (!grant.deadline) return titleCase(grant.deadlineType ?? "Check official source");
  return formatDate(grant.deadline);
}

export function daysUntilDeadline(grant, now = new Date("2026-05-07T12:00:00")) {
  if (!grant.deadline || grant.sampleData) return null;
  const deadline = new Date(`${grant.deadline}T23:59:00`);
  const difference = deadline.getTime() - now.getTime();
  return Math.ceil(difference / (1000 * 60 * 60 * 24));
}

export function isClosingSoon(grant) {
  const days = daysUntilDeadline(grant);
  return days !== null && days >= 0 && days <= 60;
}

export function grantSearchText(grant) {
  return normalizeText(
    [
      grant.title,
      grant.funder,
      grant.description,
      grant.deadlineType,
      grant.status,
      grant.applicationDifficulty,
      grant.geographicScope,
      grant.sponsorRequired,
      ...(grant.categories ?? []),
      ...(grant.eligibleApplicants ?? []),
      ...(grant.projectTypes ?? []),
      ...(grant.tags ?? []),
      ...(grant.bestFor ?? [])
    ].join(" ")
  );
}

export function matchesGrantSearch(grant, query) {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return true;
  return normalizedQuery
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => grantSearchText(grant).includes(term));
}

export function filterGrants(grantList, filters) {
  return grantList.filter((grant) => {
    if (!matchesGrantSearch(grant, filters.query)) return false;
    if (filters.category && !(grant.categories ?? []).includes(filters.category)) return false;
    if (filters.bestFor && !(grant.bestFor ?? []).includes(filters.bestFor)) return false;
    if (filters.difficulty && grant.applicationDifficulty !== filters.difficulty) return false;
    if (filters.scope && grant.geographicScope !== filters.scope) return false;
    if (filters.rolling && grant.deadlineType !== "rolling") return false;
    if (filters.closingSoon && !isClosingSoon(grant)) return false;
    if (filters.schoolEligible && !grant.schoolEligible) return false;
    if (filters.clubEligible && !grant.clubEligible) return false;
    if (filters.teacherEligible && !grant.teacherEligible) return false;
    if (filters.nonprofitEligible && !grant.nonprofitEligible) return false;
    if (filters.individualEligible && !grant.individualEligible) return false;
    if (filters.noNonprofitRequired && grant.requiresNonprofit) return false;
    if (filters.schoolSponsorAllowed && !grant.schoolSponsorAllowed) return false;
    if (filters.amount) {
      const requested = Number(filters.amount);
      if ((grant.fundingAmountMax ?? 0) < requested) return false;
    }
    if (filters.savedOnly && !(filters.savedIds ?? []).includes(grant.id)) return false;
    return true;
  });
}

export function sortGrants(grantList, sortKey, query = "") {
  const sorted = [...grantList];
  if (sortKey === "az") return sorted.sort((a, b) => a.title.localeCompare(b.title));
  if (sortKey === "amount") return sorted.sort((a, b) => (b.fundingAmountMax ?? 0) - (a.fundingAmountMax ?? 0));
  if (sortKey === "easy") {
    const score = { easy: 0, moderate: 1, advanced: 2 };
    return sorted.sort((a, b) => (score[a.applicationDifficulty] ?? 3) - (score[b.applicationDifficulty] ?? 3));
  }
  if (sortKey === "verified") return sorted.sort((a, b) => b.verifiedDate.localeCompare(a.verifiedDate));
  if (sortKey === "closing") {
    return sorted.sort((a, b) => {
      const aDays = daysUntilDeadline(a);
      const bDays = daysUntilDeadline(b);
      if (aDays === null && bDays === null) return 0;
      if (aDays === null) return 1;
      if (bDays === null) return -1;
      if (aDays < 0 && bDays >= 0) return 1;
      if (bDays < 0 && aDays >= 0) return -1;
      return aDays - bDays;
    });
  }
  const normalizedQuery = normalizeText(query);
  return sorted.sort((a, b) => {
    const score = (grant) => {
      let value = 0;
      if (grant.featured) value += 4;
      if (grant.clubEligible) value += 2;
      if (grant.teacherEligible) value += 2;
      if (grant.schoolEligible) value += 2;
      if (grant.sampleData) value -= 2;
      if (normalizedQuery && normalizeText(grant.title).includes(normalizedQuery)) value += 4;
      return value;
    };
    return score(b) - score(a);
  });
}

export const grantQuizOptions = {
  applicant: [
    { id: "students", label: "Student with school/club support" },
    { id: "teachers", label: "Teacher" },
    { id: "school-clubs", label: "School club" },
    { id: "stem-team", label: "TSA/robotics/STEM team" },
    { id: "arts", label: "Art/music group" },
    { id: "association", label: "Parent/community association" },
    { id: "nonprofits", label: "Nonprofit/youth organization" },
    { id: "community-groups", label: "Community group" }
  ],
  project: [
    { id: "tutoring", label: "Tutoring/support program", tags: ["tutoring", "youth", "school"] },
    { id: "stem", label: "STEM/robotics project", tags: ["stem", "robotics", "engineering", "cte"] },
    { id: "art", label: "Art/music project", tags: ["art", "creative"] },
    { id: "supplies", label: "Classroom supplies", tags: ["classroom", "supplies"] },
    { id: "club", label: "School club activity", tags: ["school-club", "club", "competition"] },
    { id: "service", label: "Community service project", tags: ["service", "community"] },
    { id: "environment", label: "Environmental project", tags: ["environment", "sustainability"] },
    { id: "accessibility", label: "Accessibility/inclusion project", tags: ["accessibility", "inclusion"] },
    { id: "career", label: "College/career event", tags: ["career", "cte", "enrichment"] },
    { id: "devices", label: "Internet/device access", tags: ["internet", "device-access", "technology"] }
  ]
};

export function scoreGrant(grant, answers) {
  let score = 0;
  const reasons = [];
  const text = grantSearchText(grant);
  const applicant = answers.applicant;

  const applicantChecks = {
    students: grant.bestFor?.includes("students") || grant.clubEligible || grant.schoolEligible,
    teachers: grant.teacherEligible,
    "school-clubs": grant.clubEligible,
    "stem-team": grant.clubEligible && text.includes("stem"),
    arts: grant.bestFor?.includes("arts") || text.includes("art"),
    association: grant.associationEligible,
    nonprofits: grant.nonprofitEligible || grant.youthGroupEligible,
    "community-groups": grant.bestFor?.includes("community-groups") || grant.associationEligible
  };

  if (applicantChecks[applicant]) {
    score += 7;
    reasons.push(`supports ${titleCase(applicant)}`);
  }

  const projectOption = grantQuizOptions.project.find((option) => option.id === answers.project);
  if (projectOption?.tags?.some((tag) => text.includes(tag))) {
    score += 7;
    reasons.push(`fits ${projectOption.label.toLowerCase()}`);
  }

  if (answers.sponsor === "yes" && (grant.schoolSponsorAllowed || grant.requiresSchoolSponsor || grant.requiresNonprofit)) {
    score += 4;
    reasons.push("works with a school, club, association, or nonprofit sponsor");
  }
  if (answers.sponsor === "no" && !grant.requiresNonprofit && !grant.requiresSchoolSponsor) {
    score += 2;
    reasons.push("does not require a formal nonprofit or school applicant");
  }

  if (answers.amount && (grant.fundingAmountMax ?? 0) >= Number(answers.amount)) {
    score += 3;
    reasons.push(`can cover up to ${grantAmountLabel(grant)}`);
  }
  if (answers.timing === "soon" && (isClosingSoon(grant) || grant.deadlineType === "rolling")) {
    score += 3;
    reasons.push(grant.deadlineType === "rolling" ? "has a rolling deadline" : "has a near-term deadline");
  }
  if (answers.difficulty) {
    const rank = { easy: 1, moderate: 2, advanced: 3 };
    if ((rank[grant.applicationDifficulty] ?? 3) <= (rank[answers.difficulty] ?? 3)) {
      score += 2;
      reasons.push(`matches ${answers.difficulty} application effort`);
    }
  }
  if (answers.impact && text.includes(answers.impact)) {
    score += 2;
    reasons.push(`matches ${answers.impact.replace("-", " ")} impact`);
  }
  if (grant.sampleData) score -= 3;

  return { grant, score, reasons: reasons.slice(0, 4) };
}

export function recommendedGrants(answers) {
  return grants
    .map((grant) => scoreGrant(grant, answers))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
}

export function grantById(id) {
  return grants.find((grant) => grant.id === id);
}
