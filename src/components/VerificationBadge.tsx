import type { Verification } from "@/data/temple";

const LABELS: Record<Verification, string> = {
  sourced: "Sourced",
  approximate: "Approximate",
  unverified: "Unverified",
  pending: "Awaiting verification",
};

const HINTS: Record<Verification, string> = {
  sourced: "Corroborated by the public sources listed on this page.",
  approximate: "An estimate or range; actual values vary.",
  unverified: "Widely reported but not yet confirmed with the temple trust.",
  pending: "We do not yet have reliable information for this item.",
};

export function VerificationBadge({ status }: { status: Verification }) {
  return (
    <span className={`badge badge-${status}`} title={HINTS[status]}>
      {LABELS[status]}
    </span>
  );
}
