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
  // Studio / LLIFE
  { venture: 'LLIFE', category: 'Infrastructure',  monthlyBudget: 120,    spentToDate: 120,    currency: 'USD', note: 'VPS server — 64.227.160.224 (2C / 8G / 160G)',              status: 'on-track' },
  { venture: 'LLIFE', category: 'Domains',         monthlyBudget: 30,     spentToDate: 15,     currency: 'USD', note: 'llife.app, llife.app, roborns.com, franchiseen.com, hubcv.pro etc.', status: 'on-track' },
  { venture: 'LLIFE', category: 'Legal (HoldCo)',  monthlyBudget: 1500,   spentToDate: 0,      currency: 'USD', note: 'Dubai HoldCo incorporation and token structure counsel',      status: 'not-started' },
  { venture: 'LLIFE', category: 'Tools & SaaS',    monthlyBudget: 100,    spentToDate: 45,     currency: 'USD', note: 'AI tools, design, productivity subscriptions',               status: 'under' },

  // Llife
  { venture: 'Llife',  category: 'Product Dev',     monthlyBudget: 0,      spentToDate: 0,      currency: 'USD', note: 'In-house — no external dev cost yet',                      status: 'on-track' },
  { venture: 'Llife',  category: 'Integrations',     monthlyBudget: 0,      spentToDate: 0,      currency: 'USD', note: '$120K build — HubCV, Nanotrade, Franchiseen and AA connectors', status: 'not-started' },
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


