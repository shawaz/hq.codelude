// Re-exported from the canonical registry so existing importers of this module
// (activity, partners, channel, relations, resources pages) keep working.
export { VENTURES } from './ventures';

// ─── PARTNERS ─────────────────────────────────────────────────────────────────
export type PartnerStatus = 'active' | 'negotiating' | 'prospecting' | 'on-hold';
export type PartnerType   = 'Technology' | 'Distribution' | 'Financial' | 'Strategic' | 'Government' | 'Manufacturing' | 'Legal';

export interface Partner {
  name: string; type: PartnerType; status: PartnerStatus;
  role: string; nextAction: string;
}

export const VENTURE_PARTNERS: Record<string, Partner[]> = {
  Llife: [
    { name: 'HubCV (internal API)',           type: 'Technology',   status: 'active',       role: 'Education domain — College, School, Certificates, Internship and Skills read from the HubCV profile graph', nextAction: 'Scope a read-only education endpoint and issue Llife a service key' },
    { name: 'Nanotrade (internal API)',         type: 'Technology',   status: 'active',       role: 'Earnings domain — Job, Crypto and Stocks positions with live P&L streamed from Nanotrade', nextAction: 'Agree the portfolio read schema, refresh interval and rate limits' },
    { name: 'Franchiseen (internal API)',     type: 'Technology',   status: 'active',       role: 'Earnings domain — franchise ownership stakes, payout schedule and AUM per investor', nextAction: 'Expose a per-investor holdings endpoint for Llife to consume' },
    { name: 'Account Aggregator (Sahamati)',  type: 'Financial',    status: 'prospecting',  role: 'RBI Account Aggregator consent rails — bank balances, credits and net worth for the Finances domain', nextAction: 'Shortlist an AA technology service provider and review consent-flow rules' },
    { name: 'Health Platform Partners (TBD)', type: 'Technology',   status: 'prospecting',  role: 'Body domain — Apple HealthKit and Google Health Connect sync for exercise, diet and sleep', nextAction: 'Scope read permissions and app-store privacy disclosures for health data' },
  ],
};

// ─── ACTIVITY ─────────────────────────────────────────────────────────────────
export interface VActivity {
  date: string; category: string; title: string; description: string;
}

export const VENTURE_ACTIVITIES: Record<string, VActivity[]> = {
  Llife: [
    { date: '2026-04-28', category: 'Milestone',   title: 'Five-domain model defined',                    description: 'Finances, Education, Earnings, Mind and Body fixed as the assistant\u2019s domains, each mapped to a daily time block.' },
    { date: '2026-03-28', category: 'Partnership', title: 'Internal API integrations scoped',             description: 'HubCV, Nanotrade and Franchiseen agreed as the first data sources feeding Education and Earnings.' },
    { date: '2026-02-10', category: 'Decision',    title: 'Property developer channel prioritised',       description: 'Decision: lead with property developer channel over DTC. Reduces CAC, provides volume anchor for first MOQ.' },
  ],
};

// ─── CHANNELS ─────────────────────────────────────────────────────────────────
export type ChStatus = 'active' | 'building' | 'planned';

export interface VChannel {
  name: string; type: string; status: ChStatus;
  description: string; metric: string;
}

export const VENTURE_CHANNELS: Record<string, VChannel[]> = {
  Llife: [
    { name: 'Property developer B2B',    type: 'Distribution',status: 'building', description: 'Direct B2B channel to Dubai and India developers for pre-installation in new builds', metric: 'Developer agreements signed' },
    { name: '10-home pilot programme',   type: 'Marketing', status: 'planned',   description: 'Real pilot homes in Mangaluru and Dubai — documented for testimonial content', metric: 'Pilot homes complete' },
    { name: 'Pre-order campaign',        type: 'Marketing', status: 'planned',   description: 'DTC pre-order with pilot testimonials — validates demand before production run', metric: 'Pre-orders collected (target: 200)' },
    { name: 'Instagram + YouTube',       type: 'Marketing', status: 'planned',   description: 'Short-form content on daily life tracking — net worth, streaks and routine reviews in action', metric: 'Views and waitlist sign-ups' },
    { name: 'llife.app',               type: 'Marketing', status: 'planned',   description: 'Product website with beta waitlist, the five-domain explainer, and daily-board demo', metric: 'Waitlist registrations' },
  ],
};

// ─── RELATIONS ────────────────────────────────────────────────────────────────
export type RHealth = 'strong' | 'developing' | 'cold' | 'target';

