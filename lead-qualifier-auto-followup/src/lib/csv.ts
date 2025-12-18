import { Lead } from "@prisma/client";

export function leadsToCsv(leads: Lead[]): string {
  const headers = [
    "id",
    "createdAt",
    "updatedAt",
    "name",
    "email",
    "phone",
    "company",
    "persona",
    "requestType",
    "locationText",
    "propertyType",
    "sizeSfText",
    "budgetText",
    "timelineText",
    "notes",
    "aiLeadType",
    "aiLeadScore",
    "aiSummary",
    "aiMissingInfo",
    "aiNextStep",
    "aiFollowUpEmailSubject",
    "aiFollowUpEmailBody",
    "aiFollowUpText",
    "aiModel",
    "aiRunAt",
  ];

  const escape = (value: unknown) => {
    if (value === null || value === undefined) return "";
    const str = String(value);
    if (/[",\n]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows = leads.map((lead) =>
    [
      lead.id,
      lead.createdAt.toISOString(),
      lead.updatedAt.toISOString(),
      lead.name,
      lead.email,
      lead.phone,
      lead.company,
      lead.persona,
      lead.requestType,
      lead.locationText,
      lead.propertyType,
      lead.sizeSfText,
      lead.budgetText,
      lead.timelineText,
      lead.notes,
      lead.aiLeadType,
      lead.aiLeadScore,
      lead.aiSummary,
      lead.aiMissingInfo,
      lead.aiNextStep,
      lead.aiFollowUpEmailSubject,
      lead.aiFollowUpEmailBody,
      lead.aiFollowUpText,
      lead.aiModel,
      lead.aiRunAt ? lead.aiRunAt.toISOString() : "",
    ].map(escape).join(","),
  );

  return [headers.join(","), ...rows].join("\n");
}


