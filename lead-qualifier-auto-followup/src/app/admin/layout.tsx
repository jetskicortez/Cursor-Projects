import { requireAdmin } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight">Leads</h2>
        <form
          action="/api/auth/logout"
          method="post"
          className="text-xs text-slate-600"
        >
          <button
            type="submit"
            className="rounded-md border border-slate-300 px-2 py-1 text-xs hover:bg-slate-50"
          >
            Sign out
          </button>
        </form>
      </div>
      {children}
    </div>
  );
}


