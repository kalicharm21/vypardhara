export interface UbidProfile { ubid: string; legal_name: string; trade_name: string; status: "active" | "dormant" | "closed"; }
export interface SignalBreakdown { name: number; address: number; pan: number; gstin: number; intra_dept: boolean; }
export interface MatchDecision { score: number; decision: "auto-merge" | "review" | "reject"; signals: SignalBreakdown; rule_fired: string | null; }
