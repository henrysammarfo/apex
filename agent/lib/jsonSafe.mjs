/** Deep-clone for JSON / Supabase (bigint-safe). */
export function jsonSafe(obj) {
  return JSON.parse(JSON.stringify(obj, (_, v) => (typeof v === "bigint" ? v.toString() : v)));
}
