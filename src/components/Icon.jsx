import * as Icons from "lucide-react";

export default function Icon({ name = "Compass", className = "h-5 w-5", ...props }) {
  const LucideIcon = Icons[name] ?? Icons.Compass;
  return <LucideIcon aria-hidden="true" className={className} strokeWidth={2} {...props} />;
}
