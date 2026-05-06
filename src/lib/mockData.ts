// Deterministic mock dataset for VyaparDhara hackathon demo
// 500 businesses with cross-department records, inspections, LiveLink sessions, review queue

export type BusinessStatus = "active" | "dormant" | "shell-suspect" | "closed" | "unverified";
export type ComplianceTier = "A" | "B" | "C" | "D";
export type Department =
  | "Labour"
  | "Factories"
  | "KSPCB"
  | "GST"
  | "MCA"
  | "FSSAI"
  | "BBMP"
  | "Excise";
export type LiveLinkStatus = "verified" | "inconclusive" | "failed" | "scheduled" | "live";

export interface DeptRecord {
  dept: Department;
  recordId: string;
  nameOnRecord: string;
  addressOnRecord: string;
  lastEvent: string;
  lastEventDate: string;
}

export interface Inspection {
  id: string;
  date: string;
  officer: string;
  outcome: "pass" | "minor-issue" | "major-issue" | "missed";
  notes: string;
  type: "physical" | "livelink";
}

export interface LiveLinkSession {
  id: string;
  ubid: string;
  startedAt: string;
  durationMin: number;
  status: LiveLinkStatus;
  officer: string;
  gpsMatch: boolean;
  representative: string;
  screenshots: number;
}

export interface Business {
  ubid: string;
  legalName: string;
  tradeName: string;
  pan: string;
  gstin: string;
  category: string;
  sector: string;
  pincode: string;
  district: string;
  address: string;
  lat: number;
  lng: number;
  registeredOn: string;
  status: BusinessStatus;
  activityScore: number; // 0..100
  complianceTier: ComplianceTier;
  employees: number;
  annualRevenueCr: number;
  vyaparCardIssued: boolean;
  cardIssuedOn?: string;
  lastInspection?: string;
  monthsSinceInspection: number;
  liveLinkEnabled: boolean;
  records: DeptRecord[];
  inspections: Inspection[];
  riskFlags: string[];
}

export interface ReviewPair {
  id: string;
  recordA: { dept: Department; name: string; address: string; pan?: string };
  recordB: { dept: Department; name: string; address: string; pan?: string };
  scores: { name: number; address: number; pan: number; intra: number; composite: number };
  status: "pending" | "merged" | "rejected" | "split";
  suggestedAction: "auto-merge" | "review" | "reject";
}

export interface Alert {
  id: string;
  ubid: string;
  legalName: string;
  type: "no-inspection" | "shell-suspect" | "livelink-failed" | "card-tampered" | "renewal-due";
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  raisedAt: string;
}

// ---- Deterministic PRNG ----
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20260504);
const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)];
const range = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min;

