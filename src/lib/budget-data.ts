// ─── BUDGET (per venture, planned vs actual) ─────────────────────────────────

export interface BudgetLine {
  category: string;
  subcategory?: string;
  planned: number;      // monthly USD
  actual: number;       // actual spent MTD (May 2026)
  ytdActual: number;    // year-to-date actual
  note: string;
}

export interface VentureBudget {
  venture:  string;
  color:    string;
  sector:   string;
  currency: string;
  period:   string;
  lines:    BudgetLine[];
}

export const VENTURE_BUDGETS: VentureBudget[] = [
  {
    venture: 'Llife', color: '#a5a5a5', sector: 'AI Life Assistant',
    currency: 'USD', period: 'May 2026',
    lines: [
      { category: 'Technology',    subcategory: 'Design tools (Figma)',   planned: 100,  actual: 0,    ytdActual: 0,    note: 'UI design and hardware CAD tooling' },
      { category: 'Technology',    subcategory: 'AI inference',           planned: 200,  actual: 0,    ytdActual: 0,    note: 'Cloud AI inference — starts at pilot launch' },
      { category: 'Infrastructure',subcategory: 'Server (shared)',        planned: 40,   actual: 40,   ytdActual: 200,  note: 'Shared VPS allocation' },
      { category: 'Domain',        subcategory: 'llife.app',            planned: 2,    actual: 2,    ytdActual: 10,   note: 'Annual domain — monthly allocation' },
    ],
  },
];

// ─── EXPENSES ─────────────────────────────────────────────────────────────────

export type ExpenseStatus = 'paid' | 'pending' | 'reimbursed' | 'recurring';

export interface Expense {
  id:          string;
  date:        string;
  description: string;
  venture:     string;
  category:    string;
  amount:      number;
  currency:    string;
  status:      ExpenseStatus;
  receipt:     boolean;
  notes:       string;
}


// Real spend, retagged to the HoldCo rather than archived: the exchange API
// fees below are still billed monthly because the trading bots are still
// running. Archiving them would under-report actual outgoings. The planned
// (TBD) payroll rows below are a different case — those are headcount plans
// for ventures that no longer exist separately, so they stay archived.
export const EXPENSES: Expense[] = [
  { id: 'EXP-001', date: '2026-05-01', description: 'VPS server — May 2026',          venture: 'LLIFE', category: 'Infrastructure', amount: 120,  currency: 'USD', status: 'paid',      receipt: true,  notes: '64.227.160.224 — 2C/8G/160G CentOS 9. Auto-renewed.' },
  { id: 'EXP-002', date: '2026-05-01', description: 'Domain renewals — May allocation', venture: 'LLIFE', category: 'Domain',        amount: 13,   currency: 'USD', status: 'paid',      receipt: true,  notes: 'Monthly allocation across llife.app + all venture domains.' },
  { id: 'EXP-003', date: '2026-05-01', description: 'Binance API — May 2026',          venture: 'LLIFE',  category: 'Infrastructure', amount: 200,  currency: 'USD', status: 'paid',      receipt: true,  notes: 'VIP tier API access for strategy execution.' },
  { id: 'EXP-004', date: '2026-05-01', description: 'Bybit API — May 2026',            venture: 'LLIFE',  category: 'Infrastructure', amount: 80,   currency: 'USD', status: 'paid',      receipt: true,  notes: 'Secondary exchange API — partial month usage.' },
  { id: 'EXP-005', date: '2026-05-20', description: 'Resend email service',            venture: 'LLIFE', category: 'SaaS',           amount: 0,    currency: 'USD', status: 'paid',      receipt: true,  notes: 'Free tier currently — contact form + NDA emails.' },
  { id: 'EXP-006', date: '2026-06-01', description: 'VPS server — June 2026',          venture: 'LLIFE', category: 'Infrastructure', amount: 120,  currency: 'USD', status: 'recurring', receipt: false, notes: 'Recurring monthly. Due 2026-06-01.' },
  { id: 'EXP-007', date: '2026-06-01', description: 'Binance API — June 2026',         venture: 'LLIFE',  category: 'Infrastructure', amount: 200,  currency: 'USD', status: 'recurring', receipt: false, notes: 'Recurring monthly.' },
  // ── PRE-SPEND GATES (Roborns) ──────────────────────────────────────────────
  // These three run BEFORE the site survey (EXP-008) and thermal feasibility
  // (EXP-009). Each can independently kill or redirect the project, and each
  // costs a fraction of what it protects. Ordered by what they rule out.
  { id: 'EXP-010', date: '2026-09-05', description: 'GATE 1 — Power load feasibility opinion (KPT)', venture: 'LLIFE', category: 'Engineering', amount: 250, currency: 'USD', status: 'pending', receipt: false, notes: '~₹15–25K. Written 2MW HT load feasibility opinion for the Mangaluru/Panambur site via KPT (transmission) plus a local electrical consultant. THE GATING FACT — no power killed Uchila Thalapady, and the Kapu page dates full grid approval to Q3 2029 against a Q1 2027 construction start. Until this returns, the raise size, instrument, and timeline are all unsizeable. Port (NMPT) and MRPL adjacency at Panambur means HT infrastructure should already exist. Cheapest decision-grade information available.' },
  { id: 'EXP-011', date: '2026-09-05', description: 'GATE 2 — CRZ classification opinion (scoping only)', venture: 'LLIFE', category: 'Legal', amount: 500, currency: 'USD', status: 'pending', receipt: false, notes: '~₹25–50K. Scoping opinion ONLY — not the full EIA. Establish the CRZ zone for the Panambur survey number (pin 12.9416386, 74.8044337). Sits on the coast just north of New Mangalore Port near Panambur Beach; beachfront adjacent to a public beach is the hardest CRZ case and CRZ-III generally bars construction within 200m of the High Tide Line. Port-area classification may differ. IF RESTRICTED, THE PLOT IS UNBUILDABLE FOR THIS USE AT ANY PRICE — which makes this gate senior to the price question entirely.' },
  { id: 'EXP-012', date: '2026-09-05', description: 'GATE 3 — Kaveri guidance value lookup + KIADB rate enquiry', venture: 'LLIFE', category: 'Legal', amount: 0, currency: 'USD', status: 'pending', receipt: false, notes: 'FREE. Two lookups that price the land honestly. (1) Karnataka Kaveri Online Services (Dept of Stamps & Registration) — pull the government guidance value for the Panambur survey number and compare against the ₹7 lakh/cent ask (₹7 Cr/acre, ~₹1,607/sq ft). Far above guidance = speculative premium. (2) KIADB Mangaluru office — get the Baikampady industrial allotment rate, which is the correct comparable for industrial use and is not published publicly. Private coastal-commercial pricing is the wrong benchmark: at ₹28 Cr for 4 acres against a 2MW Phase 1 that is ₹14 Cr/MW of land alone, versus Datasamudra at ₹8.5–14 Cr/MW ALL-IN.' },
  { id: 'EXP-008', date: '2026-06-01', description: 'Roborns site survey',             venture: 'LLIFE',  category: 'Engineering',    amount: 3000, currency: 'USD', status: 'pending',   receipt: false, notes: 'Mangaluru coastal site survey — planned June 2026. Pending vendor.' },
  { id: 'EXP-009', date: '2026-06-15', description: 'Thermal engineering — feasibility', venture: 'LLIFE', category: 'Engineering',  amount: 5000, currency: 'USD', status: 'pending',   receipt: false, notes: 'Phase 1 feasibility study. Pending partner engagement.' },
  { id: 'EXP-010', date: '2026-06-30', description: 'Dubai HoldCo legal — initial retainer', venture: 'LLIFE', category: 'Legal',  amount: 6500, currency: 'USD', status: 'pending',   receipt: false, notes: 'DIFC incorporation one-time ($5K) + first month retainer ($1.5K).' },
];

