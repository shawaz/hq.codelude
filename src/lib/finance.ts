// ─── BUDGET ──────────────────────────────────────────────────────────────────

export type BudgetStatus = 'on-track' | 'over' | 'under' | 'not-started';

export interface BudgetLine {
  venture: string;
  category: string;
  monthlyBudget: number;
  spentToDate: number;   // May 2026 MTD
  currency: 'USD' | 'AED' | 'INR';
  note: string;
  status: BudgetStatus;
}

export const BUDGET: BudgetLine[] = [
  // Studio / Codelude
  { venture: 'Codelude', category: 'Infrastructure',  monthlyBudget: 120,    spentToDate: 120,    currency: 'USD', note: 'VPS server — 64.227.160.224 (2C / 8G / 160G)',              status: 'on-track' },
  { venture: 'Codelude', category: 'Domains',         monthlyBudget: 30,     spentToDate: 15,     currency: 'USD', note: 'codelude.com, roborns.com, franchiseen.com, hubcv.com etc.', status: 'on-track' },
  { venture: 'Codelude', category: 'Legal (HoldCo)',  monthlyBudget: 1500,   spentToDate: 0,      currency: 'USD', note: 'Dubai HoldCo incorporation and token structure counsel',      status: 'not-started' },
  { venture: 'Codelude', category: 'Tools & SaaS',    monthlyBudget: 100,    spentToDate: 45,     currency: 'USD', note: 'AI tools, design, productivity subscriptions',               status: 'under' },

  // Roborns
  { venture: 'Roborns',  category: 'Engineering',     monthlyBudget: 5000,   spentToDate: 0,      currency: 'USD', note: 'Thermal engineering partner — feasibility study',            status: 'not-started' },
  { venture: 'Roborns',  category: 'Legal',           monthlyBudget: 2000,   spentToDate: 0,      currency: 'USD', note: 'Coastal permits, environmental clearance legal counsel',     status: 'not-started' },
  { venture: 'Roborns',  category: 'Site Survey',     monthlyBudget: 3000,   spentToDate: 0,      currency: 'INR', note: 'Uchila Thalapady site survey and land assessment',          status: 'not-started' },

  // Franchiseen
  { venture: 'Franchiseen', category: 'Development',  monthlyBudget: 0,      spentToDate: 0,      currency: 'USD', note: 'In-house development — no external cost',                   status: 'on-track' },
  { venture: 'Franchiseen', category: 'Legal',        monthlyBudget: 2500,   spentToDate: 0,      currency: 'USD', note: 'Investment platform compliance, investor agreement templates', status: 'not-started' },
  { venture: 'Franchiseen', category: 'KYC/AML',      monthlyBudget: 300,    spentToDate: 0,      currency: 'USD', note: 'KYC provider integration — pending provider selection',     status: 'not-started' },
  { venture: 'Franchiseen', category: 'Payment Infra',monthlyBudget: 150,    spentToDate: 0,      currency: 'USD', note: 'Stripe / Razorpay processing fees (est. at launch)',        status: 'not-started' },

  // HubCV
  { venture: 'HubCV',    category: 'AI Infrastructure',monthlyBudget: 400,   spentToDate: 0,      currency: 'USD', note: 'LLM API costs for matching engine — OpenAI / Anthropic',   status: 'not-started' },
  { venture: 'HubCV',    category: 'Verifier Network', monthlyBudget: 1000,  spentToDate: 0,      currency: 'USD', note: 'Pay-per-assessment for human skill verifiers',              status: 'not-started' },

  // Cuestay
  { venture: 'Cuestay',  category: 'Product Dev',     monthlyBudget: 0,      spentToDate: 0,      currency: 'USD', note: 'In-house — no external dev cost yet',                      status: 'on-track' },
  { venture: 'Cuestay',  category: 'Hardware (MOQ)',   monthlyBudget: 0,      spentToDate: 0,      currency: 'USD', note: '$200K–400K one-time MOQ — budgeted at manufacturing sign',  status: 'not-started' },

  // Dextrip
  { venture: 'Dextrip',  category: 'Infrastructure',  monthlyBudget: 200,    spentToDate: 180,    currency: 'USD', note: 'Exchange API costs, bot hosting, strategy engine compute',  status: 'on-track' },
  { venture: 'Dextrip',  category: 'Marketing',       monthlyBudget: 500,    spentToDate: 0,      currency: 'USD', note: 'Creator acquisition and public beta launch campaign',       status: 'not-started' },
];

