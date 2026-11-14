const tones = {
  neutral: "bg-neutral-100 text-neutral-600",
  blue: "bg-blue-50 text-blue-700",
  amber: "bg-amber-50 text-amber-700",
  violet: "bg-violet-50 text-violet-700",
  green: "bg-emerald-50 text-emerald-700",
} as const;

export type Tone = keyof typeof tones;

export default function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: Tone }) {
  return (
    <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}

export const channelTone: Record<string, Tone> = { call: "violet", ticket: "blue", email: "neutral" };
export const statusTone: Record<string, Tone> = { new: "neutral", triaged: "blue", "in-spec": "amber", done: "green" };
