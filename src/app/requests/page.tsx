import type { Metadata } from "next";
import Link from "next/link";
import Badge, { priorityTone } from "@/components/Badge";
import { getRequests, getThemes } from "@/lib/data";

export const metadata: Metadata = { title: "Requests" };

export default function RequestsPage() {
  const requests = getRequests();
  const themeNames = new Map(getThemes().map((t) => [t.id, t.name]));
  const untriaged = requests.filter((r) => !r.themeId).length;

  return (
    <div>
      <h1 className="text-xl font-semibold tracking-tight">Requests</h1>
      <p className="mt-1 text-sm text-neutral-500">
        {requests.length} requests · {untriaged} not yet assigned to a theme
      </p>

      <div className="mt-6 overflow-x-auto rounded-lg border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 text-xs uppercase tracking-wide text-neutral-500">
            <tr>
              <th className="px-4 py-2.5 font-medium">ID</th>
              <th className="px-4 py-2.5 font-medium">Title</th>
              <th className="px-4 py-2.5 font-medium">Requester</th>
              <th className="px-4 py-2.5 font-medium">Source</th>
              <th className="px-4 py-2.5 font-medium">Priority</th>
              <th className="px-4 py-2.5 font-medium">Theme</th>
              <th className="px-4 py-2.5 font-medium">Received</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {requests.map((r) => (
              <tr key={r.id} className="hover:bg-neutral-50">
                <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-neutral-500">{r.id}</td>
                <td className="px-4 py-2.5 text-neutral-900">{r.title}</td>
                <td className="whitespace-nowrap px-4 py-2.5 text-neutral-600">{r.requester}</td>
                <td className="px-4 py-2.5 capitalize text-neutral-600">{r.source}</td>
                <td className="px-4 py-2.5">
                  <Badge tone={priorityTone[r.priority]}>{r.priority}</Badge>
                </td>
                <td className="whitespace-nowrap px-4 py-2.5">
                  {r.themeId ? (
                    <Link href={`/requirement/${r.themeId}`} className="text-neutral-900 underline-offset-2 hover:underline">
                      {themeNames.get(r.themeId) ?? r.themeId}
                    </Link>
                  ) : (
                    <span className="text-neutral-400">Untriaged</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-4 py-2.5 tabular-nums text-neutral-500">{r.receivedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
