import type { Metadata } from "next";
import RequestsTable, { type RequestRow } from "@/components/RequestsTable";
import { getRequests, getThemeForRequest, getUnclusteredFor } from "@/lib/data";

export const metadata: Metadata = { title: "Requests" };

export default function RequestsPage() {
  const rows: RequestRow[] = getRequests().map((r) => {
    const theme = getThemeForRequest(r.id);
    return {
      ...r,
      theme: theme ? { id: theme.id, name: theme.name } : null,
      disposition: theme ? undefined : getUnclusteredFor(r.id)?.disposition,
    };
  });
  const outside = rows.filter((r) => !r.theme).length;

  return (
    <div>
      <h1 className="text-xl font-semibold tracking-tight">Requests</h1>
      <p className="mt-1 text-sm text-neutral-500">
        {rows.length} requests · {outside} outside themes · click a column header to sort
      </p>
      <div className="mt-6">
        <RequestsTable rows={rows} />
      </div>
    </div>
  );
}
