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
    venture: 'Roborns', color: '#5DCAA5', sector: 'Coastal AI Infrastructure',
    currency: 'USD', period: 'May 2026',
    lines: [
      { category: 'Engineering',   subcategory: 'Thermal feasibility',   planned: 5000, actual: 0,    ytdActual: 0,    note: 'Thermal engineering partner — pending engagement' },
      { category: 'Engineering',   subcategory: 'Site survey',           planned: 3000, actual: 0,    ytdActual: 0,    note: 'Mangaluru coastal site survey — planned June 2026' },
      { category: 'Legal',         subcategory: 'HoldCo counsel',        planned: 1500, actual: 0,    ytdActual: 0,    note: 'Dubai HoldCo incorporation — monthly retainer pending' },
      { category: 'Legal',         subcategory: 'Environmental counsel', planned: 1000, actual: 0,    ytdActual: 0,    note: 'CRZ clearance and coastal permits pathway' },
      { category: 'Infrastructure',subcategory: 'Server (shared)',        planned: 40,   actual: 40,   ytdActual: 200,  note: 'Shared VPS allocation for roborns.com' },
      { category: 'Domain',        subcategory: 'roborns.com',           planned: 2,    actual: 2,    ytdActual: 10,   note: 'Annual domain — monthly allocation' },
    ],
  },
  {
    venture: 'Franchiseen', color: '#7F77DD', sector: 'AI Business Assistant',
    currency: 'USD', period: 'May 2026',
    lines: [
      { category: 'Legal',         subcategory: 'Platform compliance',   planned: 2500, actual: 0,    ytdActual: 0,    note: 'SEBI pathway + investor agreements — pending engagement' },
      { category: 'Technology',    subcategory: 'KYC/AML provider',      planned: 400,  actual: 0,    ytdActual: 0,    note: 'Onfido/Signzy — pending provider selection' },
      { category: 'Technology',    subcategory: 'Convex backend',         planned: 100,  actual: 0,    ytdActual: 0,    note: 'Convex serverless DB — free tier currently' },
      { category: 'Technology',    subcategory: 'Stripe / Razorpay',      planned: 150,  actual: 0,    ytdActual: 0,    note: 'Payment processing — pre-launch estimate' },
      { category: 'Infrastructure',subcategory: 'Server (shared)',        planned: 40,   actual: 40,   ytdActual: 200,  note: 'Shared VPS allocation' },
      { category: 'Domain',        subcategory: 'franchiseen.com',        planned: 2,    actual: 2,    ytdActual: 10,   note: 'Annual domain — monthly allocation' },
    ],
  },
  {
    venture: 'HubCV', color: '#FAC775', sector: 'AI Career Assistant',
    currency: 'USD', period: 'May 2026',
    lines: [
      { category: 'AI Infrastructure', subcategory: 'Anthropic API',     planned: 400,  actual: 0,    ytdActual: 0,    note: 'Claude API for matching engine — starts at platform launch' },
      { category: 'Technology',    subcategory: 'PostgreSQL hosting',     planned: 100,  actual: 0,    ytdActual: 0,    note: 'Neon/Supabase — free tier currently' },
      { category: 'Technology',    subcategory: 'Vector database',        planned: 150,  actual: 0,    ytdActual: 0,    note: 'Pinecone/Weaviate for skill embeddings — pre-launch' },
      { category: 'Infrastructure',subcategory: 'Server (shared)',        planned: 40,   actual: 40,   ytdActual: 200,  note: 'Shared VPS allocation' },
      { category: 'Domain',        subcategory: 'hubcv.com',              planned: 2,    actual: 2,    ytdActual: 10,   note: 'Annual domain — monthly allocation' },
    ],
  },
  {
    venture: 'Dextrip', color: '#F0997B', sector: 'AI Trading Assistant',
    currency: 'USD', period: 'May 2026',
    lines: [
      { category: 'Infrastructure',subcategory: 'Binance API (VIP)',      planned: 200,  actual: 200,  ytdActual: 1000, note: 'Exchange API — VIP tier for rate limits' },
      { category: 'Infrastructure',subcategory: 'Bybit API',              planned: 100,  actual: 80,   ytdActual: 400,  note: 'Secondary exchange connector' },
      { category: 'Infrastructure',subcategory: 'Server allocation',      planned: 200,  actual: 200,  ytdActual: 1000, note: 'VPS shared allocation for all Dextrip apps' },
      { category: 'Legal',         subcategory: 'Terms of service',       planned: 0,    actual: 0,    ytdActual: 0,    note: 'Non-custodial ToS drafting — pending engagement' },
      { category: 'Domain',        subcategory: 'dextrip.com + subdomains',planned: 5,   actual: 5,    ytdActual: 25,   note: 'dextrip.com, bot, tv, spot, client subdomains' },
    ],
  },
  {
    venture: 'Llife', color: '#85B7EB', sector: 'AI Life Assistant',
    currency: 'USD', period: 'May 2026',
    lines: [
      { category: 'Technology',    subcategory: 'Design tools (Figma)',   planned: 100,  actual: 0,    ytdActual: 0,    note: 'UI design and hardware CAD tooling' },
      { category: 'Technology',    subcategory: 'AI inference',           planned: 200,  actual: 0,    ytdActual: 0,    note: 'Cloud AI inference — starts at pilot launch' },
      { category: 'Infrastructure',subcategory: 'Server (shared)',        planned: 40,   actual: 40,   ytdActual: 200,  note: 'Shared VPS allocation' },
      { category: 'Domain',        subcategory: 'llife.ai',            planned: 2,    actual: 2,    ytdActual: 10,   note: 'Annual domain — monthly allocation' },
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

export const EXPENSES: Expense[] = [
  { id: 'EXP-001', date: '2026-05-01', description: 'VPS server — May 2026',          venture: 'Codelude', category: 'Infrastructure', amount: 120,  currency: 'USD', status: 'paid',      receipt: true,  notes: '64.227.160.224 — 2C/8G/160G CentOS 9. Auto-renewed.' },
  { id: 'EXP-002', date: '2026-05-01', description: 'Domain renewals — May allocation', venture: 'Codelude', category: 'Domain',        amount: 13,   currency: 'USD', status: 'paid',      receipt: true,  notes: 'Monthly allocation across codelude.com + all venture domains.' },
  { id: 'EXP-003', date: '2026-05-01', description: 'Binance API — May 2026',          venture: 'Dextrip',  category: 'Infrastructure', amount: 200,  currency: 'USD', status: 'paid',      receipt: true,  notes: 'VIP tier API access for strategy execution.' },
  { id: 'EXP-004', date: '2026-05-01', description: 'Bybit API — May 2026',            venture: 'Dextrip',  category: 'Infrastructure', amount: 80,   currency: 'USD', status: 'paid',      receipt: true,  notes: 'Secondary exchange API — partial month usage.' },
  { id: 'EXP-005', date: '2026-05-20', description: 'Resend email service',            venture: 'Codelude', category: 'SaaS',           amount: 0,    currency: 'USD', status: 'paid',      receipt: true,  notes: 'Free tier currently — contact form + NDA emails.' },
  { id: 'EXP-006', date: '2026-06-01', description: 'VPS server — June 2026',          venture: 'Codelude', category: 'Infrastructure', amount: 120,  currency: 'USD', status: 'recurring', receipt: false, notes: 'Recurring monthly. Due 2026-06-01.' },
  { id: 'EXP-007', date: '2026-06-01', description: 'Binance API — June 2026',         venture: 'Dextrip',  category: 'Infrastructure', amount: 200,  currency: 'USD', status: 'recurring', receipt: false, notes: 'Recurring monthly.' },
  { id: 'EXP-008', date: '2026-06-01', description: 'Roborns site survey',             venture: 'Roborns',  category: 'Engineering',    amount: 3000, currency: 'USD', status: 'pending',   receipt: false, notes: 'Mangaluru coastal site survey — planned June 2026. Pending vendor.' },
  { id: 'EXP-009', date: '2026-06-15', description: 'Thermal engineering — feasibility', venture: 'Roborns', category: 'Engineering',  amount: 5000, currency: 'USD', status: 'pending',   receipt: false, notes: 'Phase 1 feasibility study. Pending partner engagement.' },
  { id: 'EXP-010', date: '2026-06-30', description: 'Dubai HoldCo legal — initial retainer', venture: 'Codelude', category: 'Legal',  amount: 6500, currency: 'USD', status: 'pending',   receipt: false, notes: 'DIFC incorporation one-time ($5K) + first month retainer ($1.5K).' },
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
    ventures: ['Codelude', 'Roborns', 'Franchiseen', 'HubCV', 'Llife', 'Dextrip'],
    status: 'active', monthlyCost: 0, oneTimeCost: 0, currency: 'USD',
    startDate: '2025-01-01', equityNote: '100% HoldCo — fully vested',
    notes: 'Founder is not drawing a salary at this stage. Compensation via equity and future distributions.',
  },
  {
    id: 'PAY-002', name: 'Thermal Engineer (TBD)', role: 'Coastal Heat Exchange Lead', type: 'contractor',
    ventures: ['Roborns'],
    status: 'open', monthlyCost: 0, oneTimeCost: 10000, currency: 'USD',
    startDate: 'Q3 2026', equityNote: 'Advisory equity TBD',
    notes: 'One-time contract for Phase 1 feasibility study. Potential ongoing retainer post-pilot.',
  },
  {
    id: 'PAY-003', name: 'Government Liaison (TBD)', role: 'Permits & Regulatory', type: 'contractor',
    ventures: ['Roborns'],
    status: 'open', monthlyCost: 2000, oneTimeCost: 0, currency: 'USD',
    startDate: 'Q3 2026', equityNote: 'None',
    notes: 'Monthly retainer for Karnataka govt engagement — coastal authority, MESCOM, water board.',
  },
  {
    id: 'PAY-004', name: 'Franchise Partnership Manager (TBD)', role: 'Brand Acquisition', type: 'employee',
    ventures: ['Franchiseen'],
    status: 'open', monthlyCost: 4000, oneTimeCost: 0, currency: 'USD',
    startDate: 'Q4 2026', equityNote: 'ESOP — 0.5–1%',
    notes: 'Full-time hire. Base $3,500 + commission on franchise brands signed. Target: 5+ brands in 6 months.',
  },
  {
    id: 'PAY-005', name: 'Investment Legal Counsel (TBD)', role: 'SEBI / Compliance', type: 'contractor',
    ventures: ['Franchiseen'],
    status: 'open', monthlyCost: 2500, oneTimeCost: 5000, currency: 'USD',
    startDate: 'Q3 2026', equityNote: 'None',
    notes: 'External legal firm — monthly retainer + setup fee for SEBI pathway and investor agreement templates.',
  },
  {
    id: 'PAY-006', name: 'AI / ML Engineer (TBD)', role: 'Matching Engine', type: 'employee',
    ventures: ['HubCV'],
    status: 'open', monthlyCost: 7000, oneTimeCost: 0, currency: 'USD',
    startDate: 'Q4 2026', equityNote: 'ESOP — 1–1.5%',
    notes: 'Full-time remote. Python, LLM integration, vector databases. Anthropic SDK experience preferred.',
  },
  {
    id: 'PAY-007', name: 'Hardware Product Manager (TBD)', role: 'Hub Device & Supply Chain', type: 'employee',
    ventures: ['Llife'],
    status: 'open', monthlyCost: 6000, oneTimeCost: 0, currency: 'USD',
    startDate: 'Q4 2026', equityNote: 'ESOP — 0.75–1.25%',
    notes: 'Owns the HubCV, Dextrip, Franchiseen and Account Aggregator connectors that populate the five domains.',
  },
  {
    id: 'PAY-008', name: 'Dubai HoldCo Legal Counsel (TBD)', role: 'DIFC Incorporation & Token Structure', type: 'contractor',
    ventures: ['Codelude', 'Roborns'],
    status: 'open', monthlyCost: 1500, oneTimeCost: 5000, currency: 'USD',
    startDate: 'Q3 2026', equityNote: 'None',
    notes: 'DIFC-registered law firm. One-time incorporation ($5K) + monthly retainer for ongoing compliance.',
  },
  {
    id: 'PAY-009', name: 'Strategy Creator Lead (TBD)', role: 'Community & Creator Programme', type: 'employee',
    ventures: ['Dextrip'],
    status: 'open', monthlyCost: 3500, oneTimeCost: 0, currency: 'USD',
    startDate: 'Q3 2026', equityNote: 'ESOP — 0.25–0.5%',
    notes: 'Owns creator recruitment and marketplace growth. Crypto-native community experience required.',
  },
  {
    id: 'PAY-010', name: 'Smart Contract Auditor (TBD)', role: 'Token Security Audit', type: 'contractor',
    ventures: ['Roborns', 'Codelude'],
    status: 'planned', monthlyCost: 0, oneTimeCost: 35000, currency: 'USD',
    startDate: 'Q4 2026', equityNote: 'None',
    notes: 'One-time audit of Roborns token smart contract. Required before any token issuance. Budget $20–50K.',
  },
];