// ─── INVESTORS ────────────────────────────────────────────────────────────────

export type RoundStatus = 'planning' | 'seeking' | 'negotiating' | 'closed' | 'active';
export type RoundType   = 'token' | 'equity' | 'bootstrap' | 'grant' | 'revenue';

export interface InvestorRound {
  id: string;
  venture: string;
  roundName: string;
  type: RoundType;
  targetAmount: string;
  raisedAmount: string;
  status: RoundStatus;
  structure: string;
  keyTerms: string;
  leadInvestor: string;
  targetClose: string;
  notes: string;
}

export const INVESTOR_ROUNDS: InvestorRound[] = [
  {
    id: 'R1',
    venture: 'Roborns',
    roundName: 'Seed Infrastructure Round',
    type: 'token',
    targetAmount: '$3M – $5M',
    raisedAmount: '$0',
    status: 'planning',
    structure: 'Dubai HoldCo token — each token represents a proportional revenue share in the physical facility (compute + water + minerals). Token issued pre-construction to fund Phase 1 capex.',
    keyTerms: 'Revenue share (not equity). Token holders receive quarterly distributions from facility revenue. No fixed repayment. Token transferable after 12-month lock-up.',
    leadInvestor: 'Seeking — target: Gulf-based infrastructure or clean-tech fund',
    targetClose: 'Q4 2026',
    notes: 'Requires feasibility study and anchor tenant LOI before token offering can launch. Legal structure via DIFC or ADGM.',
  },
  {
    id: 'R2',
    venture: 'Codelude',
    roundName: 'Studio Token — HoldCo',
    type: 'token',
    targetAmount: 'TBD',
    raisedAmount: '$0',
    status: 'planning',
    structure: 'Parent HoldCo token giving holders exposure across all five ventures proportionally. Issued via Dubai entity. Tranche structure: strategic (10%), early community (20%), growth (70%).',
    keyTerms: 'Participation in studio-level revenue. Token utility includes governance rights on new venture additions and revenue distribution voting.',
    leadInvestor: 'Seeking strategic anchor — target: family office or deep-tech fund',
    targetClose: 'Q1 2027 (after Roborns token proves the structure)',
    notes: 'Studio token is the long-term play. Roborns token is the proof of concept for the structure.',
  },
  {
    id: 'R3',
    venture: 'Franchiseen',
    roundName: 'Platform Seed',
    type: 'equity',
    targetAmount: '$150K – $300K',
    raisedAmount: '$0',
    status: 'planning',
    structure: 'Pre-seed equity round to fund platform completion, KYC/AML integration, compliance legal costs, and first franchise partner acquisition. SAFE note preferred.',
    keyTerms: 'SAFE — $1.5M cap, 20% discount. Pro-rata rights for angels above $25K. No board seat at this stage.',
    leadInvestor: 'Bootstrapping until first payout proof, then angel round',
    targetClose: 'Q4 2026 (post first payout cycle)',
    notes: 'First payout cycle is the fundraising event. Proof of concept drastically improves terms.',
  },
  {
    id: 'R4',
    venture: 'Dextrip',
    roundName: 'Revenue Reinvestment',
    type: 'revenue',
    targetAmount: 'Self-funded',
    raisedAmount: 'Active',
    status: 'active',
    structure: 'No external raise planned. Closed beta generating subscription revenue. Public beta launch funded from existing revenue. Reinvesting 80% of revenue into growth.',
    keyTerms: 'N/A — founder-funded.',
    leadInvestor: 'Shawaz (Founder)',
    targetClose: 'Ongoing',
    notes: 'Dextrip is the most capital-efficient venture. Consider strategic round at $500K MRR to accelerate institutional API tier and DeFi integrations.',
  },
  {
    id: 'R5',
    venture: 'HubCV',
    roundName: 'Bootstrap Phase',
    type: 'bootstrap',
    targetAmount: '$80K – $150K',
    raisedAmount: '$0',
    status: 'planning',
    structure: 'Founder-funded through platform launch. AI infrastructure costs are the primary expense. After 20 paying recruiter accounts, the platform self-funds.',
    keyTerms: 'N/A.',
    leadInvestor: 'Shawaz (Founder)',
    targetClose: 'Q1 2027 break-even',
    notes: 'If bootcamp partnership channel works, acquisition cost drops to near zero and the model becomes highly efficient before any external capital needed.',
  },
  {
    id: 'R6',
    venture: 'Cuestay',
    roundName: 'Hardware Pre-Seed',
    type: 'equity',
    targetAmount: '$200K – $400K',
    raisedAmount: '$0',
    status: 'planning',
    structure: 'Pre-seed to fund hardware MOQ, firmware development, and 10-home pilot programme. Property developer pre-installation deal could replace or reduce equity needed.',
    keyTerms: 'SAFE — $2M cap, 20% discount. Hardware-first investors preferred for operational expertise.',
    leadInvestor: 'Seeking — property tech or IoT-focused angel',
    targetClose: 'Q3 2026 — or when hardware partner is signed',
    notes: 'Property developer anchor deal (pre-installation for new builds) is the alternative to equity — explore both simultaneously.',
  },
];