const NAME_PREFIXES = [
  "Surya", "Karnataka", "Bharat", "Sri", "Anand", "Ganesh", "Lakshmi", "Vyapar",
  "Kaveri", "Mysore", "Hampi", "Vidya", "Shakti", "Meghana", "Nandi", "Vrinda",
  "Aditya", "Tejas", "Pragati", "Suvarna", "Chamundi", "Vijaya", "Annapurna", "Trishul",
];
const NAME_SUFFIXES = [
  "Industries", "Technologies", "Textiles", "Foods", "Engineering", "Plastics",
  "Pharma", "Steel Works", "Agro", "Logistics", "Apparels", "Chemicals",
  "Electricals", "Constructions", "Exports", "Trading Co", "Auto Parts", "Packaging",
];
const SECTORS = [
  "Manufacturing", "Textiles", "Food Processing", "Pharma", "Chemicals",
  "Engineering", "IT Services", "Logistics", "Retail", "Agriculture",
];
const DISTRICTS = [
  { name: "Bengaluru Urban", pins: ["560001", "560058", "560068", "560100", "560048"], lat: 12.97, lng: 77.59 },
  { name: "Mysuru", pins: ["570001", "570016", "570023"], lat: 12.29, lng: 76.64 },
  { name: "Mangaluru", pins: ["575001", "575003", "575015"], lat: 12.91, lng: 74.85 },
  { name: "Hubballi", pins: ["580020", "580029"], lat: 15.36, lng: 75.12 },
  { name: "Belagavi", pins: ["590001", "590010"], lat: 15.85, lng: 74.5 },
  { name: "Tumakuru", pins: ["572101", "572106"], lat: 13.34, lng: 77.1 },
  { name: "Kalaburagi", pins: ["585101", "585104"], lat: 17.33, lng: 76.83 },
];
const STATUSES: BusinessStatus[] = ["active", "dormant", "shell-suspect", "closed", "unverified"];
const TIERS: ComplianceTier[] = ["A", "B", "C", "D"];
const DEPARTMENTS: Department[] = ["Labour", "Factories", "KSPCB", "GST", "MCA", "FSSAI", "BBMP", "Excise"];
const OFFICERS = [
  "Insp. R. Iyer", "Insp. S. Patil", "Insp. M. Hegde", "Insp. K. Rao",
  "Insp. P. Shetty", "Insp. N. Murthy", "Insp. V. Gowda", "Insp. A. Naik",
];
const RISK_FLAG_POOL = [
  "No GSTIN filing in 12 months",
  "Address mismatch across departments",
  "PAN-GSTIN mismatch",
  "Same address as 3 other businesses",
  "Renewal overdue",
  "No employee EPF contributions",
  "Power consumption near zero",
];

function pad(n: number, w = 4) { return n.toString().padStart(w, "0"); }
function pan() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let s = "";
  for (let i = 0; i < 5; i++) s += letters[Math.floor(rand() * 26)];
  s += pad(range(1000, 9999));
  s += letters[Math.floor(rand() * 26)];
  return s;
}
function dateAgo(days: number) {
  const d = new Date(2026, 4, 4);
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}
function nameVariant(base: string, mode: number) {
  switch (mode) {
    case 0: return base.toUpperCase();
    case 1: return base.replace(/ /g, ". ");
    case 2: return base + " Pvt Ltd";
    case 3: return base + " (P) Ltd";
    case 4: return base.replace(/a/gi, "@").slice(0, base.length);
    default: return base;
  }
}