// Cap table and investor rounds for the consolidated ventures are retagged to
// the LLIFE HoldCo rather than dropped. A brand consolidation does not
// dissolve a legal entity or erase a round that was raised against it, and a
// cap table that silently omits project entities is simply wrong. Tagging them
// to the HoldCo is also what keeps them visible — a row naming a venture that
// has left the registry is archived out of the UI.
export const INVESTOR_ROUNDS: InvestorRound[] = [
  {
    id: 'R1',
    venture: 'LLIFE',
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
    venture: 'LLIFE',
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
    venture: 'LLIFE',
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
    venture: 'LLIFE',
    roundName: 'Revenue Reinvestment',
    type: 'revenue',
    targetAmount: 'Self-funded',
    raisedAmount: 'Active',
    status: 'active',
    structure: 'No external raise planned. Closed beta generating subscription revenue. Public beta launch funded from existing revenue. Reinvesting 80% of revenue into growth.',
    keyTerms: 'N/A — founder-funded.',
    leadInvestor: 'Shawaz (Founder)',
    targetClose: 'Ongoing',
    notes: 'Nanotrade is the most capital-efficient venture. Consider strategic round at $500K MRR to accelerate institutional API tier and DeFi integrations.',
  },
  {
    id: 'R5',
    venture: 'LLIFE',
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
    venture: 'Llife',
    roundName: 'Hardware Pre-Seed',
    type: 'equity',
    targetAmount: '$200K – $400K',
    raisedAmount: '$0',
    status: 'planning',
    structure: 'Pre-seed to fund hardware MOQ, firmware development, and 10-home pilot programme. Property developer pre-installation deal could replace or reduce equity needed.',
    keyTerms: 'SAFE — $2M cap, 20% discount. Hardware-first investors preferred for operational expertise.',
    leadInvestor: 'Seeking — consumer AI or personal-finance angel',
    targetClose: 'Q3 2026 — or when hardware partner is signed',
    notes: 'Property developer anchor deal (pre-installation for new builds) is the alternative to equity — explore both simultaneously.',
  },
  {
    id: 'R7',
    venture: 'LLIFE',
    roundName: 'Roborns Pilot — Delhi Broker Introduction',
    type: 'equity',
    targetAmount: '₹15 Cr – ₹20 Cr (pilot tranche). Broker figure has escalated: ₹15–150 Cr (Sep 4) → ₹150–200 Cr (Sep 7). Unconfirmed at every stage.',
    raisedAmount: '₹0',
    status: 'seeking',
    structure: 'Introduction-led equity raise for the Roborns pilot via Jafar Khan (Delhi), who represents a pool of investors. Investment would come from his investor pool directly — NOT through Metro Samrudhi Nidhi Limited, which is his separate business and is not the investing vehicle. Target entity is still Roborns Energy & Infrastructure Pvt. Ltd., which is not yet incorporated.',
    keyTerms: 'None agreed. Counterparty has asked us to set up a Delhi office as a precondition for running the funding process. No term sheet, no named investor, no fee structure discussed yet.',
    leadInvestor: 'Delhi introducer — named as Jafar Khan (Sep 4) and as Javed (Sep 7). CONFIRM WHETHER ONE PERSON OR TWO. Introducer, not investor of record. Relationship to Metro Samrudhi Nidhi Ltd unverified.',
    targetClose: 'Unset — gated on verification checklist below and on incorporating the Indian entity.',
    notes: 'VERIFIED 2026-09-04 (public filings, CIN U65990UP2021PLN150488): Metro Samrudhi Nidhi Ltd is a real, active public company. Incorporated 10 Aug 2021, registered Ghaziabad UTTAR PRADESH (RoC-Kanpur) — not Delhi. Authorised capital ₹10 lakh, PAID-UP CAPITAL ₹5 LAKH. Directors of record: Firoz Khan, Narender Kumar (both since inception), Vikash Kumar Mishra, Rakesh Kumar (since 03 Jul 2024). || TWO GAPS: (1) JAFAR KHAN IS NOT A DIRECTOR OF RECORD. A Firoz Khan is. Establish whether Jafar Khan is a shareholder, a relative, or whether the ownership claim is loose. (2) The company brands as metronidhibank.com — a Nidhi is not a bank and s.7 Banking Regulation Act 1949 reserves the word for licensed banks. Association risk to us. || SINCE THE NIDHI IS NOT THE INVESTING VEHICLE, Nidhi Rules 2014 r.6 (which bars a Nidhi from acquiring securities of any body corporate) is NOT a blocker — but the Nidhi is then purely a credibility signal, and at ₹5 lakh paid-up it is not evidence of capacity to place ₹15–150 Cr. || CHECKLIST BEFORE ANY SPEND: [ ] Confirm Jafar Khan legal relationship to the company (shareholding pattern / MGT-7). [ ] Two named investors from the pool take a direct 15-min call with founder. [ ] Confirm what he is registered as to arrange a placement (SEBI merchant banker / IFA / nothing). [ ] Written fee terms: success fee only, 2–4 percent cap, payable from cleared proceeds — zero upfront, no retainer, no processing or documentation charge. [ ] Funds route to an escrow account controlled by our CA. [ ] Investor count stays under the 200-person private placement cap (s.42 Companies Act) or it becomes a deemed public offer with liability on US. [ ] Roborns Energy & Infrastructure Pvt Ltd incorporated + DPIIT — hard gate, money cannot land in a company that does not exist. || TRIP LOGGED 7 Sep 2026: travelling to Delhi Wednesday night, meeting the introducer the following Tuesday (~6 days after arrival — confirm). Stated purpose: introductions to investors for a ₹150–200 Cr raise. GO POSITION: nothing to sell yet — entity not incorporated, no power opinion (EXP-010), no CRZ status (EXP-011), no site survey (EXP-008), no thermal feasibility (EXP-009). Treat as market research, not a raise. HARD RULES FOR THE TRIP: no money moves in any form (no FD, no processing/documentation fee, no office deposit, no retainer); sign NOTHING — in particular no exclusive mandate, MoU or fee agreement granting rights over the raise, which would poison later fundraising; get investor names and entities in writing. REFRAME WORTH TRYING: the closeable ask is ₹15–20 LAKH to fund the gates and feasibility, not ₹150–200 Cr. A nine-figure ask from a pre-incorporation company reads as unserious and burns the credibility of the introducer with his own contacts; a small, evidenced ask with a stated path to a ₹15 Cr Phase 1 is fundable. || OPEN RED FLAG: the Delhi office is requested as a PRECONDITION to funding. Legitimate investors do not require the raising party to incur cost or establish presence before wiring. Do not lease, register, or pay for anything until the checklist above clears. || Also unreconciled: this is an India equity path, while the Investors page still describes Roborns as tokenised revenue-share under a Dubai HoldCo, and fundraise/page.tsx plans a ₹18.1 Cr CCD round to Karnataka and Gulf family offices. Pick one story before investor conversations.',
  },
];

// ─── SHARES ───────────────────────────────────────────────────────────────────

export interface ShareEntry {
  entity: string;
  /** Undefined means HoldCo-level — shown on every venture tab. See isHoldCo. */
  venture?: string;
  shareholder: string;
  shareClass: string;
  percentage: number;
  shares: string;
  vestingSchedule: string;
  notes: string;
}


