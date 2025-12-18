import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { createAdminSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (typeof password !== "string") {
    return NextResponse.json({ error: "Password is required." }, { status: 400 });
  }

  const result = await createAdminSession(password);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}


