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
  { venture: 'HubCV', color: '#FAC775', tam: '$10.4B (India ed-tech by 2027)', sam: '$1.8B (assessment + career guidance)', som: '$19M (Karnataka + 3 states, 5yr GMV)', cagr: '16% India ed-tech CAGR', keyTrend: 'Skills-based admission and hiring is arriving in India faster than the transcript can adapt, and NEP 2020 explicitly pushes competency records over marks. Faculty are already generating the evidence and discarding it.', insight: 'Everyone sells content to students. Nobody monetises the assessment faculty already run. Capturing the grade book is what makes the skill graph proprietary — and the faculty who runs it brings the whole class at zero CAC.' },
  { venture: 'Dextrip', color: '#F0997B', tam: '$18B (algorithmic trading software)', sam: '$4B (retail algo + DeFi tools)', som: '$20M (subscription + API 5yr)', cagr: '22% DeFi tooling CAGR', keyTrend: 'Non-custodial trading gaining trust as exchange hacks continue. Strategy marketplaces creating network effects around trading tools.', insight: 'Most retail traders want automation but don\'t code. Dextrip removes that barrier without taking custody — the trust model that others can\'t match.' },
  { venture: 'Llife', color: '#85B7EB', tam: '$15B (personal AI assistants)', sam: '$1.5B (India personal finance + productivity)', som: '$25M (India + Gulf 5yr)', cagr: '22% personal AI CAGR', keyTrend: 'Account Aggregator rails making consented financial data available in India, and LLMs cheap enough to review a user\u2019s day individually.', insight: 'Every life tracker dies on the empty state \u2014 users abandon apps they must fill in by hand. Llife starts populated because HubCV, Dextrip and Franchiseen already hold the data.' },
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
  { name: 'Physics Wallah / Unacademy', venture: 'HubCV', type: 'Direct', strength: 'Enormous student reach, brand recognition, low price points', weakness: 'Content delivery only — no assessment record, no verified skill graph, no guidance tied to real coursework', ourEdge: 'We do not sell content. Faculty run their own assessment on our rails and the skill record is the product.' },
  { name: 'School / college LMS (Moodle, Google Classroom)', venture: 'HubCV', type: 'Direct', strength: 'Already installed, free or institution-funded, familiar to faculty', weakness: 'Grade books, not skill graphs. Tags nothing, guides nobody, and the record dies at end of term.', ourEdge: 'Same faculty workflow, but every test and task is skill-tagged and compounds into a portable student profile.' },
  { name: 'Career guidance counsellors', venture: 'HubCV', type: 'Indirect', strength: 'Trusted, personal, established with parents', weakness: 'Expensive per student, generic advice, no evidence base beyond a marksheet and an aptitude test', ourEdge: 'Guidance grounded in two years of graded, skill-tagged coursework — and it costs ₹150 a subject, not ₹5,000 a session.' },
  { name: 'LinkedIn', venture: 'HubCV', type: 'Adjacent', strength: 'Scale, network effects, the default professional graph', weakness: 'Starts at first job. Self-reported, and structurally absent from school and college years.', ourEdge: 'We own the student years LinkedIn never sees. By the time a graduate would join LinkedIn, they already have a verified record with us.' },
  { name: 'Notion / Mint / Cred / habit trackers',      venture: 'Llife', type: 'Direct', strength: 'Established users, polished apps, strong brands', weakness: 'Single-domain and manually filled \u2014 finance OR habits OR study, never one view', ourEdge: 'Five domains in one board, pre-populated from the Codelude ecosystem so the user never starts from an empty page.' },
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
  { name: 'Free career guidance counselling — Karnataka Phase 1', venture: 'HubCV', type: 'Community', status: 'planned', channel: 'In-person camps — schools and colleges', start: '2026-09-01', end: '2027-03-31', goal: '40 camps, 100 hubs claimed and KYB-approved, 12,000 seats licensed', notes: 'The door-opener, not the close. India does not adopt a platform from a landing page — a camp puts a real guidance report in every student hand and shows the principal their own outcomes data, so the seat conversation starts from evidence. The buyer is the principal, correspondent or trust, because the hub claim needs KYB and company approval. Dakshina Kannada, Udupi and Bengaluru first — densest directory data. Budget $25K field ops + $15K onboarding playbook.' },
  { name: 'School chains and boards', venture: 'HubCV', type: 'PR', status: 'planned', channel: 'Direct — trusts, chain HQs, board bodies', start: '2027-01-01', end: '2029-03-31', goal: '2 national chain agreements, 3 state board pilots', notes: 'The only channel with real leverage. Kendriya Vidyalaya is ~1,250 schools under one administration; Narayana and Sri Chaitanya run ~1,000 institutions between them; CBSE affiliates number ~30K. One agreement covers hundreds of hubs and substitutes for a thousand individual sales. Currently unstaffed — this is the biggest gap in the plan.' },
  { name: 'Counselling programme — national rollout', venture: 'HubCV', type: 'Community', status: 'planned', channel: 'In-person camps + regional language walkthroughs', start: '2027-04-01', end: '2029-03-31', goal: '8 states, 2,200 active hubs', notes: 'Phase 2 onward. Camps seed each new state and prove the format; chains and boards carry the scale. Targets the ~300K private and aided schools with secondary sections — the 1.7M directory is the prospecting map, not the target list. Needs Kannada, Hindi, Tamil, Telugu, Marathi and Malayalam walkthrough material before leaving the south.' },
  { name: 'codelude.com launch', venture: 'Codelude', type: 'PR', status: 'completed', channel: 'Website + LinkedIn', start: '2026-05-20', end: '2026-05-20', goal: 'Establish public presence for studio and all four ventures', notes: 'Site launched. No formal PR push yet — organic only.' },
  { name: 'Roborns investor deck outreach', venture: 'Roborns', type: 'Email', status: 'planned', channel: 'Direct email', start: '2026-07-01', end: '2026-08-31', goal: 'Book 10 investor intro calls, convert 3 to term sheet conversations', notes: 'Launch after site survey and feasibility readout. Personal outreach only — no cold email blasts.' },
  { name: 'Dextrip public beta launch campaign', venture: 'Dextrip', type: 'Community', status: 'planned', channel: 'Twitter / X + Discord', start: '2026-07-10', end: '2026-07-31', goal: '200 beta sign-ups in first 30 days, 10 active strategy creators', notes: 'Creator-led launch. Each creator brings their audience. No paid acquisition until organic validated.' },
  { name: 'Franchiseen first payout proof story', venture: 'Franchiseen', type: 'PR', status: 'planned', channel: 'Franchise India + LinkedIn', start: '2026-08-01', end: '2026-08-15', goal: 'Publish first payout proof case study — generate 50 investor waitlist sign-ups', notes: 'Most powerful marketing asset will be the first successful payout. Document it as a press story.' },
  { name: 'Faculty adoption programme', venture: 'HubCV', type: 'Content', status: 'planned', channel: 'WhatsApp + in-hub training + school networks', start: '2026-09-01', end: '2026-12-31', goal: '300 active faculty across the first 100 hubs, 5 assessments logged per faculty per term', notes: 'Runs after a hub signs, not before — faculty are the adopter, not the buyer. Seats only renew if teachers actually run the Assessment Program, which makes active-faculty-per-hub the leading indicator of Y2 revenue. Message is effort saved: the tests and attendance they already record become the skill graph. Distribution is in-hub training plus teacher WhatsApp groups.' },
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
  { title: 'Why coastal AI compute changes everything', venture: 'Roborns', type: 'Article', channel: 'LinkedIn / Medium', status: 'planned', dueDate: '2026-06-15', notes: 'Thought leadership piece — PUE math, coastal advantage, sustainability case. Target: investors and engineers.' },
  { title: 'Roborns site survey photo story', venture: 'Roborns', type: 'Social Post', channel: 'LinkedIn', status: 'planned', dueDate: '2026-06-05', notes: 'Behind the scenes — site visit to Mangaluru. Humanises the venture, shows real progress.' },
  { title: 'Why franchise investment is broken (and how we\'re fixing it)', venture: 'Franchiseen', type: 'Article', channel: 'LinkedIn / Franchise India', status: 'planned', dueDate: '2026-07-15', notes: 'Explains the capital access problem and Franchiseen solution. Lead gen for franchise partners and investors.' },
  { title: 'Franchiseen first payout — case study', venture: 'Franchiseen', type: 'Case Study', channel: 'Website + PR', status: 'planned', dueDate: '2026-08-05', notes: 'Document the first payout cycle end-to-end. Investor names redacted. Numbers real.' },
  { title: 'What your marksheet does not say about you', venture: 'HubCV', type: 'Article', channel: 'Blog + school networks', status: 'planned', dueDate: '2026-09-01', notes: 'Parent- and student-facing. Opens the gap between grades and demonstrable skill, then shows a real skill-tagged profile built from one term of coursework. Anchor content for the Mangaluru camps.' },
  { title: 'Dextrip public beta — announcement post', venture: 'Dextrip', type: 'Social Post', channel: 'Twitter + LinkedIn', status: 'planned', dueDate: '2026-07-10', notes: 'Beta launch announcement with strategy marketplace. Tag creator partners. Include waitlist link.' },
  { title: 'The life tracker that fills itself in',        venture: 'Llife', type: 'Article', channel: 'LinkedIn / Medium', status: 'idea', dueDate: '2026-10-01', notes: 'Product vision piece for Llife. Why the empty state is what kills trackers, and how ecosystem APIs solve it.' },
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
    { venture: 'Llife',     color: '#85B7EB', type: 'Blue — calm, personal, daily' },
    { venture: 'Dextrip',     color: '#F0997B', type: 'Orange — trading, momentum, energy' },
  ],
  voice: [
    { principle: 'Direct, not blunt', description: 'We say what we mean. No hedging, no corporate filler. But we are not harsh — directness is confidence, not aggression.' },
    { principle: 'Technical, not jargon-heavy', description: 'We can explain a thermal loop or a SAFE note clearly. We never use complexity to obscure — we use precision to clarify.' },
    { principle: 'Ambitious, not hyperbolic', description: 'We make specific, verifiable claims. "81% gross margin per MW" beats "revolutionary clean tech". Numbers over superlatives.' },
    { principle: 'Human, not corporate', description: 'We have a founder. We have a perspective. We write like a person who means what they say — not like a press release.' },
  ],
};
