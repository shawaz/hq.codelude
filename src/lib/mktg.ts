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
  { venture: 'Roborns', color: '#5DCAA5', tam: '$115B', sam: '$8B (coastal + ESG compute)', som: '$50M (Phase 1–2 target)', cagr: '32% AI infra CAGR', keyTrend: 'Hyperscalers moving to coastal and offshore compute to solve cooling. ESG mandates forcing sustainable DC design.', insight: 'India has 7,500km of coastline and growing AI demand with no sustainable coastal compute infrastructure. First-mover advantage is real.' },
  { venture: 'Franchiseen', color: '#7F77DD', tam: '$3T (global franchise revenue)', sam: '$180B (India + SE Asia franchise market)', som: '$500M (fractional franchise AUM target 5yr)', cagr: '12% franchise market CAGR', keyTrend: 'Retail investors seeking yield alternatives beyond stock market. Franchise businesses have predictable cash flows ideal for yield products.', insight: 'No platform currently offers daily payout franchise investment in India. The gap between franchise capital demand and retail investor appetite is enormous.' },
  { venture: 'HubCV', color: '#FAC775', tam: '$760B (global recruiting)', sam: '$28B (online career platforms)', som: '$50M (verified professional tier)', cagr: '15% HR tech CAGR', keyTrend: 'AI-generated resumes flooding recruiter inboxes — verification is the new differentiator. Skills-based hiring growing at 50% YoY.', insight: 'LinkedIn solved discovery but not verification. Every recruiter knows the problem — they just accept it. HubCV\'s moat is in the verification infrastructure.' },
  { venture: 'Cuestay', color: '#85B7EB', tam: '$174B (smart home market)', sam: '$12B (AI home assistants)', som: '$30M (India + Dubai 5yr)', cagr: '25% smart home CAGR', keyTrend: 'Matter protocol standardisation enabling cross-ecosystem products. AI moving from voice commands to ambient intelligence.', insight: 'Every major tech company has tried smart home — none has solved the learning + proactive action layer. Cuestay occupies the intelligence gap above the hardware.' },
  { venture: 'Dextrip', color: '#F0997B', tam: '$18B (algorithmic trading software)', sam: '$4B (retail algo + DeFi tools)', som: '$20M (subscription + API 5yr)', cagr: '22% DeFi tooling CAGR', keyTrend: 'Non-custodial trading gaining trust as exchange hacks continue. Strategy marketplaces creating network effects around trading tools.', insight: 'Most retail traders want automation but don\'t code. Dextrip removes that barrier without taking custody — the trust model that others can\'t match.' },
];

// ─── COMPETITION ─────────────────────────────────────────────────────────────

export interface Competitor {
  name:        string;
  venture:     string;
  type:        'Direct' | 'Indirect' | 'Adjacent';
  strength:    string;
  weakness:    string;
  ourEdge:     string;
}