// ─── SHARES ───────────────────────────────────────────────────────────────────

export interface ShareEntry {
  entity: string;
  shareholder: string;
  shareClass: string;
  percentage: number;
  shares: string;
  vestingSchedule: string;
  notes: string;
}

export const SHARES: ShareEntry[] = [
  { entity: 'Codelude HoldCo (Dubai)',  shareholder: 'Shawaz (Founder)',    shareClass: 'Ordinary A',  percentage: 100,  shares: '10,000,000',  vestingSchedule: 'Fully vested',               notes: 'Founder shares — sole shareholder at incorporation. Dilution expected via strategic and token rounds.' },
  { entity: 'Codelude HoldCo (Dubai)',  shareholder: 'Strategic Reserve',   shareClass: 'Token Pool',   percentage: 0,    shares: 'TBD',         vestingSchedule: 'Per token tranche schedule', notes: 'Reserved for HoldCo token issuance — exact allocation TBD on token structure finalisation.' },
  { entity: 'Codelude HoldCo (Dubai)',  shareholder: 'Employee Pool',       shareClass: 'Options',      percentage: 0,    shares: 'TBD',         vestingSchedule: '4-year / 1-year cliff',      notes: 'ESOP pool to be created before first team hire. Recommended: 10–15% of total cap table.' },
  { entity: 'Roborns (Project Entity)', shareholder: 'Codelude HoldCo',    shareClass: 'Ordinary',     percentage: 100,  shares: 'TBD',         vestingSchedule: 'N/A',                        notes: 'Roborns will be a subsidiary of Codelude HoldCo. Token holders get revenue share, not equity.' },
  { entity: 'Franchiseen (Project)',    shareholder: 'Codelude HoldCo',    shareClass: 'Ordinary',     percentage: 100,  shares: 'TBD',         vestingSchedule: 'N/A',                        notes: 'Pre-seed round will dilute HoldCo stake. Target: retain 70%+ post seed.' },
  { entity: 'Dextrip (Project)',        shareholder: 'Codelude HoldCo',    shareClass: 'Ordinary',     percentage: 100,  shares: 'TBD',         vestingSchedule: 'N/A',                        notes: 'No external raise planned. 100% HoldCo owned.' },
  { entity: 'HubCV (Project)',          shareholder: 'Codelude HoldCo',    shareClass: 'Ordinary',     percentage: 100,  shares: 'TBD',         vestingSchedule: 'N/A',                        notes: 'Bootstrap phase. No external shareholders.' },
  { entity: 'Cuestay (Project)',        shareholder: 'Codelude HoldCo',    shareClass: 'Ordinary',     percentage: 100,  shares: 'TBD',         vestingSchedule: 'N/A',                        notes: 'Hardware pre-seed will bring in angel investors. Target: retain 75%+ post round.' },
];

