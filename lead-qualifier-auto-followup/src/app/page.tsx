import LeadIntakeForm from "@/components/lead/lead-intake-form";

export default function Home() {
  return (
    <div className="mx-auto max-w-2xl rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-xl font-semibold tracking-tight">
        Tell us about your commercial real estate need
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        This goes directly to J.L. Cortez Commercial. We&apos;ll review and
        follow up shortly with next steps.
      </p>
      <div className="mt-6">
        <LeadIntakeForm />
      </div>
    </div>
  );
}
