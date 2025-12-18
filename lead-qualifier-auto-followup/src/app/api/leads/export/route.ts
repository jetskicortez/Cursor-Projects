import "server-only";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { leadsToCsv } from "@/lib/csv";
import { isAdmin } from "@/lib/auth";

export async function GET() {
  const ok = await isAdmin();
  if (!ok) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
  });

  const csv = leadsToCsv(leads);

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="leads.csv"',
    },
  });
}