// ─── WALLETS ─────────────────────────────────────────────────────────────────

export type WalletStatus = 'active' | 'pending' | 'cold';
export type WalletChain  = 'Ethereum' | 'Polygon' | 'Solana' | 'BNB Chain' | 'Multi-chain';

export interface Wallet {
  label: string;
  chain: WalletChain;
  address: string;
  purpose: string;
  status: WalletStatus;
  balance: string;
  notes: string;
}

export const WALLETS: Wallet[] = [
  { label: 'HoldCo Treasury',      chain: 'Ethereum',   address: '0x — not yet deployed',   purpose: 'Primary Dubai HoldCo treasury wallet — receives token sale proceeds and distributes to project entities', status: 'pending', balance: '$0',      notes: 'Deploy after legal structure finalised. Multisig (2-of-3) recommended.' },
  { label: 'Token Issuance Wallet', chain: 'Ethereum',   address: '0x — not yet deployed',   purpose: 'Issues and manages Roborns token and eventually Codelude studio token',                                   status: 'pending', balance: '$0',      notes: 'Requires smart contract audit before token issuance. Budget $20–50K for audit.' },
  { label: 'Dextrip Operations',   chain: 'Multi-chain', address: 'Exchange API accounts',   purpose: 'Operational wallet for Dextrip strategy execution — holds user API keys, not funds (non-custodial)',     status: 'active',  balance: 'N/A',     notes: 'Non-custodial — Dextrip never holds user funds. API key vault only.' },
  { label: 'Investor Distributions',chain: 'Ethereum',  address: '0x — not yet deployed',   purpose: 'Quarterly revenue distribution wallet — sends proportional payouts to token holders',                     status: 'pending', balance: '$0',      notes: 'Linked to HoldCo Treasury. Automated distribution contract to be built.' },
  { label: 'Operational Cold Store',chain: 'Ethereum',  address: '0x — not yet deployed',   purpose: 'Cold storage for any crypto held in reserve — hardware wallet controlled by founder',                    status: 'cold',    balance: '$0',      notes: 'Ledger hardware wallet. Address generated offline.' },
];

// ─── ACCOUNTS ────────────────────────────────────────────────────────────────

export type AccountStatus = 'active' | 'pending' | 'planned';
export type AccountType   = 'Current' | 'Savings' | 'Escrow' | 'Exchange';

export interface Account {
  entity: string;
  bank: string;
  type: AccountType;
  currency: string;
  purpose: string;
  status: AccountStatus;
  notes: string;
}

