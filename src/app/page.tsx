import Link from "next/link";
import Badge from "@/components/Badge";
import { STATUSES, getRequestsForTheme, getThemes } from "@/lib/data";

export default function BoardPage() {
  const themes = getThemes();

  return (
    <div>
      <h1 className="text-xl font-semibold tracking-tight">Board</h1>
      <p className="mt-1 text-sm text-neutral-500">Themes grouped by triage status.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATUSES.map((status) => {
          const column = themes.filter((t) => t.status === status.id);
          return (
            <section key={status.id} className="rounded-lg bg-neutral-100/70 p-3">
              <h2 className="mb-3 flex items-center justify-between px-1 text-xs font-medium uppercase tracking-wide text-neutral-500">
                {status.label}
                <span className="tabular-nums">{column.length}</span>
              </h2>
              <ul className="space-y-2">
                {column.map((theme) => {
                  const count = getRequestsForTheme(theme.id).length;
                  return (
                    <li key={theme.id}>
                      <Link
                        href={`/requirement/${theme.id}`}
                        className="block rounded-md border border-neutral-200 bg-white p-3 shadow-xs transition hover:border-neutral-300 hover:shadow-sm"
                      >
                        <p className="text-sm font-medium text-neutral-900">{theme.name}</p>
                        <p className="mt-1 line-clamp-2 text-xs text-neutral-500">{theme.summary}</p>
                        <div className="mt-3 flex items-center justify-between text-xs text-neutral-500">
                          <Badge>{theme.owner}</Badge>
                          <span>
                            {count} request{count === 1 ? "" : "s"}
                          </span>
                        </div>
                      </Link>
                    </li>
                  );
                })}
                {column.length === 0 && <li className="px-1 py-4 text-xs text-neutral-400">No themes</li>}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
