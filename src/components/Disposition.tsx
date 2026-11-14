import type { Disposition } from "@/lib/types";

const styles: Record<Disposition["type"] | "unclustered", string> = {
  support: "text-violet-700",
  backlog: "text-blue-700",
  unclustered: "text-neutral-400",
};

/** Label for a request that isn't part of any theme. */
export default function DispositionLabel({ disposition, className = "" }: { disposition?: Disposition; className?: string }) {
  const type = disposition?.type ?? "unclustered";
  return (
    <span title={disposition?.reason} className={`${styles[type]} ${className}`}>
      {disposition?.label ?? "Unclustered"}
    </span>
  );
}