export const ACCOUNTS: Account[] = [
  { entity: 'Codelude HoldCo (Dubai)',  bank: 'Emirates NBD / Mashreq (TBD)', type: 'Current',  currency: 'AED / USD', purpose: 'Primary operating account for Dubai HoldCo — receives investor capital, pays project entities',             status: 'planned', notes: 'Requires HoldCo incorporation to open. Target: Q3 2026.' },
  { entity: 'Codelude India',           bank: 'HDFC Bank',                    type: 'Current',  currency: 'INR',       purpose: 'Engineering operations in Mangaluru — salaries, contractors, Roborns site costs',                         status: 'planned', notes: 'Open alongside Roborns engineering engagement. FIRA compliance for inward remittances from Dubai.' },
  { entity: 'Franchiseen (Platform)',   bank: 'TBD — escrow provider',        type: 'Escrow',   currency: 'INR / USD', purpose: 'Investor capital held in escrow before franchise deployment. Mandatory for regulatory compliance.',        status: 'planned', notes: 'Escrow account with regulated trustee is a legal requirement for holding retail investor funds.' },
  { entity: 'Dextrip Operations',       bank: 'Binance / Bybit (Exchange)',   type: 'Exchange', currency: 'USDT / BTC',purpose: 'Exchange accounts for strategy execution — API-connected to Dextrip multi-bot',                          status: 'active',  notes: 'Not a bank account — exchange accounts for operational trading. API keys stored securely in bot.' },
  { entity: 'Dextrip Revenue',          bank: 'Stripe (TBD)',                 type: 'Current',  currency: 'USD',       purpose: 'Subscription revenue collection for Dextrip public beta — Stripe or Paddle integration',                status: 'planned', notes: 'Apply after public beta launch. Requires business registration in a Stripe-supported country.' },
  { entity: 'Codelude Operations (MY)', bank: 'TBD',                          type: 'Current',  currency: 'MYR / USD', purpose: 'Southeast Asia operations account — for future expansion into Malaysia / Singapore markets',              status: 'planned', notes: 'Not urgent — open when SE Asia operations begin (est. 2027).' },
];

// ─── INVOICE ──────────────────────────────────────────────────────────────────

export type InvoiceStatus = 'paid' | 'pending' | 'overdue' | 'draft';

export interface Invoice {
  id: string;
  venture: string;
  client: string;
  description: string;
  amount: number;
  currency: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  notes: string;
}

export const INVOICES: Invoice[] = [
  { id: 'INV-001', venture: 'Dextrip', client: 'Beta User (Closed)',     description: 'Strategy engine beta subscription — May 2026',        amount: 99,   currency: 'USD', issueDate: '2026-05-01', dueDate: '2026-05-07', status: 'paid',    notes: 'First closed beta subscription payment confirmed.' },
  { id: 'INV-002', venture: 'Dextrip', client: 'Beta User (Closed)',     description: 'Strategy engine beta subscription — May 2026',        amount: 99,   currency: 'USD', issueDate: '2026-05-01', dueDate: '2026-05-07', status: 'paid',    notes: 'Second beta subscriber.' },
  { id: 'INV-003', venture: 'Dextrip', client: 'Beta User (Closed)',     description: 'Strategy engine beta subscription — May 2026',        amount: 29,   currency: 'USD', issueDate: '2026-05-01', dueDate: '2026-05-07', status: 'paid',    notes: 'Base tier beta subscriber.' },
  { id: 'INV-004', venture: 'Roborns', client: 'Internal (HoldCo)',      description: 'Thermal engineering consultation — feasibility phase', amount: 5000, currency: 'USD', issueDate: '2026-06-01', dueDate: '2026-06-15', status: 'draft',   notes: 'Placeholder — to be issued when engineering partner is engaged.' },
  { id: 'INV-005', venture: 'Codelude',client: 'Internal (Operations)',  description: 'Server infrastructure — May 2026',                    amount: 120,  currency: 'USD', issueDate: '2026-05-01', dueDate: '2026-05-05', status: 'paid',    notes: 'Monthly VPS cost — auto-renewing.' },
];

// ─── PAYEE ────────────────────────────────────────────────────────────────────

export type PayeeStatus    = 'active' | 'pending' | 'paused' | 'cancelled';
export type PayeeFrequency = 'monthly' | 'annual' | 'one-time' | 'variable';

export interface Payee {
  name: string;
  type: string;
  ventures: string[];
  amount: string;
  currency: string;
  frequency: PayeeFrequency;
  status: PayeeStatus;
  category: string;
  notes: string;
}

