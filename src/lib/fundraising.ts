// ─── INVESTOR PIPELINE ────────────────────────────────────────────────────────

export type PipelineStage =
  | 'identified' | 'researching' | 'outreach-ready'
  | 'contacted' | 'responded' | 'meeting-booked'
  | 'term-sheet' | 'closed-won' | 'closed-lost' | 'on-hold';

export interface InvestorLead {
  id:           string;
  name:         string;
  firm:         string;
  type:         string;          // e.g. VC, Angel, Family Office, Crypto Fund
  round:        string;          // which round they're being approached for
  stage:        PipelineStage;
  targetAmount: string;          // potential cheque size
  lastContact:  string;          // date
  nextAction:   string;
  notes:        string;
}

export const PIPELINE: InvestorLead[] = [
  {
    id: 'INV-001', name: 'Gulf Infrastructure Fund (TBD)', firm: 'TBD — Dubai/Abu Dhabi',
    type: 'Infrastructure VC', round: 'Roborns Seed',
    stage: 'researching', targetAmount: '₹5–8 Cr', lastContact: '—',
    nextAction: 'Build target list from Gulf infrastructure fund landscape. Aim: 3 warm intro paths.',
    notes: 'Focus: funds with portfolio in coastal infrastructure, clean tech, or real assets. DIFC-based preferred for HoldCo alignment.',
  },
  {
    id: 'INV-002', name: 'Deep-Tech Angel (TBD)', firm: 'Indian Angel Network / iSPIRT',
    type: 'Angel', round: 'Roborns Seed',
    stage: 'researching', targetAmount: '₹1–3 Cr', lastContact: '—',
    nextAction: 'Identify angels with infrastructure or energy exits. Bengaluru-based preferred.',
    notes: 'Target cheque: $25K–100K. Often co-invest with each other. Warm intro through bootcamp or startup community.',
  },
  {
    id: 'INV-003', name: 'RWA Token Fund (TBD)', firm: 'Crypto-native RWA fund',
    type: 'Crypto Fund', round: 'Codelude HoldCo Token',
    stage: 'identified', targetAmount: 'TBD', lastContact: '—',
    nextAction: 'Approach after DIFC HoldCo is incorporated and token structure is finalised.',
    notes: 'Real-world asset tokenisation is growing fast post-2025. Target: funds that already hold RWA tokens — infrastructure fits the thesis.',
  },
  {
    id: 'INV-004', name: 'Property Tech Angel (TBD)', firm: 'Dubai PropTech ecosystem',
    type: 'Angel', round: 'Cuestay Pre-seed',
    stage: 'identified', targetAmount: '$50–150K', lastContact: '—',
    nextAction: 'Pause until hardware partner is signed — anchor deal reduces capital needed.',
    notes: 'IoT / smart home hardware angel. Dubai-based preferred — they understand the property developer channel.',
  },
  {
    id: 'INV-005', name: 'Dextrip Beta User — Creator Investor', firm: 'Individual',
    type: 'Angel', round: 'Dextrip Growth',
    stage: 'responded', targetAmount: '$10–30K', lastContact: '2026-05-20',
    nextAction: 'Schedule call to discuss creator programme equity participation.',
    notes: 'One of the 3 paying beta users. Strong engagement — natural early investor candidate for the marketplace round.',
  },

  // ── KSA Expansion Targets (added Jun 2026) ─────────────────────────────
  {
    id: 'INV-006', name: 'ACWA Power', firm: 'ACWA Power (TADAWUL: 2082)',
    type: 'Strategic Partner', round: 'Roborns KSA Seed',
    stage: 'identified', targetAmount: '$2–5M strategic investment', lastContact: '—',
    nextAction: '✓ One-pager drafted (docs/ACWA-Power-One-Pager.md). Deliver via former Saudi partner (Riyadh) — request intro call.',
    notes: 'ACWA Power is the world\'s largest private water desal company and a major power player. They own the desal technology AND could be the offtaker. Natural strategic partner for KSA Roborns.',
  },
  {
    id: 'INV-007', name: 'PIF — Public Investment Fund', firm: 'PIF (Saudi SWF)',
    type: 'Sovereign Wealth Fund', round: 'Roborns KSA Seed',
    stage: 'identified', targetAmount: '$2–10M', lastContact: '—',
    nextAction: 'Map PIF tech portfolio companies (NEOM, Aramco Digital, etc.) for warm introductions. PIF has $40B+ AI compute commitment.',
    notes: 'PIF committed $40B+ to AI infrastructure under Vision 2030. Also owns ACWA Power (27.5%). Direct PIF investment unlikely at seed stage, but portfolio company invest or PIF-backed VC is feasible.',
  },
  {
    id: 'INV-008', name: 'MCIT AI Fund', firm: 'Saudi Ministry of Communications & IT',
    type: 'Government Grant', round: 'Roborns KSA Grant',
    stage: 'identified', targetAmount: '$1–3M grant', lastContact: '—',
    nextAction: 'Research MCIT AI grant programme parameters. Apply through local partner (Riyadh). National AI strategy alignment = higher approval odds.',
    notes: 'Saudi National Strategy for Data & AI (SDAIA) has dedicated funding for AI infrastructure. Immersion cooling + water desal = dual-benefit use case that aligns with Vision 2030 environmental goals.',
  },
  {
    id: 'INV-009', name: 'G42 / Mubadala', firm: 'G42 (Abu Dhabi) / Mubadala Investment Co.',
    type: 'Strategic / SWF', round: 'Roborns KSA Seed',
    stage: 'identified', targetAmount: '$2–5M', lastContact: '—',
    nextAction: 'Approach G42\'s data center arm as a conduit for Middle East AI compute infrastructure. G42 builds data centers across GCC.',
    notes: 'G42 is Abu Dhabi\'s AI & cloud giant with data centers across the region. They\'re building compute infrastructure for the Middle East. Immersion cooling + water desal is a differentiator for their new builds.',
  },
  {
    id: 'INV-010', name: 'SIDF — Saudi Industrial Dev Fund', firm: 'Saudi Industrial Development Fund',
    type: 'Govt Loan/Grant', round: 'Roborns KSA Grant',
    stage: 'identified', targetAmount: '$2–5M concessional loan', lastContact: '—',
    nextAction: 'Prepare industrial loan application. SIDF provides concessional loans up to 50–75% of project cost for manufacturing and industrial facilities in KSA.',
    notes: 'SIDF offers loans up to SAR 40M ($10.7M) per project at concessional rates for industrial facilities. Roborns\' manufacturing/industrial nature qualifies. Lowers equity requirement for KSA Phase 1.',
  },
  {
    id: 'INV-011', name: 'Masdar', firm: 'Masdar (Abu Dhabi Future Energy Co.)',
    type: 'Strategic Partner', round: 'Roborns KSA Seed',
    stage: 'identified', targetAmount: 'PPA + equity', lastContact: '—',
    nextAction: 'Explore renewable PPA for KSA Roborns facility. Masdar develops utility-scale solar/wind and could be the PPA counterparty.',
    notes: 'Masdar is the natural PPA partner for a zero-carbon Roborns facility. Pairing immersion cooling with Masdar renewable generation creates a compelling net-zero datacenter pitch.',
  },
];

