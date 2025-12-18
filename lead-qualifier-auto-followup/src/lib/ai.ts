import "server-only";

import OpenAI from "openai";
import { Lead } from "@prisma/client";
import { prisma } from "./db";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const DEFAULT_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

type EnrichedLead = {
  lead_type: "seller" | "landlord" | "tenant" | "buyer" | "other";
  lead_score: number;
  summary_bullets: string[];
  missing_info_questions: string[];
  recommended_next_step: string;
  followup_email: { subject: string; body: string };
  followup_text: string;
  compliance_notes: string[];
};

export async function enrichLeadWithAI(lead: Lead) {
  if (!process.env.OPENAI_API_KEY) {
    console.warn("OPENAI_API_KEY is not set; skipping AI enrichment.");
    return lead;
  }

  const model = DEFAULT_MODEL;

  try {
    const prompt = `
You are assisting a commercial real estate broker based in Pittsburgh, Pennsylvania.
You will receive a raw lead from a public web intake form.

Return JSON ONLY matching this TypeScript type exactly:
{
  "lead_type": "seller" | "landlord" | "tenant" | "buyer" | "other",
  "lead_score": number, // 0-100
  "summary_bullets": string[],
  "missing_info_questions": string[],
  "recommended_next_step": string,
  "followup_email": { "subject": string, "body": string },
  "followup_text": string,
  "compliance_notes": string[]
}

Guidelines:
- Tone: professional, warm, concise, Pittsburgh/PA aware but not cheesy.
- Lead score: higher is more qualified and time-sensitive.
- Summary bullets: focus on who they are, what they need (sell/lease/buy), timing, basics of property/location/budget.
- Missing info questions: 3-6 specific questions that would unblock the broker's next step.
- Recommended next step: one clear, broker-facing action (e.g., "Call today to clarify X, then send Y").
- Email body: ready to send, short, direct, include 2 clear scheduling options with local time context
  (e.g., "tomorrow at 11:30am" vs "Thursday at 3:00pm"), mention Pittsburgh area where natural.
- Text: short, friendly, easy to forward, lightly references the broker and commercial real estate need.
- Compliance notes: anything the broker should be careful about (e.g., fair housing, confidentiality).

Raw lead data (JSON):
${JSON.stringify(lead, null, 2)}
`;

  const response = await openai.chat.completions.create({
    model,
    messages: [{ role: "user", content: prompt }],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "lead_enrichment",
        schema: {
          type: "object",
          required: [
            "lead_type",
            "lead_score",
            "summary_bullets",
            "missing_info_questions",
            "recommended_next_step",
            "followup_email",
            "followup_text",
            "compliance_notes",
          ],
          properties: {
            lead_type: {
              type: "string",
              enum: ["seller", "landlord", "tenant", "buyer", "other"],
            },
            lead_score: { type: "number" },
            summary_bullets: {
              type: "array",
              items: { type: "string" },
            },
            missing_info_questions: {
              type: "array",
              items: { type: "string" },
            },
            recommended_next_step: { type: "string" },
            followup_email: {
              type: "object",
              required: ["subject", "body"],
              properties: {
                subject: { type: "string" },
                body: { type: "string" },
              },
            },
            followup_text: { type: "string" },
            compliance_notes: {
              type: "array",
              items: { type: "string" },
            },
          },
          additionalProperties: false,
        },
        strict: true,
      },
    },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    console.error("No content in OpenAI response");
    return lead;
  }

    let enriched: EnrichedLead;
    try {
      enriched = JSON.parse(content) as EnrichedLead;
    } catch (err) {
      console.error("Failed to parse AI JSON", err, "Content:", content);
      return lead;
    }

    const updated = await prisma.lead.update({
      where: { id: lead.id },
      data: {
        aiLeadType: enriched.lead_type,
        aiLeadScore: Math.round(enriched.lead_score),
        aiSummary: enriched.summary_bullets.join("\n"),
        aiMissingInfo: JSON.stringify(enriched.missing_info_questions),
        aiNextStep: enriched.recommended_next_step,
        aiFollowUpEmailSubject: enriched.followup_email.subject,
        aiFollowUpEmailBody: enriched.followup_email.body,
        aiFollowUpText: enriched.followup_text,
        aiModel: model,
        aiRunAt: new Date(),
        rawAiJson: JSON.stringify(enriched),
      },
    });

    return updated;
  } catch (err) {
    console.error("Error enriching lead with AI:", err);
    // Return the lead without AI enrichment if AI fails
    // This way the lead is still saved even if AI fails
    return lead;
  }
}