export const BUSINESSES: Business[] = Array.from({ length: 500 }).map((_, i) => {
  const district = pick(DISTRICTS);
  const pincode = pick(district.pins);
  const tradeName = `${pick(NAME_PREFIXES)} ${pick(NAME_SUFFIXES)}`;
  const legalName = `${tradeName} ${rand() > 0.5 ? "Pvt Ltd" : "LLP"}`;
  const ubid = `UBID-KA-${pad(i + 1, 6)}`;
  const status: BusinessStatus =
    rand() < 0.62 ? "active" :
    rand() < 0.78 ? "dormant" :
    rand() < 0.88 ? "shell-suspect" :
    rand() < 0.96 ? "closed" : "unverified";
  const activityScore =
    status === "active" ? range(70, 99) :
    status === "dormant" ? range(30, 65) :
    status === "shell-suspect" ? range(5, 35) :
    status === "closed" ? range(0, 10) : range(20, 60);
  const tier: ComplianceTier =
    activityScore > 80 ? "A" : activityScore > 60 ? "B" : activityScore > 35 ? "C" : "D";
  const monthsSinceInspection = range(0, 36);
  const lastInspection = dateAgo(monthsSinceInspection * 30);
  const cardIssued = rand() < 0.78 && status !== "closed";
  const liveLinkEnabled = cardIssued && rand() < 0.55;

  const numRecords = range(2, 5);
  const records: DeptRecord[] = Array.from({ length: numRecords }).map((__, j) => ({
    dept: DEPARTMENTS[(i + j) % DEPARTMENTS.length],
    recordId: `${DEPARTMENTS[(i + j) % DEPARTMENTS.length]}-${pad(range(10000, 99999), 5)}`,
    nameOnRecord: nameVariant(tradeName, j),
    addressOnRecord: `Plot ${range(1, 250)}, ${district.name}, KA - ${pincode}`,
    lastEvent: pick(["Renewal Filed", "Return Submitted", "Inspection", "Notice Sent", "Address Update"]),
    lastEventDate: dateAgo(range(5, 600)),
  }));

  const inspCount = range(0, 4);
  const inspections: Inspection[] = Array.from({ length: inspCount }).map((__, k) => ({
    id: `INS-${pad(i, 4)}-${k}`,
    date: dateAgo(range(30, 900)),
    officer: pick(OFFICERS),
    outcome: pick(["pass", "minor-issue", "major-issue", "missed"] as const),
    notes: pick([
      "Premises operating; records in order.",
      "Minor labelling issues; advisory issued.",
      "Effluent treatment partially functional.",
      "Owner not available; will reschedule.",
      "Verified on LiveLink; no physical visit.",
    ]),
    type: rand() < 0.3 ? "livelink" : "physical",
  }));

  const flags: string[] = [];
  if (status === "shell-suspect") flags.push(RISK_FLAG_POOL[0], RISK_FLAG_POOL[3]);
  if (monthsSinceInspection > 18 && status === "active") flags.push("No inspection in 18+ months");
  if (rand() < 0.15) flags.push(pick(RISK_FLAG_POOL));

  return {
    ubid,
    legalName,
    tradeName,
    pan: pan(),
    gstin: `29${pan()}1Z${range(0, 9)}`,
    category: rand() < 0.35 ? "Factory" : rand() < 0.6 ? "Shop" : rand() < 0.8 ? "Office" : "Warehouse",
    sector: pick(SECTORS),
    pincode,
    district: district.name,
    address: `Plot ${range(1, 250)}, ${pick(["Industrial Area", "Main Road", "Phase-2", "Sector 4"])}, ${district.name}`,
    lat: district.lat + (rand() - 0.5) * 0.4,
    lng: district.lng + (rand() - 0.5) * 0.4,
    registeredOn: dateAgo(range(200, 4000)),
    status,
    activityScore,
    complianceTier: tier,
    employees: status === "closed" ? 0 : range(3, 450),
    annualRevenueCr: +(rand() * (status === "active" ? 80 : 15)).toFixed(2),
    vyaparCardIssued: cardIssued,
    cardIssuedOn: cardIssued ? dateAgo(range(30, 700)) : undefined,
    lastInspection: inspections.length ? inspections[0].date : lastInspection,
    monthsSinceInspection,
    liveLinkEnabled,
    records,
    inspections,
    riskFlags: flags,
  };
});

// ---- Review queue (entity resolution candidate pairs) ----
export const REVIEW_PAIRS: ReviewPair[] = Array.from({ length: 60 }).map((_, i) => {
  const b = BUSINESSES[i * 3];
  const name = b.tradeName;
  const variant = nameVariant(name, (i % 5));
  const nameScore = +(0.55 + rand() * 0.4).toFixed(2);
  const addrScore = +(0.4 + rand() * 0.55).toFixed(2);
  const panScore = rand() < 0.5 ? 1 : 0;
  const intra = +(rand() * 0.8).toFixed(2);
  const composite = +(
    nameScore * 0.2 + addrScore * 0.2 + panScore * 0.5 + intra * 0.1
  ).toFixed(2);
  const action: ReviewPair["suggestedAction"] =
    composite > 0.85 ? "auto-merge" : composite > 0.55 ? "review" : "reject";
  return {
    id: `PAIR-${pad(i, 4)}`,
    recordA: {
      dept: DEPARTMENTS[i % DEPARTMENTS.length],
      name,
      address: b.address,
      pan: b.pan,
    },
    recordB: {
      dept: DEPARTMENTS[(i + 2) % DEPARTMENTS.length],
      name: variant,
      address: b.address.replace("Plot", "Plt."),
      pan: panScore ? b.pan : pan(),
    },
    scores: { name: nameScore, address: addrScore, pan: panScore, intra, composite },
    status: "pending",
    suggestedAction: action,
  };
});

