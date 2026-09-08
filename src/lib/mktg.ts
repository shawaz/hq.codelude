// ─── MARKET RESEARCH ─────────────────────────────────────────────────────────

export interface MarketData {
  venture:  string;
  color:    string;
  tam:      string;
  sam:      string;
  som:      string;
  cagr:     string;
  keyTrend: string;
  insight:  string;
}

export const MARKETS: MarketData[] = [
  { venture: 'Llife', color: '#a5a5a5', tam: '$15B (personal AI assistants)', sam: '$1.5B (India personal finance + productivity)', som: '$25M (India + Gulf 5yr)', cagr: '22% personal AI CAGR', keyTrend: 'Account Aggregator rails making consented financial data available in India, and LLMs cheap enough to review a user\u2019s day individually.', insight: 'Every life tracker dies on the empty state \u2014 users abandon apps they must fill in by hand. Llife starts populated because HubCV, Nanotrade and Franchiseen already hold the data.' },
];

// ─── COMPETITION ─────────────────────────────────────────────────────────────

export interface Competitor {
  name:        string;
  venture:     string;
  type:        'Direct' | 'Indirect' | 'Adjacent';
  strength:    string;
  weakness:    string;
  ourEdge:     string;
  /** Public site or announcement source, when there is one to cite. */
  url?:        string;
}

export const COMPETITORS: Competitor[] = [
  { name: 'Datasamudra (TeleIndia)', venture: 'Roborns', type: 'Direct', url: 'https://www.datasamudra.com/',
    strength: 'Announced ₹300–500 Cr for a 35–40 MW AI data centre at Baikampady, Mangaluru, over 3–4 years. Operating 5 MW IT facility already live at KIADB IT Park, Bengaluru — 500+ racks, dual substation feed, N+1 DG, N+N UPS, 5 MW solar in progress, carrier-neutral SDN network. Real operator with a running site, not a plan.',
    weakness: 'Bengaluru site cools on air-cooled chillers (N+1) at a design PUE of 1.5 — roughly a third of total draw spent on cooling overhead. Low water use, but they pay for it in energy. Baikampady is an inland industrial estate: no marine frontage, so no seawater heat sink and no intake. Liquid cooling is described as accommodated, not deployed.',
    ourEdge: 'Compete on PUE, not on water. Immersion plus a seawater heat sink should land far below 1.5 — at 20 MW IT load the gap between PUE 1.5 and ~1.1 is roughly 8 MW of continuous draw, on the order of ₹40 Cr/year in avoided electricity at ₹6/kWh. That is the business case. Freshwater output is the permitting and social-licence asset on top, not the revenue line. Benchmark also validates our capex: they are ₹8.5–14 Cr/MW, we model ₹7.5 Cr/MW.' },
  { name: 'Karnataka coastal AI hub / Baikampady park', venture: 'Roborns', type: 'Adjacent', url: 'https://www.deccanchronicle.com/southern-states/karnataka/karnataka-plans-ai-data-centre-cluster-in-dakshina-kannada-1940095',
    strength: 'State-backed: 350 acres earmarked at Baikampady, a planned 500 MW coastal AI hub, AI clusters in Dakshina Kannada, ₹60,000 Cr investment target, and a formally directed feasibility study for a Mangaluru cable landing station. Existing industrial land, power and permitting.',
    weakness: 'Policy stage, and an industrial estate cannot offer coastal frontage or a marine intake. State framing is seawater cooling without desalination — the thermal-loop-to-freshwater case is not yet in their plan.',
    ourEdge: 'Better treated as a programme to join than a rival to beat. New policy is drafting incentives for data centre cooling solution providers and for sites linked to cable landing stations — both describe us. Route is KDEM and Karnataka Udyog Mitra. Note Kapu sits in Udupi, one district north of the Dakshina Kannada cluster — confirm whether Udupi is in scope.' },
  { name: 'Notion / Mint / Cred / habit trackers',      venture: 'Llife', type: 'Direct', strength: 'Established users, polished apps, strong brands', weakness: 'Single-domain and manually filled \u2014 finance OR habits OR study, never one view', ourEdge: 'Five domains in one board, pre-populated from the LLIFE ecosystem so the user never starts from an empty page.' },
];

// ─── CAMPAIGNS ────────────────────────────────────────────────────────────────

export type CampaignStatus = 'live' | 'planned' | 'draft' | 'completed';
export type CampaignType   = 'Content' | 'Email' | 'Social' | 'PR' | 'Community' | 'Paid';

