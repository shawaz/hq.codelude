// ─── PROSPECTS ────────────────────────────────────────────────────────────────

export type ProspectStatus = 'identified' | 'researching' | 'outreach-ready' | 'contacted' | 'responded';
export type ProspectType   = 'Investor' | 'Partner' | 'Customer' | 'Franchise Brand' | 'Recruiter';

export interface Prospect {
  id:       string;
  name:     string;
  company:  string;
  type:     ProspectType;
  venture:  string;
  status:   ProspectStatus;
  priority: 'high' | 'medium' | 'low';
  notes:    string;
}

export const PROSPECTS: Prospect[] = [
  { id: 'PR01', name: 'Infrastructure VC (TBD)', company: 'Gulf-based infrastructure / clean-tech fund', type: 'Investor', venture: 'Roborns', status: 'researching', priority: 'high', notes: 'Target: fund with portfolio in Gulf infrastructure, energy, or sustainability. Dubai or Abu Dhabi based preferred for HoldCo alignment.' },
  { id: 'PR02', name: 'Deep-tech Angel (TBD)', company: 'Indian deep-tech angel network', type: 'Investor', venture: 'Codelude', status: 'researching', priority: 'high', notes: 'Angels with exits in infrastructure, AI, or emerging tech. Target cheque: $25K–100K. Mumbai / Bengaluru based.' },
  { id: 'PR03', name: 'RWA Fund (TBD)', company: 'Real-world asset tokenisation fund', type: 'Investor', venture: 'Roborns', status: 'identified', priority: 'high', notes: 'Funds focused on tokenised real-world assets. Growing category post-2025. Approach after DIFC HoldCo is incorporated.' },
  { id: 'PR04', name: 'Regional F&B Franchise Brand (TBD)', company: 'South India F&B chain (5–20 units)', type: 'Franchise Brand', venture: 'Franchiseen', status: 'researching', priority: 'high', notes: 'First franchise partner. Must have verified unit economics. Karnataka / Tamil Nadu preferred for geographic proximity.' },
  { id: 'PR05', name: 'Tech Recruitment Agency (TBD)', company: 'Bengaluru / Hyderabad tech recruiter', type: 'Recruiter', venture: 'HubCV', status: 'outreach-ready', priority: 'high', notes: 'Design partner for HubCV — discounted access in exchange for structured feedback. Tech-focused mandatory.' },
  { id: 'PR06', name: 'Account Aggregator TSP (TBD)', company: 'RBI-licensed AA technology provider', type: 'Partner', venture: 'Llife', status: 'identified', priority: 'medium', notes: 'Consent rails for the Finances domain — bank balances, credits and net worth. Required before financial data can be read.' },
  { id: 'PR07', name: 'Coding Bootcamp (TBD)', company: 'Indian coding bootcamp', type: 'Partner', venture: 'HubCV', status: 'contacted', priority: 'medium', notes: 'Graduate verification programme partner. 5 bootcamps contacted March 2026. Follow up pending.' },
  { id: 'PR08', name: 'Quant / Strategy Creator (TBD)', company: 'Crypto Twitter community', type: 'Customer', venture: 'Nanotrade', status: 'outreach-ready', priority: 'high', notes: 'Strategy marketplace creator. Owns an audience of traders. Target: 20 creators before public beta launch.' },
];

// ─── LEADS ────────────────────────────────────────────────────────────────────

export type LeadStatus = 'new' | 'qualified' | 'meeting-booked' | 'proposal-sent' | 'negotiating';

export interface Lead {
  id:       string;
  name:     string;
  company:  string;
  type:     ProspectType;
  venture:  string;
  status:   LeadStatus;
  source:   string;
  value:    string;
  nextStep: string;
  notes:    string;
}

export const LEADS: Lead[] = [
  { id: 'L01', name: 'Nanotrade Beta User #1', company: 'Individual trader', type: 'Customer', venture: 'Nanotrade', status: 'qualified', source: 'Direct referral', value: '$99/month', nextStep: 'Upsell to Pro tier at public launch', notes: 'Paying closed beta user. Active on platform. Strong retention signal.' },
  { id: 'L02', name: 'Nanotrade Beta User #2', company: 'Individual trader', type: 'Customer', venture: 'Nanotrade', status: 'qualified', source: 'Direct referral', value: '$99/month', nextStep: 'Gather testimonial for launch campaign', notes: 'Second beta subscriber. Using multi-exchange connector. Potential creator candidate.' },
  { id: 'L03', name: 'Nanotrade Beta User #3', company: 'Individual trader', type: 'Customer', venture: 'Nanotrade', status: 'qualified', source: 'Direct', value: '$29/month', nextStep: 'Retain at public beta pricing', notes: 'Base tier subscriber. Less active — monitor churn risk.' },
];

// ─── DEALS ────────────────────────────────────────────────────────────────────

export type DealStatus = 'discovery' | 'proposal' | 'negotiating' | 'verbal' | 'closed-won' | 'closed-lost';

export interface Deal {
  id:       string;
  title:    string;
  company:  string;
  type:     ProspectType;
  venture:  string;
  value:    string;
  status:   DealStatus;
  closeDate:string;
  notes:    string;
}

export const DEALS: Deal[] = [
  { id: 'D01', title: 'Roborns seed infrastructure round', company: 'Strategic investors (TBD)', type: 'Investor', venture: 'Roborns', value: '₹18 Cr ($2.1M)', status: 'discovery', closeDate: 'Q4 2026', notes: 'Pre-term sheet. Feasibility study and anchor tenant LOI required before formal deal opens.' },
  { id: 'D02', title: 'Franchiseen pilot franchise partner', company: 'Regional F&B brand (TBD)', type: 'Franchise Brand', venture: 'Franchiseen', value: '₹1–5 Cr AUM', status: 'discovery', closeDate: 'Q3 2026', notes: 'First franchise brand agreement. Defines the revenue model proof point.' },
  { id: 'D03', title: 'HubCV recruiter design partner x5', company: 'Multiple recruitment agencies', type: 'Recruiter', venture: 'HubCV', value: '$0 (design partner)', status: 'discovery', closeDate: 'Q4 2026', notes: 'Non-revenue deal — design partners validate the product. Convert to paid at public launch.' },
];

// ─── CLIENTS ──────────────────────────────────────────────────────────────────

export interface Client {
  id:       string;
  name:     string;
  type:     string;
  venture:  string;
  since:    string;
  value:    string;
  status:   'active' | 'at-risk' | 'churned';
  notes:    string;
}

export const CLIENTS: Client[] = [
  { id: 'C01', name: 'Nanotrade Beta Subscriber #1', type: 'Individual trader', venture: 'Nanotrade', since: '2026-05-01', value: '$99/month', status: 'active', notes: 'Pro tier. Active strategy usage. High retention probability.' },
  { id: 'C02', name: 'Nanotrade Beta Subscriber #2', type: 'Individual trader', venture: 'Nanotrade', since: '2026-05-01', value: '$99/month', status: 'active', notes: 'Pro tier. Multi-exchange active. Strong candidate for strategy creator programme.' },
  { id: 'C03', name: 'Nanotrade Beta Subscriber #3', type: 'Individual trader', venture: 'Nanotrade', since: '2026-05-01', value: '$29/month', status: 'active', notes: 'Base tier. Lower engagement. Monitor churn.' },
];
