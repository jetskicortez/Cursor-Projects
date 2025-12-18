import { z } from "zod";

export const leadIntakeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional().or(z.literal("")),
  company: z.string().optional().or(z.literal("")),

  persona: z.enum([
    "owner",
    "landlord",
    "business_owner",
    "broker",
    "other",
  ]),
  requestType: z.enum([
    "sell",
    "lease_out",
    "lease_space",
    "buy",
    "unsure",
  ]),

  locationText: z.string().optional().or(z.literal("")),
  propertyType: z.string().optional().or(z.literal("")),
  sizeSfText: z.string().optional().or(z.literal("")),
  budgetText: z.string().optional().or(z.literal("")),
  timelineText: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),

  // Honeypot - should stay empty
  website: z.string().optional().or(z.literal("")),
});

export type LeadIntakeInput = z.infer<typeof leadIntakeSchema>;

export const adminLeadQuerySchema = z.object({
  q: z.string().optional(),
  persona: z
    .union([
      z.literal("owner"),
      z.literal("landlord"),
      z.literal("business_owner"),
      z.literal("broker"),
      z.literal("other"),
      z.literal(""),
    ])
    .optional(),
  requestType: z
    .union([
      z.literal("sell"),
      z.literal("lease_out"),
      z.literal("lease_space"),
      z.literal("buy"),
      z.literal("unsure"),
      z.literal(""),
    ])
    .optional(),
});


