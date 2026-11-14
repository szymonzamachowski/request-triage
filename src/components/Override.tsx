import type { ThemeView } from "@/lib/types";

/** Small "Manual override" badge; the reason is available on hover. */
export function OverrideBadge({ override }: { override: NonNullable<ThemeView["override"]> }) {
  return (
    <span
      title={`${override.reason} — ${override.by}`}
      className="inline-flex items-center gap-1 whitespace-nowrap rounded bg-orange-50 px-1.5 py-0.5 text-xs font-medium text-orange-700 ring-1 ring-orange-200"
    >
      <span aria-hidden>↑</span> Manual override
    </span>
  );
}

export function OverrideReason({ override, className = "" }: { override: NonNullable<ThemeView["override"]>; className?: string }) {
  return (
    <p className={`text-xs leading-relaxed text-neutral-600 ${className}`}>
      <span className="font-medium text-neutral-800">Why ({override.by}): </span>
      {override.reason}
    </p>
  );
}

export function FirstStep({ text, className = "" }: { text: string; className?: string }) {
  return (
    <div className={`rounded-md border-l-2 border-orange-400 bg-orange-50 px-2.5 py-2 text-xs leading-relaxed text-orange-950 ${className}`}>
      <span className="font-semibold">First step: </span>
      {text}
    </div>
  );
}