export const PAYEES: Payee[] = [
  { name: 'VPS Provider (Server)',        type: 'Infrastructure', ventures: ['Codelude'],                             amount: '~$120',      currency: 'USD', frequency: 'monthly',  status: 'active',  category: 'Infrastructure', notes: '64.227.160.224 — 2C/8G/160G CentOS 9 server hosting all platforms.' },
  { name: 'Domain Registrar',            type: 'Infrastructure', ventures: ['Codelude'],                             amount: '~$30',       currency: 'USD', frequency: 'monthly',  status: 'active',  category: 'Infrastructure', notes: 'codelude.com, roborns.com, franchiseen.com, hubcv.com, cuestay.com, dextrip.com.' },
  { name: 'AI API (Anthropic/OpenAI)',   type: 'SaaS',           ventures: ['HubCV', 'Codelude'],                    amount: '$50–400',    currency: 'USD', frequency: 'variable', status: 'pending', category: 'AI Infrastructure', notes: 'LLM API usage for HubCV matching engine and internal tools. Cost scales with usage.' },
  { name: 'Thermal Engineering Firm',    type: 'Contractor',     ventures: ['Roborns'],                              amount: '$5,000–10K', currency: 'USD', frequency: 'one-time', status: 'pending', category: 'Engineering', notes: 'Feasibility study and technical validation of closed-loop heat exchange system.' },
  { name: 'Dubai Legal Counsel',         type: 'Legal',          ventures: ['Codelude', 'Roborns'],                  amount: '$1,500/mo',  currency: 'USD', frequency: 'monthly',  status: 'pending', category: 'Legal', notes: 'HoldCo incorporation, token structure, and ongoing compliance. DIFC-registered firm.' },
  { name: 'Investment Platform Legal',   type: 'Legal',          ventures: ['Franchiseen'],                          amount: '$2,500/mo',  currency: 'USD', frequency: 'monthly',  status: 'pending', category: 'Legal', notes: 'KYC/AML compliance, investor agreement templates, and regulatory pathway.' },
  { name: 'KYC / AML Provider',         type: 'SaaS',           ventures: ['Franchiseen'],                          amount: '$200–500',   currency: 'USD', frequency: 'monthly',  status: 'pending', category: 'Compliance', notes: 'Per-verification pricing model. Cost scales with investor onboarding volume.' },
  { name: 'Stripe / Payment Processor', type: 'SaaS',           ventures: ['Franchiseen', 'Dextrip'],               amount: '2.9% + $0.30',currency:'USD', frequency: 'variable', status: 'pending', category: 'Payments', notes: 'Per-transaction fee. Apply to Stripe after business entity registration.' },
  { name: 'Binance API (VIP tier)',      type: 'Infrastructure', ventures: ['Dextrip'],                              amount: 'Volume-based',currency:'USD', frequency: 'variable', status: 'active',  category: 'Infrastructure', notes: 'Exchange API access. VIP tier needed for higher rate limits at public beta scale.' },
  { name: 'Hardware ODM Manufacturer',  type: 'Supplier',       ventures: ['Cuestay'],                              amount: '$200K–400K', currency: 'USD', frequency: 'one-time', status: 'pending', category: 'Manufacturing', notes: 'MOQ for Cuestay Hub production run. One-time capex — triggers at hardware partner sign.' },
  { name: 'Human Skill Verifiers',      type: 'Contractor',     ventures: ['HubCV'],                                amount: '$20–50/assess',currency:'USD', frequency: 'variable', status: 'pending', category: 'Operations', notes: 'Pay-per-assessment model for domain expert verifiers. Cost scales with profile volume.' },
  { name: 'Smart Contract Audit',       type: 'Professional',   ventures: ['Roborns', 'Codelude'],                  amount: '$20K–50K',   currency: 'USD', frequency: 'one-time', status: 'pending', category: 'Legal', notes: 'Required before token issuance. Budget for Roborns token smart contract security audit.' },
];