export const COMPETITORS: Competitor[] = [
  { name: 'Conventional Data Centers', venture: 'Roborns', type: 'Direct', strength: 'Established, trusted, scale', weakness: 'No sustainability angle, 40% power for cooling, inland location', ourEdge: 'PUE <1.03 vs industry 1.4+. Cooling is free. Water and minerals are revenue, not waste.' },
  { name: 'GreenDC / Submer (immersion DC)', venture: 'Roborns', type: 'Direct', strength: 'Immersion cooling expertise', weakness: 'No desalination or mineral extraction integration', ourEdge: 'Triple revenue loop. Physical asset in coastal India — not just a DC product.' },
  { name: 'Tyke / LetsVenture (crowdfunding)', venture: 'Franchiseen', type: 'Indirect', strength: 'Brand recognition, existing user base', weakness: 'Equity-focused, no franchise-specific model, no daily payouts', ourEdge: 'Franchise-specific OS. Daily payouts. Operators get capital, not equity dilution.' },
  { name: 'FranConnect / Franchise management software', venture: 'Franchiseen', type: 'Adjacent', strength: 'Franchise operations tooling', weakness: 'Not an investment platform — no investor side', ourEdge: 'We are the investor-side OS. Not competing — potentially complementary.' },
  { name: 'LinkedIn', venture: 'HubCV', type: 'Direct', strength: 'Scale, network effects, brand', weakness: 'Self-reported skills, static profiles, no verification', ourEdge: 'Human + AI verification. Dynamic updates. Skills are validated, not claimed.' },
  { name: 'Karat / CoderPad (technical assessment)', venture: 'HubCV', type: 'Adjacent', strength: 'Technical assessment quality', weakness: 'Point-in-time, not profile-based, narrow (engineering only)', ourEdge: 'Continuous profile, multi-discipline, career intelligence — not just assessment.' },
  { name: 'Google Home / Apple HomeKit / Amazon Alexa', venture: 'Cuestay', type: 'Direct', strength: 'Ecosystem, device compatibility, brand', weakness: 'Platform-locked, reactive not proactive, no cross-platform learning', ourEdge: 'Matter-native (works with all three). Learns routines — proactive not reactive. One intelligence layer across all ecosystems.' },
  { name: '3Commas / Pionex (crypto bots)', venture: 'Dextrip', type: 'Direct', strength: 'Established user base, simple UX', weakness: 'Custodial (holds user funds), limited strategy composability, CEX-only', ourEdge: 'Non-custodial — we never hold funds. Strategy marketplace with creator ecosystem. DeFi-native from day one.' },
  { name: 'dYdX / GMX (DeFi trading)', venture: 'Dextrip', type: 'Adjacent', strength: 'Liquidity, protocol-native', weakness: 'Not automation tools — protocols, not strategy engines', ourEdge: 'We sit on top of DeFi protocols as the strategy/automation layer. Complementary, not competing.' },
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
  { name: 'codelude.com launch', venture: 'Codelude', type: 'PR', status: 'completed', channel: 'Website + LinkedIn', start: '2026-05-20', end: '2026-05-20', goal: 'Establish public presence for studio and all four ventures', notes: 'Site launched. No formal PR push yet — organic only.' },
  { name: 'Roborns investor deck outreach', venture: 'Roborns', type: 'Email', status: 'planned', channel: 'Direct email', start: '2026-07-01', end: '2026-08-31', goal: 'Book 10 investor intro calls, convert 3 to term sheet conversations', notes: 'Launch after site survey and feasibility readout. Personal outreach only — no cold email blasts.' },
  { name: 'Dextrip public beta launch campaign', venture: 'Dextrip', type: 'Community', status: 'planned', channel: 'Twitter / X + Discord', start: '2026-07-10', end: '2026-07-31', goal: '200 beta sign-ups in first 30 days, 10 active strategy creators', notes: 'Creator-led launch. Each creator brings their audience. No paid acquisition until organic validated.' },
  { name: 'Franchiseen first payout proof story', venture: 'Franchiseen', type: 'PR', status: 'planned', channel: 'Franchise India + LinkedIn', start: '2026-08-01', end: '2026-08-15', goal: 'Publish first payout proof case study — generate 50 investor waitlist sign-ups', notes: 'Most powerful marketing asset will be the first successful payout. Document it as a press story.' },
  { name: 'HubCV recruiter content series', venture: 'HubCV', type: 'Content', status: 'planned', channel: 'LinkedIn', start: '2026-07-01', end: '2026-09-30', goal: '5 long-form posts targeting recruiters, 500 followers on HubCV LinkedIn', notes: '"The verified talent problem" — content series positioning HubCV as the solution to AI resume noise.' },
  { name: 'Cuestay pilot waitlist campaign', venture: 'Cuestay', type: 'Social', status: 'planned', channel: 'Instagram + LinkedIn', start: '2026-10-01', end: '2026-12-31', goal: '200 pre-order waitlist sign-ups before hardware MOQ commitment', notes: 'Pilot testimonial video content. Real homes, real results from the 10-home pilot.' },
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
  { title: 'Why coastal AI compute changes everything', venture: 'Roborns', type: 'Article', channel: 'LinkedIn / Medium', status: 'planned', dueDate: '2026-06-15', notes: 'Thought leadership piece — PUE math, coastal advantage, sustainability case. Target: investors and engineers.' },
  { title: 'Roborns site survey photo story', venture: 'Roborns', type: 'Social Post', channel: 'LinkedIn', status: 'planned', dueDate: '2026-06-05', notes: 'Behind the scenes — site visit to Mangaluru. Humanises the venture, shows real progress.' },
  { title: 'Why franchise investment is broken (and how we\'re fixing it)', venture: 'Franchiseen', type: 'Article', channel: 'LinkedIn / Franchise India', status: 'planned', dueDate: '2026-07-15', notes: 'Explains the capital access problem and Franchiseen solution. Lead gen for franchise partners and investors.' },
  { title: 'Franchiseen first payout — case study', venture: 'Franchiseen', type: 'Case Study', channel: 'Website + PR', status: 'planned', dueDate: '2026-08-05', notes: 'Document the first payout cycle end-to-end. Investor names redacted. Numbers real.' },
  { title: 'The verified talent problem — a recruiter\'s guide', venture: 'HubCV', type: 'Article', channel: 'LinkedIn', status: 'planned', dueDate: '2026-07-01', notes: 'Opens the recruiter pain. AI-generated resumes, screening time, mis-hires. Sets up HubCV.' },
  { title: 'Dextrip public beta — announcement post', venture: 'Dextrip', type: 'Social Post', channel: 'Twitter + LinkedIn', status: 'planned', dueDate: '2026-07-10', notes: 'Beta launch announcement with strategy marketplace. Tag creator partners. Include waitlist link.' },
  { title: 'Building the smart home that actually learns', venture: 'Cuestay', type: 'Article', channel: 'LinkedIn / Medium', status: 'idea', dueDate: '2026-10-01', notes: 'Product vision piece for Cuestay. Why Matter + AI is the combination nobody has built yet.' },
  { title: 'Codelude studio — why we build five at once', venture: 'Codelude', type: 'Article', channel: 'LinkedIn / Substack', status: 'planned', dueDate: '2026-06-01', notes: 'Founder essay. Studio model rationale, HoldCo structure, compounding between ventures.' },
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
    { name: 'Accent',      value: '#c8f53a', usage: 'Active states, highlights, CTAs, section labels' },
    { name: 'Accent Dark', value: '#9bbf1e', usage: 'Hover state for accent elements' },
    { name: 'Card BG',     value: '#111110', usage: 'Card and panel backgrounds' },
    { name: 'Card Border', value: '#252522', usage: 'All borders, dividers, table lines' },
  ],
  ventureColors: [
    { venture: 'Roborns',     color: '#5DCAA5', type: 'Green — coastal, natural, sustainable' },
    { venture: 'Franchiseen', color: '#7F77DD', type: 'Purple — finance, ownership, wealth' },
    { venture: 'HubCV',       color: '#FAC775', type: 'Amber — human, intelligence, growth' },
    { venture: 'Cuestay',     color: '#85B7EB', type: 'Blue — home, calm, smart' },
    { venture: 'Dextrip',     color: '#F0997B', type: 'Orange — trading, momentum, energy' },
  ],
  voice: [
    { principle: 'Direct, not blunt', description: 'We say what we mean. No hedging, no corporate filler. But we are not harsh — directness is confidence, not aggression.' },
    { principle: 'Technical, not jargon-heavy', description: 'We can explain a thermal loop or a SAFE note clearly. We never use complexity to obscure — we use precision to clarify.' },
    { principle: 'Ambitious, not hyperbolic', description: 'We make specific, verifiable claims. "81% gross margin per MW" beats "revolutionary clean tech". Numbers over superlatives.' },
    { principle: 'Human, not corporate', description: 'We have a founder. We have a perspective. We write like a person who means what they say — not like a press release.' },
  ],
};
