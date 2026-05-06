// Typed API client for the VyaparDhara backend services.
// In production these URLs come from environment variables.

const BASE = {
  ingestion: process.env.NEXT_PUBLIC_INGESTION_URL ?? "http://localhost:8001",
  matching: process.env.NEXT_PUBLIC_MATCHING_URL ?? "http://localhost:8002",
  vyaparcard: process.env.NEXT_PUBLIC_VYAPARCARD_URL ?? "http://localhost:8003",
  livelink: process.env.NEXT_PUBLIC_LIVELINK_URL ?? "http://localhost:8004",
  activity: process.env.NEXT_PUBLIC_ACTIVITY_URL ?? "http://localhost:8005",
};

async function j<T>(url: string, init?: RequestInit): Promise<T> {
  const r = await fetch(url, { ...init, headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) } });
  if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
  return r.json() as Promise<T>;
}

export const api = {
  match: (a: unknown, b: unknown) => j(`${BASE.matching}/match`, { method: "POST", body: JSON.stringify({ a, b }) }),
  classify: (events: unknown[]) => j(`${BASE.activity}/classify`, { method: "POST", body: JSON.stringify({ events }) }),
  issueCard: (ubid: string) => j(`${BASE.vyaparcard}/card/issue`, { method: "POST", body: JSON.stringify({ ubid }) }),
  startSession: (body: unknown) => j(`${BASE.livelink}/session/start`, { method: "POST", body: JSON.stringify(body) }),
  endSession: (session_id: string) => j(`${BASE.livelink}/session/end`, { method: "POST", body: JSON.stringify({ session_id }) }),
};