// ---- Live LiveLink sessions ----
export const LIVE_SESSIONS: LiveLinkSession[] = Array.from({ length: 24 }).map((_, i) => {
  const b = BUSINESSES[(i * 7) % BUSINESSES.length];
  return {
    id: `LL-${pad(i, 4)}`,
    ubid: b.ubid,
    startedAt: dateAgo(range(0, 6)),
    durationMin: range(8, 45),
    status: i < 3 ? "live" : (pick(["verified", "inconclusive", "failed", "scheduled"] as const)),
    officer: pick(OFFICERS),
    gpsMatch: rand() < 0.85,
    representative: `Mr/Ms. ${pick(NAME_PREFIXES)}`,
    screenshots: range(4, 18),
  };
});

// ---- Alerts ----
export const ALERTS: Alert[] = BUSINESSES.flatMap((b, i) => {
  const out: Alert[] = [];
  if (b.monthsSinceInspection > 18 && b.status === "active") {
    out.push({
      id: `ALR-${i}-A`, ubid: b.ubid, legalName: b.legalName,
      type: "no-inspection", severity: "high",
      message: `Active business not inspected in ${b.monthsSinceInspection} months`,
      raisedAt: dateAgo(range(1, 30)),
    });
  }
  if (b.status === "shell-suspect") {
    out.push({
      id: `ALR-${i}-B`, ubid: b.ubid, legalName: b.legalName,
      type: "shell-suspect", severity: "critical",
      message: "Activity score below threshold; multiple risk flags",
      raisedAt: dateAgo(range(1, 14)),
    });
  }
  if (b.vyaparCardIssued && rand() < 0.04) {
    out.push({
      id: `ALR-${i}-C`, ubid: b.ubid, legalName: b.legalName,
      type: "card-tampered", severity: "high",
      message: "Tamper-evident seal triggered on last scan",
      raisedAt: dateAgo(range(1, 10)),
    });
  }
  return out;
}).slice(0, 80);

// ---- Aggregates for charts ----
export const stats = () => {
  const total = BUSINESSES.length;
  const active = BUSINESSES.filter(b => b.status === "active").length;
  const dormant = BUSINESSES.filter(b => b.status === "dormant").length;
  const shell = BUSINESSES.filter(b => b.status === "shell-suspect").length;
  const closed = BUSINESSES.filter(b => b.status === "closed").length;
  const cards = BUSINESSES.filter(b => b.vyaparCardIssued).length;
  const overdue = BUSINESSES.filter(b => b.monthsSinceInspection > 18 && b.status === "active").length;
  return { total, active, dormant, shell, closed, cards, overdue };
};

export const sectorBreakdown = () => {
  const map = new Map<string, number>();
  BUSINESSES.forEach(b => map.set(b.sector, (map.get(b.sector) || 0) + 1));
  return Array.from(map, ([name, value]) => ({ name, value }));
};

export const districtBreakdown = () => {
  const map = new Map<string, { active: number; dormant: number; shell: number }>();
  BUSINESSES.forEach(b => {
    const cur = map.get(b.district) || { active: 0, dormant: 0, shell: 0 };
    if (b.status === "active") cur.active++;
    else if (b.status === "dormant") cur.dormant++;
    else if (b.status === "shell-suspect") cur.shell++;
    map.set(b.district, cur);
  });
  return Array.from(map, ([district, v]) => ({ district, ...v }));
};

export const inspectionTrend = () => {
  // last 12 months
  const months = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"];
  return months.map((m, i) => ({
    month: m,
    physical: 40 + Math.round(Math.sin(i / 2) * 15) + i * 3,
    livelink: 5 + i * 4 + Math.round(Math.cos(i / 2) * 6),
  }));
};

export const tierBreakdown = () => {
  const map: Record<ComplianceTier, number> = { A: 0, B: 0, C: 0, D: 0 };
  BUSINESSES.forEach(b => map[b.complianceTier]++);
  return (Object.keys(map) as ComplianceTier[]).map(t => ({ tier: t, count: map[t] }));
};

// "Demo" business that the business portal acts as
export const DEMO_BUSINESS = BUSINESSES[0];
