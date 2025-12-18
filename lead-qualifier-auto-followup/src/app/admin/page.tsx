import Link from "next/link";
import { listLeads } from "@/lib/lead-service";
import { adminLeadQuerySchema } from "@/lib/validation";
import { withPrefix } from "@/lib/route-prefix";

interface AdminPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const parsed = adminLeadQuerySchema.safeParse({
    q: typeof searchParams.q === "string" ? searchParams.q : undefined,
    persona:
      typeof searchParams.persona === "string"
        ? searchParams.persona
        : undefined,
    requestType:
      typeof searchParams.requestType === "string"
        ? searchParams.requestType
        : undefined,
  });

  const filters = parsed.success ? parsed.data : {};

  const leads = await listLeads(filters);

  return (
    <div className="space-y-4">
      <form className="flex flex-wrap items-end gap-3 rounded-lg border border-slate-200 bg-white p-3 text-xs">
        <div className="flex-1 min-w-[140px]">
          <label className="mb-1 block font-medium text-slate-700">
            Search
          </label>
          <input
            name="q"
            defaultValue={filters.q}
            placeholder="Name or email"
            className="h-8 w-full rounded-md border border-slate-300 px-2 text-xs outline-none ring-slate-900/5 focus:border-slate-900 focus:ring-2"
          />
        </div>
        <div className="min-w-[140px]">
          <label className="mb-1 block font-medium text-slate-700">
            Persona
          </label>
          <select
            name="persona"
            defaultValue={filters.persona || ""}
            className="h-8 w-full rounded-md border border-slate-300 bg-white px-2 text-xs outline-none ring-slate-900/5 focus:border-slate-900 focus:ring-2"
          >
            <option value="">All</option>
            <option value="owner">Owner</option>
            <option value="landlord">Landlord</option>
            <option value="business_owner">Business owner</option>
            <option value="broker">Broker</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="min-w-[140px]">
          <label className="mb-1 block font-medium text-slate-700">
            Request type
          </label>
          <select
            name="requestType"
            defaultValue={filters.requestType || ""}
            className="h-8 w-full rounded-md border border-slate-300 bg-white px-2 text-xs outline-none ring-slate-900/5 focus:border-slate-900 focus:ring-2"
          >
            <option value="">All</option>
            <option value="sell">Sell</option>
            <option value="lease_out">Lease out</option>
            <option value="lease_space">Lease space</option>
            <option value="buy">Buy</option>
            <option value="unsure">Unsure</option>
          </select>
        </div>
        <button
          type="submit"
          className="h-8 rounded-md bg-slate-900 px-3 text-xs font-medium text-white hover:bg-slate-900/90"
        >
          Apply
        </button>
        <a
          href={withPrefix("/admin")}
          className="h-8 rounded-md border border-slate-300 px-3 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          Reset
        </a>
        <a
          href={withPrefix("/api/leads/export")}
          className="ml-auto h-8 rounded-md border border-slate-300 px-3 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          Export CSV
        </a>
      </form>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white text-xs">
        <table className="min-w-full border-collapse">
          <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Email</th>
              <th className="px-3 py-2 text-left">Persona</th>
              <th className="px-3 py-2 text-left">Request</th>
              <th className="px-3 py-2 text-left">Score</th>
              <th className="px-3 py-2 text-left">Created</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-3 py-6 text-center text-xs text-slate-500"
                >
                  No leads yet.
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-3 py-2">
                    <Link
                      href={withPrefix(`/admin/${lead.id}`)}
                      className="text-xs font-medium text-slate-900 underline-offset-2 hover:underline"
                    >
                      {lead.name}
                    </Link>
                  </td>
                  <td className="px-3 py-2 text-slate-700">{lead.email}</td>
                  <td className="px-3 py-2 text-slate-700">{lead.persona}</td>
                  <td className="px-3 py-2 text-slate-700">
                    {lead.requestType}
                  </td>
                  <td className="px-3 py-2 text-slate-700">
                    {lead.aiLeadScore ?? "–"}
                  </td>
                  <td className="px-3 py-2 text-slate-500">
                    {lead.createdAt.toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


