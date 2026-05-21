// ─── POSITIONS ────────────────────────────────────────────────────────────────

export type PositionStatus = 'open' | 'hiring' | 'filled' | 'on-hold';
export type PositionType   = 'Full-time' | 'Contract' | 'Part-time' | 'Advisory';

export interface Position {
  id:          string;
  title:       string;
  department:  string;
  venture:     string;
  type:        PositionType;
  status:      PositionStatus;
  priority:    'critical' | 'high' | 'medium';
  targetStart: string;
  location:    string;
  keySkills:   string[];
  notes:       string;
}

export const POSITIONS: Position[] = [
  { id: 'P01', title: 'Thermal / Coastal Engineer', department: 'Roborns Engineering', venture: 'Roborns', type: 'Contract', status: 'hiring', priority: 'critical', targetStart: 'Q3 2026', location: 'Mangaluru / Remote', keySkills: ['Heat exchange systems', 'Coastal industrial construction', 'Desalination', 'Marine engineering', 'MED / MSF systems'], notes: 'First hire. Validates the entire Roborns technical model. Must have coastal heat exchange experience.' },
  { id: 'P02', title: 'Investment Platform Legal Counsel', department: 'Legal & Compliance', venture: 'Franchiseen', type: 'Contract', status: 'hiring', priority: 'critical', targetStart: 'Q3 2026', location: 'Remote / Delhi / Mumbai', keySkills: ['SEBI regulations', 'Investment platform compliance', 'Revenue-sharing structures', 'KYC/AML frameworks', 'Investor agreement drafting'], notes: 'External counsel for Franchiseen regulatory pathway. SEBI-familiar mandatory.' },
  { id: 'P03', title: 'Dubai HoldCo Legal Counsel', department: 'Legal & Compliance', venture: 'Codelude', type: 'Contract', status: 'hiring', priority: 'critical', targetStart: 'Q3 2026', location: 'Dubai (DIFC)', keySkills: ['DIFC / ADGM incorporation', 'Token structure and digital assets', 'UAE company law', 'Investment vehicle structuring', 'Smart contract legal review'], notes: 'DIFC-registered firm for HoldCo incorporation and token structure. Critical path for seed round.' },
  { id: 'P04', title: 'Full-Stack Engineer', department: 'Engineering', venture: 'Codelude', type: 'Full-time', status: 'open', priority: 'high', targetStart: 'Q4 2026', location: 'Mangaluru / Remote', keySkills: ['Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'React'], notes: 'First full-time engineering hire. Will own HubCV and Franchiseen platform development.' },
  { id: 'P05', title: 'AI / ML Engineer', department: 'Engineering', venture: 'HubCV', type: 'Full-time', status: 'open', priority: 'high', targetStart: 'Q4 2026', location: 'Remote', keySkills: ['Python', 'LLM integration', 'Matching algorithms', 'Vector databases', 'NLP'], notes: 'Owns HubCV matching engine. LLM prompt engineering and skill graph development.' },
  { id: 'P06', title: 'Franchise Partnership Manager', department: 'Franchiseen Product', venture: 'Franchiseen', type: 'Full-time', status: 'open', priority: 'high', targetStart: 'Q4 2026', location: 'Mangaluru / Travel', keySkills: ['B2B sales', 'Franchise industry knowledge', 'Relationship management', 'Contract negotiation', 'Hindi/Kannada preferred'], notes: 'Owns franchise brand acquisition. Needs to sign 5+ brands in first 6 months.' },
  { id: 'P07', title: 'Hardware Product Manager', department: 'Engineering', venture: 'Cuestay', type: 'Full-time', status: 'on-hold', priority: 'medium', targetStart: 'Q1 2027', location: 'Remote / Mangaluru', keySkills: ['IoT hardware', 'Matter protocol', 'ODM/OEM management', 'Product specification', 'Supply chain'], notes: 'Owns Cuestay hub hardware. On hold until hardware manufacturing partner is signed.' },
  { id: 'P08', title: 'Marketing & Content Lead', department: 'Marketing & Brand', venture: 'Codelude', type: 'Full-time', status: 'open', priority: 'medium', targetStart: 'Q1 2027', location: 'Remote', keySkills: ['Content strategy', 'B2B marketing', 'SEO', 'Social media', 'Copywriting'], notes: 'Owns Codelude brand voice and all venture content. Investor-facing communications included.' },
  { id: 'P09', title: 'Deep-Tech Advisor — Infrastructure', department: 'Strategy & Finance', venture: 'Roborns', type: 'Advisory', status: 'open', priority: 'medium', targetStart: 'Q3 2026', location: 'Remote / Dubai', keySkills: ['Data center operations', 'Coastal infrastructure', 'Energy markets', 'Investor credibility', 'SE Asia / Gulf networks'], notes: 'Advisory role — adds credibility to Roborns for investor conversations. Equity or token compensation.' },
];

// ─── APPLICATIONS ─────────────────────────────────────────────────────────────

export type AppStatus = 'new' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';

export interface Application {
  id:        string;
  name:      string;
  position:  string;
  source:    string;
  date:      string;
  status:    AppStatus;
  notes:     string;
}

export const APPLICATIONS: Application[] = [];

// ─── TRAINING ─────────────────────────────────────────────────────────────────

export interface TrainingItem {
  title:     string;
  category:  string;
  assignee:  string;
  status:    'completed' | 'in-progress' | 'planned';
  resource:  string;
  notes:     string;
}

export const TRAINING: TrainingItem[] = [
  { title: 'Dubai HoldCo structure deep-dive', category: 'Legal', assignee: 'Shawaz', status: 'in-progress', resource: 'DIFC legal counsel sessions', notes: 'Understanding free zone vs mainland, token issuance rules, DFSA requirements.' },
  { title: 'Desalination technology fundamentals', category: 'Engineering', assignee: 'Shawaz', status: 'in-progress', resource: 'MED/MSF technical papers, GEA Group documentation', notes: 'Multi-effect distillation system design principles for Roborns thermal model.' },
  { title: 'SEBI investment platform regulations', category: 'Legal', assignee: 'Shawaz', status: 'planned', resource: 'SEBI circular repository + legal counsel briefing', notes: 'Required before Franchiseen investor onboarding begins.' },
  { title: 'Matter protocol specification (v1.3)', category: 'Engineering', assignee: 'Shawaz', status: 'completed', resource: 'CSA Matter specification docs + GitHub', notes: 'Completed as part of Cuestay protocol spec. Foundation for hardware design.' },
  { title: 'Next.js App Router — advanced patterns', category: 'Engineering', assignee: 'Shawaz', status: 'completed', resource: 'Next.js 16 docs / in-practice (hq.codelude.com build)', notes: 'Server components, iron-session auth, route protection, dynamic rendering.' },
  { title: 'Chart.js v4 — React integration', category: 'Engineering', assignee: 'Shawaz', status: 'completed', resource: 'chart.js docs + useEffect pattern', notes: 'Used for Roborns financial model P&L chart in HQ dashboard.' },
  { title: 'Franchise industry landscape', category: 'Business', assignee: 'Shawaz', status: 'planned', resource: 'Franchise India / IFA resources / competitor research', notes: 'Needed before first franchise partner pitch. Understand industry terminology and norms.' },
  { title: 'DeFi protocol mechanics (GMX, dYdX)', category: 'Engineering', assignee: 'Shawaz', status: 'planned', resource: 'Protocol documentation + testnet usage', notes: 'Required for Dextrip DeFi integration phase.' },
];

// ─── ONBOARDING ───────────────────────────────────────────────────────────────

export interface OnboardingStep {
  day:      string;
  title:    string;
  category: string;
  items:    string[];
}

export const ONBOARDING_TEMPLATE: OnboardingStep[] = [
  { day: 'Day 1', title: 'Access & setup', category: 'Admin', items: ['Create Codelude email account (X@codelude.com)', 'Add to Google Workspace', 'GitHub organisation invite', 'HQ (hq.codelude.com) account created', 'WhatsApp group added', 'Password manager set up (1Password / Bitwarden)', '2FA enabled on all accounts'] },
  { day: 'Day 1–2', title: 'Context & orientation', category: 'Culture', items: ['Read the Codelude Handbook (hq.codelude.com/dashboard/handbook)', 'Review all five venture pages on codelude.com', 'Read through Plan and Strategy modules in HQ for your venture(s)', 'Meet founder 1:1 — 30 min overview call', 'Review current task list in HQ → Tasks'] },
  { day: 'Day 3–5', title: 'First contribution', category: 'Work', items: ['Identify first meaningful task from HQ → Tasks (venture-specific)', 'Set up local development environment (if engineering)', 'Review codebase for your venture (GitHub)', 'Submit first PR or document within 5 days of joining'] },
  { day: 'Week 2', title: 'Integration', category: 'Work', items: ['Attend first weekly check-in', 'Update at least one task to "in-progress" or "done"', 'Log first activity entry in HQ → Activity', 'Complete any role-specific training items in HQ → People → Training'] },
  { day: 'Day 30', title: '30-day review', category: 'Culture', items: ['1:1 with founder — what\'s working, what\'s not', 'Review OKRs for next 30 days', 'Confirm permanent tool access and revoke any temporary access', 'Share honest feedback on onboarding process'] },
];
