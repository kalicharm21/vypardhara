import type { SignalBreakdown } from "../lib/types";
export function SignalBreakdownView({ s }: { s: SignalBreakdown }) {
  const rows: [string, number | boolean][] = [["Name", s.name], ["Address", s.address], ["PAN", s.pan], ["GSTIN", s.gstin], ["Intra-dept", s.intra_dept]];
  return <table>{rows.map(([k, v]) => <tr key={k}><td>{k}</td><td>{String(v)}</td></tr>)}</table>;
}
