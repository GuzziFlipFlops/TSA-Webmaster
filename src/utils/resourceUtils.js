import { categories, communityProfile } from "../data/communityData";

export function getCategory(categoryId) {
  return categories.find((category) => category.id === categoryId) ?? categories[0];
}

export function getResourcePillar(resource) {
  if (resource.pillar) return resource.pillar;
  if (resource.resourceType) return resource.resourceType;
  if (["food", "housing", "mental-health", "health", "student-family", "senior", "disability", "transportation"].includes(resource.categoryId)) {
    return "support-service";
  }
  if (resource.categoryId === "volunteer") return "volunteer-opportunity";
  if (resource.categoryId === "jobs") return "career-opportunity";
  if (resource.categoryId === "learning") return "learning-resource";
  if (resource.categoryId === "clubs") return "club-opportunity";
  return "support-service";
}

export function isLocationBasedResource(resource) {
  const format = resource.format ?? [];
  const hasPhysicalFormat = format.includes("in-person") || format.includes("outreach");
  const hasConcreteLocation =
    resource.coordinates?.length === 2 &&
    !["Online and phone support", "Phone, text, and chat support", "Online countywide information", "Regional service"].includes(resource.address);
  return hasPhysicalFormat && hasConcreteLocation && getResourcePillar(resource) !== "funding-opportunity";
}

export function isLearningResource(resource) {
  return getResourcePillar(resource) === "learning-resource";
}

export function isSupportService(resource) {
  return getResourcePillar(resource) === "support-service";
}

export function isClubOpportunity(resource) {
  return getResourcePillar(resource) === "club-opportunity" || resource.categoryId === "clubs";
}

export function isVolunteerOpportunity(resource) {
  return getResourcePillar(resource) === "volunteer-opportunity" || resource.tags?.includes("volunteer");
}

export function isCareerOpportunity(resource) {
  return getResourcePillar(resource) === "career-opportunity" || resource.categoryId === "jobs";
}

export function normalizeText(value) {
  return String(value ?? "").toLowerCase().trim();
}

export function titleCase(value) {
  return String(value ?? "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function formatDate(dateString) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(`${dateString}T12:00:00`));
}

export function formatTime(time) {
  if (!time) return "";
  const [hours, minutes] = time.split(":").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(2026, 0, 1, hours, minutes));
}

export function isOpenNow(resource, date = new Date()) {
  const weekly = resource?.hours?.weekly;
  if (!weekly?.length) return null;
  const day = date.getDay();
  const today = weekly.find((entry) => entry.day === day);
  if (!today) return false;
  if (today.allDay) return true;
  if (!today.open || !today.close) return null;
  const [openHour, openMinute] = today.open.split(":").map(Number);
  const [closeHour, closeMinute] = today.close.split(":").map(Number);
  const open = new Date(date);
  open.setHours(openHour, openMinute, 0, 0);
  const close = new Date(date);
  close.setHours(closeHour, closeMinute, 0, 0);
  return date >= open && date <= close;
}

export function distanceFromCommunity(resource) {
  const [lat1, lon1] = communityProfile.coordinates;
  const [lat2, lon2] = resource.coordinates ?? communityProfile.coordinates;
  const radians = (degrees) => (degrees * Math.PI) / 180;
  const earthRadiusMiles = 3958.8;
  const deltaLat = radians(lat2 - lat1);
  const deltaLon = radians(lon2 - lon1);
  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(radians(lat1)) * Math.cos(radians(lat2)) * Math.sin(deltaLon / 2) ** 2;
  return earthRadiusMiles * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function searchableText(resource) {
  const category = getCategory(resource.categoryId);
  return normalizeText(
    [
      resource.name,
      category.name,
      resource.description,
      resource.neighborhood,
      resource.address,
      resource.cost,
      resource.urgency,
      resource.resourceType,
      resource.pillar,
      resource.locationType,
      resource.clubType,
      resource.skillLevel,
      resource.meetingLocation,
      resource.meetingTime,
      resource.ageRange,
      resource.membershipRequirement,
      resource.publicAccess ? "public access" : "",
      resource.schoolOnly ? "school only" : "",
      resource.reservationRequired ? "reservation required" : "",
      ...(resource.services ?? []),
      ...(resource.tags ?? []),
      ...(resource.audience ?? []),
      ...(resource.languages ?? []),
      ...(resource.accessibility ?? []),
      ...(resource.equipmentAvailable ?? []),
      ...(resource.equipment ?? []),
      ...(resource.eligibility ?? [])
    ].join(" ")
  );
}

export function matchesSearch(resource, query) {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return true;
  return normalizedQuery
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => searchableText(resource).includes(term));
}