// ─── PAYROLL ──────────────────────────────────────────────────────────────────

export type PayrollType   = 'founder' | 'employee' | 'contractor' | 'advisor';
export type PayrollStatus = 'active' | 'planned' | 'open';

export interface PayrollEntry {
  id:          string;
  name:        string;
  role:        string;
  type:        PayrollType;
  ventures:    string[];
  status:      PayrollStatus;
  monthlyCost: number;    // USD/month
  oneTimeCost: number;    // USD one-time (signing bonus, setup, etc.)
  currency:    string;
  startDate:   string;
  equityNote:  string;
  notes:       string;
}

export const PAYROLL: PayrollEntry[] = [
  {
    id: 'PAY-001', name: 'Shawaz', role: 'Founder & CEO', type: 'founder',
    ventures: ['LLIFE', 'Llife'],
    status: 'active', monthlyCost: 0, oneTimeCost: 0, currency: 'USD',
    startDate: '2025-01-01', equityNote: '100% HoldCo — fully vested',
    notes: 'Founder is not drawing a salary at this stage. Compensation via equity and future distributions.',
  },
  {
    id: 'PAY-007', name: 'Hardware Product Manager (TBD)', role: 'Hub Device & Supply Chain', type: 'employee',
    ventures: ['Llife'],
    status: 'open', monthlyCost: 6000, oneTimeCost: 0, currency: 'USD',
    startDate: 'Q4 2026', equityNote: 'ESOP — 0.75–1.25%',
    notes: 'Owns the HubCV, Nanotrade, Franchiseen and Account Aggregator connectors that populate the five domains.',
  },
  {
    id: 'PAY-008', name: 'Dubai HoldCo Legal Counsel (TBD)', role: 'DIFC Incorporation & Token Structure', type: 'contractor',
    ventures: ['LLIFE'],
    status: 'open', monthlyCost: 1500, oneTimeCost: 5000, currency: 'USD',
    startDate: 'Q3 2026', equityNote: 'None',
    notes: 'DIFC-registered law firm. One-time incorporation ($5K) + monthly retainer for ongoing compliance.',
  },
  {
    id: 'PAY-010', name: 'Smart Contract Auditor (TBD)', role: 'Token Security Audit', type: 'contractor',
    ventures: ['LLIFE'],
    status: 'planned', monthlyCost: 0, oneTimeCost: 35000, currency: 'USD',
    startDate: 'Q4 2026', equityNote: 'None',
    notes: 'One-time audit of Roborns token smart contract. Required before any token issuance. Budget $20–50K.',
  },
];