export const PIPELINE_STAGES: { key: PipelineStage; label: string; color: string }[] = [
  { key: 'identified',     label: 'Identified',     color: '#4a4845' },
  { key: 'researching',    label: 'Researching',    color: '#7a7870' },
  { key: 'outreach-ready', label: 'Ready',          color: '#85B7EB' },
  { key: 'contacted',      label: 'Contacted',      color: '#FAC775' },
  { key: 'responded',      label: 'Responded',      color: '#c8f53a' },
  { key: 'meeting-booked', label: 'Meeting',        color: '#F0997B' },
  { key: 'term-sheet',     label: 'Term Sheet',     color: '#7F77DD' },
  { key: 'closed-won',     label: 'Closed ✓',      color: '#5DCAA5' },
  { key: 'closed-lost',    label: 'Lost',           color: '#ff8080' },
  { key: 'on-hold',        label: 'On Hold',        color: '#252522' },
];

// ─── ROUNDS ───────────────────────────────────────────────────────────────────

export interface Round {
  id:            string;
  name:          string;
  venture:       string;
  color:         string;
  type:          string;
  targetAmount:  string;
  raisedAmount:  string;
  raisedPct:     number;
  instrumentNote:string;
  closeTarget:   string;
  status:        'open' | 'planning' | 'closed' | 'paused';
  investorCount: number;
  keyTerms:      string;
  milestones:    { done: boolean; label: string }[];
  notes:         string;
}

