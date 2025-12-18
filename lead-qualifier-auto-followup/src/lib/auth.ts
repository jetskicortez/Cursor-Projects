import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SESSION_COOKIE = "admin_session";

function isPasswordValid(password: string | undefined | null) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return password === expected;
}

export async function createAdminSession(password: string) {
  if (!isPasswordValid(password)) {
    return { ok: false, error: "Invalid password." };
  }

  const cookieStore = await cookies();
  // For MVP, a simple static value is enough; no user accounts or roles.
  cookieStore.set(SESSION_COOKIE, "ok", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    // Do not hard-code domain; let the browser infer from host (works on subdomain).
    path: "/",
  });

  return { ok: true };
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function requireAdmin() {
  const cookieStore = await cookies();
  const value = cookieStore.get(SESSION_COOKIE)?.value;
  if (value !== "ok") {
    redirect("/auth/login");
  }
}

export async function isAdmin() {
  const cookieStore = await cookies();
  const value = cookieStore.get(SESSION_COOKIE)?.value;
  return value === "ok";
}


