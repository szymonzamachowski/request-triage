const tones = {
  neutral: "bg-neutral-100 text-neutral-600",
  blue: "bg-blue-50 text-blue-700",
  amber: "bg-amber-50 text-amber-700",
  red: "bg-red-50 text-red-700",
  violet: "bg-violet-50 text-violet-700",
  green: "bg-emerald-50 text-emerald-700",
} as const;

export type Tone = keyof typeof tones;

export default function Badge({
  children,
  tone = "neutral",
  title,
}: {
  children: React.ReactNode;
  tone?: Tone;
  title?: string;
}) {
  return (
    <span
      title={title}
      className={`inline-flex items-center whitespace-nowrap rounded px-1.5 py-0.5 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export const channelTone: Record<string, Tone> = { call: "violet", ticket: "blue", email: "neutral" };
export const painTone: Record<number, Tone> = { 1: "neutral", 2: "amber", 3: "red" };
export const effortTone: Record<string, Tone> = { S: "green", M: "blue", L: "violet" };

export function PainBadge({ value, reason }: { value: number; reason?: string }) {
  return (
    <Badge tone={painTone[value]} title={reason}>
      Pain {value}
    </Badge>
  );
}

export function EffortBadge({ value, reason }: { value: string; reason?: string }) {
  return (
    <Badge tone={effortTone[value]} title={reason}>
      Effort {value}
    </Badge>
  );
}
