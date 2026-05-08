import { daysUntilDeadline, grantAmountLabel, grantDeadlineLabel } from "../utils/grantUtils";
import { titleCase } from "../utils/resourceUtils";
import { Badge } from "./UI.jsx";

export function FundingAmountBadge({ grant }) {
  return <Badge color="amber">{grantAmountLabel(grant)}</Badge>;
}

export function DeadlineBadge({ grant }) {
  const days = daysUntilDeadline(grant);
  if (grant.sampleData) return <Badge color="slate">Needs verification</Badge>;
  if (grant.deadlineType === "rolling") return <Badge color="green">Rolling deadline</Badge>;
  if (days !== null && days >= 0 && days <= 60) return <Badge color="red">Closing in {days} days</Badge>;
  if (days !== null && days < 0) return <Badge color="slate">Annual cycle</Badge>;
  return <Badge color="amber">{grantDeadlineLabel(grant)}</Badge>;
}

export function EligibilityBadge({ children }) {
  return <Badge color="blue">{children}</Badge>;
}

export function GrantStatusPill({ grant }) {
  if (grant.sampleData) return <Badge color="slate">Needs verification</Badge>;
  if (grant.status === "Rolling") return <Badge color="green">Rolling</Badge>;
  return <Badge color="amber">{titleCase(grant.status)}</Badge>;
}