// Cap table and investor rounds for the consolidated ventures are retagged to
// the LLIFE HoldCo rather than dropped. A brand consolidation does not
// dissolve a legal entity or erase a round that was raised against it, and a
// cap table that silently omits project entities is simply wrong. Tagging them
// to the HoldCo is also what keeps them visible — a row naming a venture that
// has left the registry is archived out of the UI.
export const SHARES: ShareEntry[] = [
  { entity: 'LLIFE HoldCo (Dubai)',  shareholder: 'Shawaz (Founder)',    shareClass: 'Ordinary A',  percentage: 100,  shares: '10,000,000',  vestingSchedule: 'Fully vested',               notes: 'Founder shares — sole shareholder at incorporation. Dilution expected via strategic and token rounds.' },
  { entity: 'LLIFE HoldCo (Dubai)',  shareholder: 'Strategic Reserve',   shareClass: 'Token Pool',   percentage: 0,    shares: 'TBD',         vestingSchedule: 'Per token tranche schedule', notes: 'Reserved for HoldCo token issuance — exact allocation TBD on token structure finalisation.' },
  { entity: 'LLIFE HoldCo (Dubai)',  shareholder: 'Employee Pool',       shareClass: 'Options',      percentage: 0,    shares: 'TBD',         vestingSchedule: '4-year / 1-year cliff',      notes: 'ESOP pool to be created before first team hire. Recommended: 10–15% of total cap table.' },
  { entity: 'Roborns (Project Entity)', venture: 'LLIFE', shareholder: 'LLIFE HoldCo',    shareClass: 'Ordinary',     percentage: 100,  shares: 'TBD',         vestingSchedule: 'N/A',                        notes: 'Roborns will be a subsidiary of LLIFE HoldCo. Token holders get revenue share, not equity.' },
  { entity: 'Franchiseen (Project)', venture: 'LLIFE',    shareholder: 'LLIFE HoldCo',    shareClass: 'Ordinary',     percentage: 100,  shares: 'TBD',         vestingSchedule: 'N/A',                        notes: 'Pre-seed round will dilute HoldCo stake. Target: retain 70%+ post seed.' },
  { entity: 'Nanotrade (Project)', venture: 'LLIFE',        shareholder: 'LLIFE HoldCo',    shareClass: 'Ordinary',     percentage: 100,  shares: 'TBD',         vestingSchedule: 'N/A',                        notes: 'No external raise planned. 100% HoldCo owned.' },
  { entity: 'HubCV (Project)', venture: 'LLIFE',          shareholder: 'LLIFE HoldCo',    shareClass: 'Ordinary',     percentage: 100,  shares: 'TBD',         vestingSchedule: 'N/A',                        notes: 'Bootstrap phase. No external shareholders.' },
  { entity: 'Llife (Project)', venture: 'Llife',        shareholder: 'LLIFE HoldCo',    shareClass: 'Ordinary',     percentage: 100,  shares: 'TBD',         vestingSchedule: 'N/A',                        notes: 'Consumer AI pre-seed will bring in angel investors. Target: retain 75%+ post round.' },
];

// ─── WALLETS ─────────────────────────────────────────────────────────────────

export type WalletStatus = 'active' | 'pending' | 'cold';
export type WalletChain  = 'Ethereum' | 'Polygon' | 'Solana' | 'BNB Chain' | 'Multi-chain';

export interface Wallet {
  label: string;
  /** Undefined means HoldCo-level — shown on every venture tab. See isHoldCo. */
  venture?: string;
  chain: WalletChain;
  address: string;
  purpose: string;
  status: WalletStatus;
  balance: string;
  notes: string;
}

export const WALLETS: Wallet[] = [
  { label: 'HoldCo Treasury',      chain: 'Ethereum',   address: '0x — not yet deployed',   purpose: 'Primary Dubai HoldCo treasury wallet — receives token sale proceeds and distributes to project entities', status: 'pending', balance: '$0',      notes: 'Deploy after legal structure finalised. Multisig (2-of-3) recommended.' },
  { label: 'Token Issuance Wallet', chain: 'Ethereum',   address: '0x — not yet deployed',   purpose: 'Issues and manages Roborns token and eventually LLIFE studio token',                                   status: 'pending', balance: '$0',      notes: 'Requires smart contract audit before token issuance. Budget $20–50K for audit.' },
  { label: 'Investor Distributions',chain: 'Ethereum',  address: '0x — not yet deployed',   purpose: 'Quarterly revenue distribution wallet — sends proportional payouts to token holders',                     status: 'pending', balance: '$0',      notes: 'Linked to HoldCo Treasury. Automated distribution contract to be built.' },
  { label: 'Operational Cold Store',chain: 'Ethereum',  address: '0x — not yet deployed',   purpose: 'Cold storage for any crypto held in reserve — hardware wallet controlled by founder',                    status: 'cold',    balance: '$0',      notes: 'Ledger hardware wallet. Address generated offline.' },
];

// ─── ACCOUNTS ────────────────────────────────────────────────────────────────

