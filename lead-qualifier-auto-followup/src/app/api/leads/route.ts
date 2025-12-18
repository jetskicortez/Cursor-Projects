import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { leadIntakeSchema } from "@/lib/validation";
import { createLeadFromIntake } from "@/lib/lead-service";

// Very simple in-memory rate limiter keyed by IP.
const rateLimitWindowMs = 60_000; // 1 minute
const maxRequestsPerWindow = 5;
const ipHits = new Map<string, { count: number; windowStart: number }>();

function getClientIp(req: NextRequest) {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return req.ip ?? "unknown";
}

function checkRateLimit(ip: string) {
  const now = Date.now();
  const entry = ipHits.get(ip);
  if (!entry || now - entry.windowStart > rateLimitWindowMs) {
    ipHits.set(ip, { count: 1, windowStart: now });
    return true;
  }
  if (entry.count >= maxRequestsPerWindow) return false;
  entry.count += 1;
  return true;
}

const bodySchema = leadIntakeSchema;

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many submissions from this IP. Please try again later." },
        { status: 429 },
      );
    }

    const json = await req.json();
    const parsed = bodySchema.parse(json);

    // Honeypot check
    if (parsed.website && parsed.website.trim().length > 0) {
      return NextResponse.json({ ok: true }); // silently accept but ignore
    }

    const lead = await createLeadFromIntake(parsed, ip);

    return NextResponse.json({ ok: true, id: lead.id });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: err.flatten() },
        { status: 400 },
      );
    }
    console.error("Error creating lead", err);
    return NextResponse.json(
      {
        error:
          "Something went wrong while saving your details. Please try again or contact us directly.",
      },
      { status: 500 },
    );
  }
}