export const ROUNDS: Round[] = [
  {
    id: 'R1', name: 'Roborns Seed Infrastructure Round', venture: 'Roborns', color: '#5DCAA5',
    type: 'Dubai HoldCo Token (Revenue Share)',
    targetAmount: '₹18.1 Cr (~$2.1M USD)', raisedAmount: '₹0', raisedPct: 0,
    instrumentNote: 'Token represents proportional revenue share in facility (compute + water + minerals). Not equity. 12-month lock-up.',
    closeTarget: 'Q4 2026', status: 'planning', investorCount: 0,
    keyTerms: 'Pre-money: ₹40 Cr (recalibrated Jun 2026). Exit: 10–12× EBITDA (infra REIT or M&A). Seed investor return target: 18–23×.',
    milestones: [
      { done: true,  label: '✓ Financial model recalibrated — realistic power/water/capex (see fin-models.ts)' },
      { done: false, label: 'Thermal engineering partner engaged' },
      { done: false, label: 'Site survey complete (Mangaluru)' },
      { done: false, label: 'Anchor compute tenant LOI signed' },
      { done: false, label: 'DIFC HoldCo incorporated' },
      { done: false, label: 'Smart contract audited' },
      { done: false, label: 'Token offering live — first investor close' },
    ],
    notes: 'Feasibility study and anchor tenant LOI required before the token offering goes live. Dubai HoldCo incorporation is the legal prerequisite.',
  },
  {
    id: 'R2', name: 'Codelude Studio Token — HoldCo Level', venture: 'Codelude', color: '#c8f53a',
    type: 'Dubai HoldCo Token (Studio-level exposure)',
    targetAmount: 'TBD (post Roborns proof)', raisedAmount: '₹0', raisedPct: 0,
    instrumentNote: 'Parent HoldCo token. Holders get proportional exposure across all 5 ventures. Issued after Roborns token validates the structure.',
    closeTarget: 'Q1 2027', status: 'planning', investorCount: 0,
    keyTerms: 'Tranches: Strategic 10%, Early Community 20%, Growth 70%. Governance rights included.',
    milestones: [
      { done: true,  label: 'Studio financial model and thesis documented' },
      { done: false, label: 'Roborns token structure proves the model' },
      { done: false, label: 'HoldCo token economics designed' },
      { done: false, label: 'Legal review of studio token (DFSA)' },
      { done: false, label: 'Strategic anchor investor secured' },
      { done: false, label: 'Studio token offering live' },
    ],
    notes: 'The studio token is the long game. Roborns token is the proof of concept for the whole structure. Do Roborns first.',
  },
  {
    id: 'R3', name: 'Dextrip Creator Growth Round', venture: 'Dextrip', color: '#F0997B',
    type: 'Bootstrap → Strategic at $500K MRR',
    targetAmount: '$200–500K (if needed)', raisedAmount: 'Self-funded', raisedPct: 0,
    instrumentNote: 'No external raise planned until $500K MRR. At that point: small strategic round for institutional API tier and DeFi integrations.',
    closeTarget: '2027 if needed', status: 'paused', investorCount: 0,
    keyTerms: 'SAFE at $5M cap if raised. Creator programme itself funds through 30% rev-share. Near-breakeven at closed beta.',
    milestones: [
      { done: true,  label: 'Closed beta live — 3 paying subscribers' },
      { done: false, label: 'Public beta launch — strategy marketplace' },
      { done: false, label: '200 paying subscribers' },
      { done: false, label: 'First 20 strategy creators onboarded' },
      { done: false, label: '$500K MRR — consider strategic raise' },
    ],
    notes: 'Dextrip is the most capital-efficient venture. Prioritise organic growth through the creator flywheel before external capital.',
  },
  {
    id: 'R4', name: 'Roborns KSA Expansion Round', venture: 'Roborns KSA', color: '#E8A87C',
    type: 'Equity + Strategic Grant',
    targetAmount: '$4.5M (~₹38 Cr)', raisedAmount: '$0', raisedPct: 0,
    instrumentNote: 'Equity via Dubai HoldCo → KSA subsidiary (local partner). Bundled with MCIT AI Fund grant + SIDF concessional loan.',
    closeTarget: 'Q2 2027', status: 'planning', investorCount: 0,
    keyTerms: 'Pre-money: $4.5M (₹38 Cr). Dual track: India Phase 1 prototype proves tech, KSA round scales it. Leverages subsidized KSA power ($0.048/kWh).',
    milestones: [
      { done: true,  label: '✓ Financial model added — KSA scenario in fin-models.ts' },
      { done: false, label: 'India Phase 1 construction completes (proof of concept)' },
      { done: false, label: 'ACWA Power strategic one-pager delivered via Riyadh partner' },
      { done: false, label: 'MCIT AI Fund grant application submitted' },
      { done: false, label: 'Dammam/Jubail industrial site scoped via Dammam contact' },
      { done: false, label: 'KSA subsidiary incorporated (Dubai HoldCo → MISA)' },
      { done: false, label: 'KSA seed round first close — PIF-backed VC / strategic anchor' },
    ],
    notes: 'KSA round is sequenced AFTER India Phase 1 construction. India prototype provides the operational proof that unlocks KSA institutional capital. Exceptions: ACWA Power engagement and MCIT grant can start in parallel with India build.',
  },
];

