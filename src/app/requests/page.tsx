import type { Metadata } from "next";
import Link from "next/link";
import Badge, { channelTone } from "@/components/Badge";
import { getRequests, getThemeForRequest } from "@/lib/data";

export const metadata: Metadata = { title: "Requests" };

export default function RequestsPage() {
  const requests = getRequests().map((r) => ({ ...r, theme: getThemeForRequest(r.id) }));
  const untriaged = requests.filter((r) => !r.theme).length;

  return (
    <div>
      <h1 className="text-xl font-semibold tracking-tight">Requests</h1>
      <p className="mt-1 text-sm text-neutral-500">
        {requests.length} requests · {untriaged} not assigned to a theme
      </p>

      <div className="mt-6 overflow-x-auto rounded-lg border border-neutral-200 bg-white">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-neutral-200 text-xs uppercase tracking-wide text-neutral-500">
            <tr>
              <th className="px-4 py-2.5 font-medium">ID</th>
              <th className="px-4 py-2.5 font-medium">Operator</th>
              <th className="px-4 py-2.5 font-medium">Request</th>
              <th className="px-4 py-2.5 font-medium">Channel</th>
              <th className="px-4 py-2.5 font-medium">Theme</th>
              <th className="px-4 py-2.5 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 align-top">
            {requests.map((r) => (
              <tr key={r.id} className="hover:bg-neutral-50">
                <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-neutral-500">{r.id}</td>
                <td className="whitespace-nowrap px-4 py-3">
                  <p className="text-neutral-900">{r.operator}</p>
                  <p className="text-xs text-neutral-500">
                    {r.country} · {r.operatorSize.toLocaleString("en-US")} bookings/mo
                  </p>
                </td>
                <td className="max-w-md px-4 py-3 leading-relaxed text-neutral-700">{r.text}</td>
                <td className="px-4 py-3">
                  <Badge tone={channelTone[r.channel]}>{r.channel}</Badge>
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  {r.theme ? (
                    <Link href={`/requirement/${r.theme.id}`} className="text-neutral-900 underline-offset-2 hover:underline">
                      {r.theme.name}
                    </Link>
                  ) : (
                    <span className="text-neutral-400">Untriaged</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-4 py-3 tabular-nums text-neutral-500">{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