export interface Campaign {
  name:     string;
  venture:  string;
  type:     CampaignType;
  status:   CampaignStatus;
  channel:  string;
  start:    string;
  end:      string;
  goal:     string;
  notes:    string;
}

export const CAMPAIGNS: Campaign[] = [
  { name: 'llife.app launch', venture: 'LLIFE', type: 'PR', status: 'completed', channel: 'Website + LinkedIn', start: '2026-05-20', end: '2026-05-20', goal: 'Establish public presence for studio and all four ventures', notes: 'Site launched. No formal PR push yet — organic only.' },
  { name: 'Llife beta waitlist campaign', venture: 'Llife', type: 'Social', status: 'planned', channel: 'Instagram + LinkedIn', start: '2026-10-01', end: '2026-12-31', goal: '500 beta waitlist sign-ups before public launch', notes: 'Short-form content on daily reviews and net-worth roll-ups. Seed from the existing HubCV student base.' },
];

// ─── CONTENT ─────────────────────────────────────────────────────────────────

export type ContentStatus = 'published' | 'in-progress' | 'planned' | 'idea';
export type ContentType   = 'Article' | 'Social Post' | 'Video' | 'Case Study' | 'Press Release' | 'Newsletter';

export interface ContentItem {
  title:    string;
  venture:  string;
  type:     ContentType;
  channel:  string;
  status:   ContentStatus;
  dueDate:  string;
  notes:    string;
}

export const CONTENT: ContentItem[] = [
  { title: 'The life tracker that fills itself in',        venture: 'Llife', type: 'Article', channel: 'LinkedIn / Medium', status: 'idea', dueDate: '2026-10-01', notes: 'Product vision piece for Llife. Why the empty state is what kills trackers, and how ecosystem APIs solve it.' },
  { title: 'LLIFE studio — why we build five at once', venture: 'LLIFE', type: 'Article', channel: 'LinkedIn / Substack', status: 'planned', dueDate: '2026-06-01', notes: 'Founder essay. Studio model rationale, HoldCo structure, compounding between ventures.' },
];

// ─── BRAND ───────────────────────────────────────────────────────────────────

export interface BrandToken {
  name:     string;
  value:    string;
  usage:    string;
  preview?: string;
}

export const BRAND = {
  fonts: [
    { name: 'Outfit', weight: '400–800', role: 'Primary heading font', usage: 'All headings, navigation, UI labels, venture names', import: "family=Outfit:wght@400;600;700;800" },
    { name: 'DM Mono', weight: '300–400', role: 'Mono / body font', usage: 'All body copy, metadata, tags, numbers, table data, code', import: "family=DM+Mono:wght@300;400" },
  ],
  colors: [
    { name: 'Black',       value: '#0a0a08', usage: 'Background — primary surface' },
    { name: 'Off-white',   value: '#f5f3ee', usage: 'Primary text, headings' },
    { name: 'Muted',       value: '#7a7870', usage: 'Secondary text, labels, metadata' },
    { name: 'Accent',      value: '#eeeeee', usage: 'Active states, highlights, CTAs, section labels' },
    { name: 'Accent Dark', value: '#d6d6d6', usage: 'Hover state for accent elements' },
    { name: 'Card BG',     value: '#111110', usage: 'Card and panel backgrounds' },
    { name: 'Card Border', value: '#252522', usage: 'All borders, dividers, table lines' },
  ],
  ventureColors: [
    { venture: 'Roborns',     color: '#dbdbdb', type: 'Green — coastal, natural, sustainable' },
    { venture: 'Franchiseen', color: '#c8c8c8', type: 'Purple — finance, ownership, wealth' },
    { venture: 'HubCV',       color: '#b5b5b5', type: 'Amber — human, intelligence, growth' },
    { venture: 'Llife',     color: '#a5a5a5', type: 'Blue — calm, personal, daily' },
    { venture: 'Nanotrade',     color: '#adadad', type: 'Orange — trading, momentum, energy' },
  ],
  voice: [
    { principle: 'Direct, not blunt', description: 'We say what we mean. No hedging, no corporate filler. But we are not harsh — directness is confidence, not aggression.' },
    { principle: 'Technical, not jargon-heavy', description: 'We can explain a thermal loop or a SAFE note clearly. We never use complexity to obscure — we use precision to clarify.' },
    { principle: 'Ambitious, not hyperbolic', description: 'We make specific, verifiable claims. "81% gross margin per MW" beats "revolutionary clean tech". Numbers over superlatives.' },
    { principle: 'Human, not corporate', description: 'We have a founder. We have a perspective. We write like a person who means what they say — not like a press release.' },
  ],
};
