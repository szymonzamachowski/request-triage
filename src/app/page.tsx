import Board from "@/components/Board";
import { COLUMNS, getThemes, getUnclustered } from "@/lib/data";

export default function BoardPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold tracking-tight">Board</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Themes ranked by score = operators asking × pain × log₁₀(bookings) ÷ effort.
      </p>
      <div className="mt-6">
        <Board columns={COLUMNS} themes={getThemes()} unclustered={getUnclustered()} />
      </div>
    </div>
  );
}