export type AccountStatus = 'active' | 'pending' | 'planned';
export type AccountType   = 'Current' | 'Savings' | 'Escrow' | 'Exchange';

export interface Account {
  entity: string;
  /** Undefined means HoldCo-level — shown on every venture tab. See isHoldCo. */
  venture?: string;
  bank: string;
  type: AccountType;
  currency: string;
  purpose: string;
  status: AccountStatus;
  notes: string;
}

export const ACCOUNTS: Account[] = [
  { entity: 'LLIFE HoldCo (Dubai)',  bank: 'Emirates NBD / Mashreq (TBD)', type: 'Current',  currency: 'AED / USD', purpose: 'Primary operating account for Dubai HoldCo — receives investor capital, pays project entities',             status: 'planned', notes: 'Requires HoldCo incorporation to open. Target: Q3 2026.' },
  { entity: 'LLIFE India',           bank: 'HDFC Bank',                    type: 'Current',  currency: 'INR',       purpose: 'Engineering operations in Mangaluru — salaries, contractors, Roborns site costs',                         status: 'planned', notes: 'Open alongside Roborns engineering engagement. FIRA compliance for inward remittances from Dubai.' },
  { entity: 'LLIFE Operations (MY)', bank: 'TBD',                          type: 'Current',  currency: 'MYR / USD', purpose: 'Southeast Asia operations account — for future expansion into Malaysia / Singapore markets',              status: 'planned', notes: 'Not urgent — open when SE Asia operations begin (est. 2027).' },
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
  { id: 'INV-005', venture: 'LLIFE',client: 'Internal (Operations)',  description: 'Server infrastructure — May 2026',                    amount: 120,  currency: 'USD', issueDate: '2026-05-01', dueDate: '2026-05-05', status: 'paid',    notes: 'Monthly VPS cost — auto-renewing.' },
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
  { name: 'VPS Provider (Server)',        type: 'Infrastructure', ventures: ['LLIFE'],                             amount: '~$120',      currency: 'USD', frequency: 'monthly',  status: 'active',  category: 'Infrastructure', notes: '64.227.160.224 — 2C/8G/160G CentOS 9 server hosting all platforms.' },
  { name: 'Domain Registrar',            type: 'Infrastructure', ventures: ['LLIFE'],                             amount: '~$30',       currency: 'USD', frequency: 'monthly',  status: 'active',  category: 'Infrastructure', notes: 'llife.app, roborns.com, franchiseen.com, hubcv.com, llife.ai, nanotrade.com.' },
  { name: 'AI API (Anthropic/OpenAI)',   type: 'SaaS',           ventures: ['LLIFE'],                    amount: '$50–400',    currency: 'USD', frequency: 'variable', status: 'pending', category: 'AI Infrastructure', notes: 'LLM API usage for HubCV matching engine and internal tools. Cost scales with usage.' },
  { name: 'Dubai Legal Counsel',         type: 'Legal',          ventures: ['LLIFE'],                  amount: '$1,500/mo',  currency: 'USD', frequency: 'monthly',  status: 'pending', category: 'Legal', notes: 'HoldCo incorporation, token structure, and ongoing compliance. DIFC-registered firm.' },
  { name: 'LLM Inference (Llife)',      type: 'Supplier',       ventures: ['Llife'],                              amount: '$2K/month',  currency: 'USD', frequency: 'monthly',  status: 'pending', category: 'Technology',    notes: 'Per-user assistant reasoning — daily summaries, nudges and domain reviews. Scales with active users.' },
  { name: 'Smart Contract Audit',       type: 'Professional',   ventures: ['LLIFE'],                  amount: '$20K–50K',   currency: 'USD', frequency: 'one-time', status: 'pending', category: 'Legal', notes: 'Required before token issuance. Budget for Roborns token smart contract security audit.' },
];


// ─── VENTURE SCOPING ─────────────────────────────────────────────────────────

/**
 * A row with no `venture` belongs to the HoldCo, not to any one venture: the
 * Dubai treasury, the founder's cap table entry, the India operating account.
 *
 * The Finance strip carries the five ventures only (matching Financial Model),
 * so HoldCo rows have no tab of their own. They appear on every venture tab
 * instead, badged, because the HoldCo does in fact own all five ventures —
 * showing them everywhere is truer than hiding them.
 */
export function isHoldCo(row: { venture?: string }): boolean {
  return !row.venture;
}

/** Rows for one venture tab: that venture's own rows, plus HoldCo-level ones. */
export function forVenture<T extends { venture?: string }>(rows: T[], venture: string): T[] {
  return rows.filter(r => isHoldCo(r) || r.venture === venture);
}
