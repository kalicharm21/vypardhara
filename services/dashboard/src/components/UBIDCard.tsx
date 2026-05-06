import type { UbidProfile } from "@/lib/types";
export function UBIDCard({ p }: { p: UbidProfile }) {
  return <div><div>{p.ubid}</div><div>{p.legal_name}</div><div>{p.status}</div></div>;
}
