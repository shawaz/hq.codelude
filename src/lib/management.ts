// ─── STRATEGY ────────────────────────────────────────────────────────────────

export interface Initiative {
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium';
  status: 'active' | 'planned' | 'on-hold';
}

export interface StrategicRisk {
  risk: string;
  mitigation: string;
  severity: 'high' | 'medium' | 'low';
}

export interface VentureStrategy {
  name: string;
  color: string;
  positioning: string;
  competitiveAdvantages: string[];
  initiatives: Initiative[];
  risks: StrategicRisk[];
  threeYearVision: string;
}

export const STRATEGIES: VentureStrategy[] = [
  {
    name: 'Llife',
    color: '#a5a5a5',
    positioning: 'A life operating system, not another tracker. Llife wins because the data arrives already populated \u2014 Education from HubCV, Earnings from Nanotrade and Franchiseen \u2014 so the user never faces an empty board. The moat is the ecosystem: no standalone competitor can pre-fill those domains.',
    competitiveAdvantages: [
      'Protocol-agnostic — works with Apple HomeKit, Google Home, Amazon Alexa simultaneously',
      'Learns vs controls — routine intelligence that improves without configuration',
      'Property developer channel — pre-installed in new builds = acquisition at zero marginal cost',
      'Personal assistant layer — proactive actions, not reactive commands',
      'Data ownership — all learning stays on-device, privacy-first positioning',
    ],
    initiatives: [
      { title: 'Ship the HubCV Education integration',  description: 'First live domain. Pulls College, School, Certificates, Internship and Skills from the HubCV profile graph so new users land on a populated board.', priority: 'critical', status: 'active' },
      { title: 'Ship Nanotrade + Franchiseen Earnings',   description: 'Job, Crypto and Stocks from Nanotrade; franchise stakes from Franchiseen. Completes the Earnings domain and the daily net-worth roll-up.', priority: 'critical', status: 'planned' },
      { title: 'Run 10 pilot home installations',       description: 'Real homes, real families. 10 pilots across Mangaluru and Dubai. Document the experience in detail — this becomes the marketing asset.', priority: 'high', status: 'planned' },
      { title: 'Property developer partnership',        description: 'Approach 2 property developers in Dubai for a pre-installation agreement on new builds. Revenue model: per-unit licence fee + subscription rev-share.', priority: 'high', status: 'planned' },
      { title: 'Pre-order campaign',                   description: 'Launch waitlist and pre-order page with pilot testimonials. Target: 200 pre-orders before full production run to validate demand.', priority: 'medium', status: 'planned' },
    ],
    risks: [
      { risk: 'Hardware supply chain delays',          mitigation: 'Begin manufacturing conversations 12 months before target launch. Identify 2 backup manufacturers.', severity: 'high' },
      { risk: 'Apple/Google competitive response',     mitigation: 'They control the platform, not the intelligence. Llife differentiates on learning depth and cross-platform unification — neither Apple nor Google can unify all three platforms.', severity: 'high' },
      { risk: 'Consumer adoption curve — complexity',  mitigation: 'Pilot feedback shapes simplification. Zero-setup promise: plug in, it learns. No configuration required.', severity: 'medium' },
      { risk: 'Hardware MOQ capital requirement',      mitigation: 'Property developer pre-installation deal or pre-order campaign funds the first MOQ without external capital.', severity: 'medium' },
      { risk: 'Data privacy regulatory (GDPR, DPDP)', mitigation: 'On-device processing first. Cloud processing only with explicit consent. Privacy-first as a marketing advantage, not a compliance burden.', severity: 'low' },
    ],
    threeYearVision: '100,000 daily active users across India and the Gulf, most arriving through HubCV and Nanotrade. Llife becomes the consumer face of the LLIFE ecosystem \u2014 the single daily surface where a user sees their education, earnings, finances, mind and body in one place.',
  },
];

// ─── ACTIVITY ────────────────────────────────────────────────────────────────

export type ActivityCategory = 'Milestone' | 'Decision' | 'Meeting' | 'Launch' | 'Partnership' | 'Finance' | 'Legal' | 'Engineering' | 'Product' | 'Marketing';

export interface Activity {
  date: string;
  venture: string;
  category: ActivityCategory;
  title: string;
  description: string;
}

export const ACTIVITIES: Activity[] = [
  { date: '2026-05-20', venture: 'LLIFE',    category: 'Launch',       title: 'llife.app goes live',                description: 'Public company website launched with SSL, PM2, Apache vhost. Four venture pages, token structure, news, and join us pages live.' },
  { date: '2026-05-20', venture: 'LLIFE',    category: 'Launch',       title: 'hq.llife.app deployed',              description: 'Internal company dashboard live with team login, accordion sidebar, tasks, projects, plan, and management modules.' },
  { date: '2026-04-28', venture: 'Llife',     category: 'Milestone',    title: 'Five-domain model defined',             description: 'Finances, Education, Earnings, Mind and Body fixed as the assistant\u2019s domains, each mapped to a daily time block.' },
  { date: '2026-03-28', venture: 'Llife',     category: 'Partnership',  title: 'Internal API integrations scoped',       description: 'HubCV, Nanotrade and Franchiseen agreed as the first data sources feeding the Education and Earnings domains.' },
  { date: '2026-02-10', venture: 'Llife',     category: 'Decision',     title: 'Ecosystem-first distribution chosen',        description: 'Decision: launch inside HubCV and Nanotrade rather than standalone. Near-zero CAC and the board arrives pre-populated.' },
  { date: '2025-12-15', venture: 'LLIFE',    category: 'Decision',     title: 'Five-venture studio model confirmed',  description: 'Decision: LLIFE operates as a deep-tech studio. All five ventures under one HoldCo. Token structure participatory from genesis.' },
];

