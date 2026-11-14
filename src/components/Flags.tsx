import { flag } from "@/lib/countries";

export default function Flags({ countries }: { countries: string[] }) {
  return (
    <span className="inline-flex gap-0.5 text-sm leading-none">
      {countries.map((c) => (
        <span key={c} role="img" aria-label={c} title={c}>
          {flag(c)}
        </span>
      ))}
    </span>
  );
}