// ─── TOKEN STRUCTURE MILESTONES ───────────────────────────────────────────────

export interface TokenMilestone {
  id:       string;
  phase:    string;
  title:    string;
  status:   'done' | 'in-progress' | 'blocked' | 'planned';
  target:   string;
  owner:    string;
  cost:     string;
  notes:    string;
  blockedBy?: string;
}

export const TOKEN_MILESTONES: TokenMilestone[] = [
  { id: 'TK-01', phase: 'Legal', title: 'DIFC free zone entity incorporation', status: 'in-progress', target: 'Q3 2026', owner: 'Dubai Legal Counsel (TBD)', cost: '$5,000 one-time', notes: 'DIFC Company or Single Family Office registration. Enables token issuance under DFSA framework.', blockedBy: 'Legal counsel not yet engaged' },
  { id: 'TK-02', phase: 'Legal', title: 'DFSA token issuance framework review', status: 'planned',     target: 'Q3 2026', owner: 'Dubai Legal Counsel (TBD)', cost: 'Included in retainer', notes: 'Determine exact DFSA framework for HoldCo token — investment token vs utility token classification.' },
  { id: 'TK-03', phase: 'Economics', title: 'Token economics model finalised', status: 'in-progress', target: 'Q3 2026', owner: 'Shawaz', cost: '—', notes: 'Revenue per token, distribution schedule, lock-up terms, tranche structure. Financial model base exists in HQ.' },
  { id: 'TK-04', phase: 'Engineering', title: 'Smart contract development', status: 'planned',      target: 'Q4 2026', owner: 'Smart contract dev (TBD)', cost: '$10–20K', notes: 'ERC-20 or custom revenue-share contract on Ethereum. Requires clear legal structure first.' },
  { id: 'TK-05', phase: 'Engineering', title: 'Smart contract security audit', status: 'planned',   target: 'Q4 2026', owner: 'Audit firm (TBD)', cost: '$20–50K', notes: 'Non-negotiable before any token issuance. Budget: $20–50K. Shortlist: OpenZeppelin, Trail of Bits, Halborn.', blockedBy: 'Smart contract development' },
  { id: 'TK-06', phase: 'Operations', title: 'HoldCo bank account opened (Dubai)', status: 'planned', target: 'Q3 2026', owner: 'Shawaz', cost: '—', notes: 'Emirates NBD or Mashreq. Requires HoldCo incorporation. AED + USD accounts.' },
  { id: 'TK-07', phase: 'Operations', title: 'Multisig treasury wallet deployed', status: 'planned', target: 'Q4 2026', owner: 'Shawaz', cost: '—', notes: '2-of-3 multisig on Ethereum. Receives token sale proceeds, distributes to project entities quarterly.' },
  { id: 'TK-08', phase: 'Distribution', title: 'Investor distribution contract built', status: 'planned', target: 'Q4 2026', owner: 'Smart contract dev (TBD)', cost: 'Included', notes: 'On-chain quarterly revenue distribution to token holders. Automated from treasury wallet.' },
  { id: 'TK-09', phase: 'Launch', title: 'Seed investor close — first token issued', status: 'planned', target: 'Q4 2026', owner: 'Shawaz', cost: '—', notes: 'Target: 3–5 strategic seed investors. First tranche: ₹5–8 Cr. Remaining raised as facility milestones hit.' },
];

