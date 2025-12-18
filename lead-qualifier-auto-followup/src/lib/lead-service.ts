import "server-only";

import { prisma } from "./db";
import { LeadIntakeInput } from "./validation";
import { enrichLeadWithAI } from "./ai";

export async function createLeadFromIntake(input: LeadIntakeInput, ip: string) {
  const rawIntakeJson = JSON.stringify({ ...input, ip });

  const lead = await prisma.lead.create({
    data: {
      name: input.name,
      email: input.email,
      phone: input.phone || null,
      company: input.company || null,

      persona: input.persona,
      requestType: input.requestType,

      locationText: input.locationText || null,
      propertyType: input.propertyType || null,
      sizeSfText: input.sizeSfText || null,
      budgetText: input.budgetText || null,
      timelineText: input.timelineText || null,
      notes: input.notes || null,

      rawIntakeJson,
    },
  });

  // Enrich synchronously for MVP so admin has AI data immediately.
  const enriched = await enrichLeadWithAI(lead);
  return enriched;
}

export async function listLeads(params: {
  q?: string;
  persona?: string;
  requestType?: string;
}) {
  const { q, persona, requestType } = params;

  return prisma.lead.findMany({
    where: {
      AND: [
        q
          ? {
              OR: [
                { name: { contains: q, mode: "insensitive" } },
                { email: { contains: q, mode: "insensitive" } },
              ],
            }
          : {},
        persona && persona !== "" ? { persona } : {},
        requestType && requestType !== "" ? { requestType } : {},
      ],
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getLeadById(id: string) {
  return prisma.lead.findUnique({ where: { id } });
}