// ─── PARTNERS ────────────────────────────────────────────────────────────────

export type PartnerStatus = 'active' | 'prospecting' | 'negotiating' | 'on-hold';
export type PartnerType   = 'Technology' | 'Distribution' | 'Financial' | 'Strategic' | 'Government' | 'Manufacturing';

export interface Partner {
  name: string;
  type: PartnerType;
  ventures: string[];
  status: PartnerStatus;
  role: string;
  nextAction: string;
}

export const PARTNERS: Partner[] = [
  { name: 'Dubai HoldCo Legal Counsel (TBD)',    type: 'Financial',      ventures: ['LLIFE'],     status: 'active',       role: 'Structure and incorporate the Dubai HoldCo vehicle for tokenisation',                                       nextAction: 'Finalise token term sheet and investor agreement templates' },
  { name: 'RBI Account Aggregator (Sahamati)',   type: 'Financial',      ventures: ['Llife'],                 status: 'prospecting',  role: 'Consent rails for bank balances, credits and net worth in the Finances domain',                           nextAction: 'Shortlist an AA technology service provider and review consent-flow rules' },
  { name: 'HubCV / Nanotrade (internal APIs)',     type: 'Technology',     ventures: ['Llife'],                 status: 'active',       role: 'Education, Job, Crypto and Stocks data feeding the Llife daily board',                                       nextAction: 'Finalise read scopes, auth model and rate limits for both APIs' },
];

// ─── CHANNELS ─────────────────────────────────────────────────────────────────

export type ChannelStatus = 'active' | 'building' | 'planned';
export type ChannelType   = 'Marketing' | 'Sales' | 'Community' | 'Internal' | 'Distribution';

export interface Channel {
  name: string;
  type: ChannelType;
  ventures: string[];
  status: ChannelStatus;
  description: string;
  metric: string;
}

export const CHANNELS: Channel[] = [
  { name: 'llife.app',           type: 'Marketing',    ventures: ['LLIFE'],                              status: 'active',   description: 'Primary public presence — all four ventures, token thesis, news, and join us CTA',                        metric: 'Visitor → contact form conversion' },
  { name: 'Direct email outreach',  type: 'Sales',        ventures: ['LLIFE'],    status: 'active',   description: 'Targeted outreach to investors, engineering partners, and franchise brands. 1:1 relationship building',      metric: 'Meetings booked per week' },
  { name: 'LinkedIn',               type: 'Marketing',    ventures: ['LLIFE'],                     status: 'building', description: 'Thought leadership content on deep-tech, franchise innovation, and career intelligence. Studio voice.',       metric: 'Post reach and follower growth' },
  { name: 'Ecosystem cross-sell',   type: 'Distribution', ventures: ['Llife'],                               status: 'building', description: 'Distribution through HubCV, Nanotrade and Franchiseen user bases — the domains arrive already populated.', metric: 'Cross-signups from ecosystem' },
  { name: 'Pre-order campaign',     type: 'Marketing',    ventures: ['Llife'],                               status: 'planned',  description: 'DTC pre-order with pilot testimonials. Builds waitlist and validates consumer demand before full production.',   metric: 'Pre-orders collected' },
  { name: 'Investor network',       type: 'Sales',        ventures: ['LLIFE'],                   status: 'active',   description: 'Direct relationships with strategic investors in deep-tech, real estate, and infrastructure. Dubai-anchored.',  metric: 'Investor conversations active' },
  { name: 'hq.llife.app',        type: 'Internal',     ventures: ['LLIFE'],                              status: 'active',   description: 'Internal company OS — all team operations, planning, tasks, and strategy tracked here',                       metric: 'Team adoption and module usage' },
  { name: 'WhatsApp / Telegram',    type: 'Internal',     ventures: ['LLIFE'],                              status: 'active',   description: 'Fast internal communication for decisions and updates between core team members',                             metric: 'Response time on critical decisions' },
];

// ─── RELATIONS ────────────────────────────────────────────────────────────────

export type RelationCategory = 'Investor' | 'Government' | 'Media' | 'Community' | 'Advisor' | 'Customer';
export type RelationHealth   = 'strong' | 'developing' | 'cold' | 'target';

export interface Relation {
  name: string;
  category: RelationCategory;
  ventures: string[];
  health: RelationHealth;
  description: string;
  lastContact: string;
  nextStep: string;
}

export const RELATIONS: Relation[] = [
  { name: 'Deep-Tech Angel Network',             category: 'Investor',    ventures: ['LLIFE'],                 health: 'developing', description: 'Angel investors with portfolio in AI, automation, and emerging market tech. Entry point for pre-seed Franchiseen and HubCV rounds.',                  lastContact: 'Mar 2026',         nextStep: 'Share LLIFE deck and arrange introductory calls' },
  { name: 'Tech / Startup Media',               category: 'Media',       ventures: ['LLIFE'],                 health: 'target',     description: 'Publications covering deep-tech, venture studios, and emerging market tech. YourStory, Inc42, TechCrunch (India/ME).',                              lastContact: 'Not yet',          nextStep: 'Draft founder story and llife.app launch press release' },
  { name: 'Deep-Tech Advisors (TBD)',           category: 'Advisor',     ventures: ['LLIFE'],      health: 'target',     description: 'Experienced operators in coastal infrastructure, energy, or desalination who can provide technical credibility and network access.',                   lastContact: 'Not yet',          nextStep: 'Identify 3 target advisors through engineering network' },
  { name: 'Beta Users (HubCV base)',            category: 'Customer',    ventures: ['Llife'],                  health: 'target',     description: 'HubCV students whose Education domain is populated from day one — the lowest-friction beta cohort.',                                            lastContact: 'Not yet',          nextStep: 'Launch beta waitlist on llife.ai' },
];
