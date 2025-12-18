import { notFound } from "next/navigation";
import { getLeadById } from "@/lib/lead-service";
import { CopyToClipboard } from "@/components/common/copy-to-clipboard";

interface LeadDetailPageProps {
  params: { id: string };
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const lead = await getLeadById(params.id);
  if (!lead) {
    notFound();
  }

  const missingQuestions: string[] = lead.aiMissingInfo
    ? (() => {
        try {
          return JSON.parse(lead.aiMissingInfo as string);
        } catch {
          return [];
        }
      })()
    : [];

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-white p-4 text-xs">
        <h3 className="text-sm font-semibold text-slate-900">
          Contact & intake
        </h3>
        <dl className="mt-3 grid gap-2 sm:grid-cols-2">
          <div>
            <dt className="text-[11px] uppercase tracking-wide text-slate-500">
              Name
            </dt>
            <dd className="text-xs text-slate-900">{lead.name}</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-wide text-slate-500">
              Email
            </dt>
            <dd className="text-xs text-slate-900">{lead.email}</dd>
          </div>
          {lead.phone && (
            <div>
              <dt className="text-[11px] uppercase tracking-wide text-slate-500">
                Phone
              </dt>
              <dd className="text-xs text-slate-900">{lead.phone}</dd>
            </div>
          )}
          {lead.company && (
            <div>
              <dt className="text-[11px] uppercase tracking-wide text-slate-500">
                Company
              </dt>
              <dd className="text-xs text-slate-900">{lead.company}</dd>
            </div>
          )}
          <div>
            <dt className="text-[11px] uppercase tracking-wide text-slate-500">
              Persona
            </dt>
            <dd className="text-xs text-slate-900">{lead.persona}</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-wide text-slate-500">
              Request type
            </dt>
            <dd className="text-xs text-slate-900">{lead.requestType}</dd>
          </div>
          {lead.locationText && (
            <div className="sm:col-span-2">
              <dt className="text-[11px] uppercase tracking-wide text-slate-500">
                Location(s)
              </dt>
              <dd className="text-xs text-slate-900">{lead.locationText}</dd>
            </div>
          )}
          {lead.propertyType && (
            <div className="sm:col-span-2">
              <dt className="text-[11px] uppercase tracking-wide text-slate-500">
                Property type
              </dt>
              <dd className="text-xs text-slate-900">{lead.propertyType}</dd>
            </div>
          )}
          {lead.sizeSfText && (
            <div className="sm:col-span-2">
              <dt className="text-[11px] uppercase tracking-wide text-slate-500">
                Size
              </dt>
              <dd className="text-xs text-slate-900">{lead.sizeSfText}</dd>
            </div>
          )}
          {lead.budgetText && (
            <div className="sm:col-span-2">
              <dt className="text-[11px] uppercase tracking-wide text-slate-500">
                Budget / rent range
              </dt>
              <dd className="text-xs text-slate-900">{lead.budgetText}</dd>
            </div>
          )}
          {lead.timelineText && (
            <div className="sm:col-span-2">
              <dt className="text-[11px] uppercase tracking-wide text-slate-500">
                Timeline
              </dt>
              <dd className="text-xs text-slate-900">{lead.timelineText}</dd>
            </div>
          )}
          {lead.notes && (
            <div className="sm:col-span-2">
              <dt className="text-[11px] uppercase tracking-wide text-slate-500">
                Notes
              </dt>
              <dd className="whitespace-pre-wrap text-xs text-slate-900">
                {lead.notes}
              </dd>
            </div>
          )}
        </dl>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 text-xs">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-slate-900">
              AI assessment
            </h3>
            {typeof lead.aiLeadScore === "number" && (
              <span className="inline-flex items-center rounded-full bg-slate-900 px-2 py-0.5 text-[11px] font-medium text-white">
                Score {lead.aiLeadScore}/100
              </span>
            )}
          </div>
          {lead.aiLeadType && (
            <p className="text-xs text-slate-700">
              Lead type:{" "}
              <span className="font-medium text-slate-900">
                {lead.aiLeadType}
              </span>
            </p>
          )}
          {lead.aiSummary && (
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Summary
              </p>
              <pre className="whitespace-pre-wrap text-xs text-slate-900">
                {lead.aiSummary}
              </pre>
            </div>
          )}
          {missingQuestions.length > 0 && (
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Missing info (ask on your next touch)
              </p>
              <ul className="list-disc space-y-1 pl-4 text-xs text-slate-900">
                {missingQuestions.map((q, idx) => (
                  <li key={idx}>{q}</li>
                ))}
              </ul>
            </div>
          )}
          {lead.aiNextStep && (
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Recommended next step
              </p>
              <p className="text-xs text-slate-900">{lead.aiNextStep}</p>
            </div>
          )}
        </div>

        <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 text-xs">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-slate-900">
              Follow-up drafts
            </h3>
          </div>
          {lead.aiFollowUpEmailSubject && lead.aiFollowUpEmailBody && (
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Email
                </p>
                <CopyToClipboard
                  label="Copy email"
                  value={`Subject: ${lead.aiFollowUpEmailSubject}\n\n${lead.aiFollowUpEmailBody}`}
                />
              </div>
              <p className="text-xs font-medium text-slate-900">
                {lead.aiFollowUpEmailSubject}
              </p>
              <pre className="whitespace-pre-wrap text-xs text-slate-900">
                {lead.aiFollowUpEmailBody}
              </pre>
            </div>
          )}
          {lead.aiFollowUpText && (
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Text
                </p>
                <CopyToClipboard
                  label="Copy text"
                  value={lead.aiFollowUpText}
                />
              </div>
              <pre className="whitespace-pre-wrap text-xs text-slate-900">
                {lead.aiFollowUpText}
              </pre>
            </div>
          )}
          {lead.aiModel && (
            <p className="mt-2 text-[11px] text-slate-500">
              Generated via {lead.aiModel}{" "}
              {lead.aiRunAt && `on ${lead.aiRunAt.toLocaleString()}`}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}


