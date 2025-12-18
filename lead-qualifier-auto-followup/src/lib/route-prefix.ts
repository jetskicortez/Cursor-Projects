export const ROUTE_PREFIX =
  (process.env.ROUTE_PREFIX && process.env.ROUTE_PREFIX !== "/"
    ? process.env.ROUTE_PREFIX.replace(/\/+$/, "")
    : "") || "";

export function withPrefix(path: string): string {
  const base = ROUTE_PREFIX || "";
  if (!base) return path || "/";
  if (!path) return base || "/";
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`.replace(/\/+$/, "") || "/";
}