// ─── PITCH DECKS ──────────────────────────────────────────────────────────────

export type DeckStatus = 'final' | 'draft' | 'review';
export type OutreachStatus = 'not-sent' | 'sent' | 'opened' | 'nda-signed' | 'meeting-booked' | 'declined' | 'interested';

export interface DeckOutreach {
  recipient:    string;
  date:         string;
  status:       OutreachStatus;
  notes:        string;
}

export interface Deck {
  id:       string;
  name:     string;
  venture:  string;
  color:    string;
  version:  string;
  status:   DeckStatus;
  slides:   number;
  updated:  string;
  location: string;
  purpose:  string;
  outreach: DeckOutreach[];
}

export const DECKS: Deck[] = [
  {
    id: 'D1', name: 'Roborns Investor Deck', venture: 'Roborns', color: '#5DCAA5',
    version: 'v1.2', status: 'final', slides: 18, updated: '2026-05-18',
    location: 'Google Drive / Decks / Roborns',
    purpose: 'Seed round investor deck — problem, solution, technology, market, financials, team, ask. 18 slides.',
    outreach: [
      { recipient: 'Internal review only', date: '2026-05-18', status: 'opened', notes: 'Not yet sent externally. Awaiting site survey completion.' },
    ],
  },
  {
    id: 'D2', name: 'Codelude Studio Overview', venture: 'Codelude', color: '#c8f53a',
    version: 'v1.0', status: 'final', slides: 12, updated: '2026-05-20',
    location: 'Google Drive / Decks / Codelude',
    purpose: 'Studio-level overview — all 5 ventures, HoldCo structure, token thesis. For strategic and studio-level investors.',
    outreach: [
      { recipient: 'Internal only', date: '2026-05-20', status: 'opened', notes: 'Available on codelude.com. External distribution pending NDA process.' },
    ],
  },
  {
    id: 'D3', name: 'Franchiseen Pitch Deck', venture: 'Franchiseen', color: '#7F77DD',
    version: 'v0.9', status: 'review', slides: 14, updated: '2026-05-12',
    location: 'Google Drive / Decks / Franchiseen',
    purpose: 'For franchise brand partners and seed investors. Pending legal review of investor claims before external distribution.',
    outreach: [],
  },
  {
    id: 'D4', name: 'Dextrip Creator Deck', venture: 'Dextrip', color: '#F0997B',
    version: 'v1.0', status: 'final', slides: 8, updated: '2026-05-08',
    location: 'Google Drive / Decks / Dextrip',
    purpose: 'For strategy creators — marketplace model, 30% rev-share, onboarding process.',
    outreach: [
      { recipient: 'Beta User #2 (trader)', date: '2026-05-20', status: 'interested', notes: 'Interested in becoming a strategy creator. Follow-up scheduled.' },
    ],
  },
];

export const OUTREACH_STYLES: Record<OutreachStatus, { color: string; label: string }> = {
  'not-sent':      { color: '#7a7870', label: 'Not sent'     },
  'sent':          { color: '#85B7EB', label: 'Sent'         },
  'opened':        { color: '#FAC775', label: 'Opened'       },
  'nda-signed':    { color: '#c8f53a', label: 'NDA signed'   },
  'meeting-booked':{ color: '#7F77DD', label: 'Meeting'      },
  'declined':      { color: '#ff8080', label: 'Declined'     },
  'interested':    { color: '#5DCAA5', label: 'Interested'   },
};