export interface VRelation {
  name: string; category: string; health: RHealth;
  description: string; lastContact: string; nextStep: string;
}

export const VENTURE_RELATIONS: Record<string, VRelation[]> = {
  Llife: [
    { name: 'Beta Users (HubCV base)',     category: 'Customer',    health: 'target',     description: 'HubCV students whose Education domain is populated from day one — the lowest-friction beta cohort', lastContact: 'Not yet', nextStep: 'Launch beta waitlist on llife.ai' },
    { name: 'HubCV Student Base',          category: 'Customer',    health: 'developing', description: 'Students already on HubCV are the warmest channel — Education domain works on day one', lastContact: 'Mar 2026', nextStep: 'Design the cross-sign-on flow from HubCV into Llife' },
    { name: 'Consumer AI Angels',          category: 'Investor',    health: 'target',     description: 'Consumer subscription and personal-finance angels for the pre-seed round', lastContact: 'Not yet', nextStep: 'Build investor list once retention data exists from private beta' },
    { name: 'Smart Home Media',            category: 'Media',       health: 'target',     description: 'The Verge, TechCrunch, Wired — pilot story coverage for DTC launch', lastContact: 'Not yet', nextStep: 'Prepare pilot documentation for press kit' },
  ],
};

// ─── RESOURCES ────────────────────────────────────────────────────────────────
export type ResType = 'Human' | 'Technology' | 'Legal' | 'Physical' | 'Financial';
export type ResStatus = 'active' | 'needed' | 'planned';
export type ResPriority = 'critical' | 'high' | 'medium' | 'low';

export interface Resource {
  name: string; type: ResType; status: ResStatus; priority: ResPriority;
  monthlyCost: number;    // USD/month (0 if one-time)
  oneTimeCost: number;    // USD one-time (0 if recurring)
  currency?: string;      // defaults USD
  notes: string;
}

export const VENTURE_RESOURCES: Record<string, Resource[]> = {
  Llife: [
    // Human
    { name: 'Product Engineer (Mobile)',    type: 'Human',      status: 'needed',  priority: 'critical', monthlyCost: 6000, oneTimeCost: 0,     notes: 'Owns the daily tracker UI \u2014 time-block board, streaks, offline-first sync' },
    { name: 'Integrations Engineer',        type: 'Human',      status: 'needed',  priority: 'critical', monthlyCost: 7000, oneTimeCost: 0,     notes: 'Builds and maintains the HubCV, Nanotrade, Franchiseen and Account Aggregator connectors' },
    { name: 'Mobile App Developer',         type: 'Human',      status: 'planned', priority: 'high',     monthlyCost: 5000, oneTimeCost: 0,     notes: 'iOS and Android Llife app. React Native preferred. Y2 hire.' },
    // Technology
    { name: 'LLM Inference Budget',         type: 'Technology', status: 'needed',  priority: 'critical', monthlyCost: 2000, oneTimeCost: 0,     notes: 'Per-user assistant reasoning \u2014 daily summaries, nudges and domain reviews' },
    { name: 'AA Consent Integration',      type: 'Technology', status: 'planned', priority: 'critical', monthlyCost: 0,    oneTimeCost: 15000, notes: 'Account Aggregator onboarding and audit before financial data can be read' },
    { name: 'AI Inference (Cloud)',         type: 'Technology', status: 'planned', priority: 'high',     monthlyCost: 200,  oneTimeCost: 0,     notes: 'Assistant reasoning for daily reviews and nudges. Scales with active users.' },
    { name: 'Design Tools (Figma/Fusion)', type: 'Technology', status: 'active',  priority: 'medium',   monthlyCost: 100,  oneTimeCost: 0,     notes: 'UI design and hardware CAD tooling' },
    // Physical
    { name: 'Security & Privacy Audit',     type: 'Technology', status: 'planned', priority: 'critical', monthlyCost: 0,    oneTimeCost: 30000, notes: 'Independent audit before handling financial and health data at scale' },
    { name: '10-Home Pilot Installations', type: 'Physical',   status: 'planned', priority: 'high',     monthlyCost: 0,    oneTimeCost: 50000, notes: '$5K per pilot home including device, installation, and 6-month monitoring' },
    // Legal
    { name: 'Product Liability Insurance', type: 'Legal',      status: 'planned', priority: 'medium',   monthlyCost: 300,  oneTimeCost: 0,     notes: 'Required before retail sale of consumer electronic device' },
  ],
};