export function filterResources(resources, filters) {
  return resources.filter((resource) => {
    if (!matchesSearch(resource, filters.query)) return false;
    if (filters.category && resource.categoryId !== filters.category) return false;
    if (filters.audience && !(resource.audience ?? []).includes(filters.audience)) return false;
    if (filters.cost && resource.cost !== filters.cost) return false;
    if (filters.urgency && resource.urgency !== filters.urgency) return false;
    if (filters.language && !(resource.languages ?? []).some((language) => normalizeText(language).includes(filters.language))) {
      return false;
    }
    if (filters.accessibility && !(resource.accessibility ?? []).length) return false;
    if (filters.transportation && !resource.transportation) return false;
    if (filters.format && !(resource.format ?? []).includes(filters.format)) return false;
    if (filters.openNow && isOpenNow(resource) !== true) return false;
    if (filters.savedOnly && !(filters.savedIds ?? []).includes(resource.id)) return false;
    return true;
  });
}

export function sortResources(resources, sortKey, query = "") {
  const sorted = [...resources];
  const hasQuery = normalizeText(query).length > 0;
  if (sortKey === "az") return sorted.sort((a, b) => a.name.localeCompare(b.name));
  if (sortKey === "distance") return sorted.sort((a, b) => distanceFromCommunity(a) - distanceFromCommunity(b));
  if (sortKey === "open") return sorted.sort((a, b) => Number(isOpenNow(b) === true) - Number(isOpenNow(a) === true));
  if (sortKey === "free") {
    return sorted.sort((a, b) => {
      const score = (resource) => (resource.cost === "free" ? 0 : resource.cost === "free-or-low-cost" ? 1 : 2);
      return score(a) - score(b);
    });
  }
  return sorted.sort((a, b) => {
    const urgencyScore = { emergency: 5, urgent: 4, today: 3, "same-week": 2, routine: 1 };
    const searchBoost = (resource) => (hasQuery && normalizeText(resource.name).includes(normalizeText(query)) ? 2 : 0);
    return (urgencyScore[b.urgency] ?? 0) + searchBoost(b) - ((urgencyScore[a.urgency] ?? 0) + searchBoost(a));
  });
}

export const quizNeedMap = {
  food: ["food", "nutrition", "pantry"],
  housing: ["housing", "shelter", "unhoused", "legal"],
  "mental-health": ["mental-health", "crisis", "wellness"],
  transportation: ["transportation", "rides", "bus"],
  "school-tutoring": ["student", "school", "tutoring", "internet", "cte"],
  jobs: ["jobs", "career", "training", "resume"],
  family: ["family", "children", "parent"],
  senior: ["senior", "caregiver", "aging"],
  disability: ["disability", "accessibility", "paratransit"],
  volunteering: ["volunteer", "service-hours", "donation-drive"]
};

export function scoreResource(resource, answers) {
  const reasons = [];
  let score = 0;
  const haystack = searchableText(resource);
  const needTags = quizNeedMap[answers.need] ?? [];
  needTags.forEach((tag) => {
    if (haystack.includes(tag)) score += 6;
  });
  if (needTags.some((tag) => haystack.includes(tag))) {
    reasons.push(`matches ${titleCase(answers.need)}`);
  }
  if (answers.audience && (resource.audience ?? []).includes(answers.audience)) {
    score += 4;
    reasons.push(`serves ${titleCase(answers.audience)}`);
  }
  if (answers.urgency === "emergency" && ["emergency", "urgent"].includes(resource.urgency)) {
    score += 6;
    reasons.push("handles urgent situations");
  } else if (answers.urgency && resource.urgency === answers.urgency) {
    score += 3;
    reasons.push(`fits ${titleCase(answers.urgency)} timing`);
  }
  if (answers.cost === "free" && resource.cost === "free") {
    score += 3;
    reasons.push("is free");
  }
  if (answers.format && (resource.format ?? []).includes(answers.format)) {
    score += 2;
    reasons.push(`offers ${titleCase(answers.format)} help`);
  }
  if (answers.language && (resource.languages ?? []).some((language) => normalizeText(language).includes(answers.language))) {
    score += 2;
    reasons.push(`supports ${titleCase(answers.language)}`);
  }
  if (answers.accessibility && (resource.accessibility ?? []).length) {
    score += 2;
    reasons.push("lists accessibility support");
  }
  return { resource, score, reasons: reasons.slice(0, 3) };
}

export function recommendedResources(resources, answers) {
  return resources
    .map((resource) => scoreResource(resource, answers))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
}

export function resourceById(resources, id) {
  return resources.find((resource) => resource.id === id);
}
