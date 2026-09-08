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
  { id: 'PR02', name: 'Deep-tech Angel (TBD)', company: 'Indian deep-tech angel network', type: 'Investor', venture: 'LLIFE', status: 'researching', priority: 'high', notes: 'Angels with exits in infrastructure, AI, or emerging tech. Target cheque: $25K–100K. Mumbai / Bengaluru based.' },
  { id: 'PR06', name: 'Account Aggregator TSP (TBD)', company: 'RBI-licensed AA technology provider', type: 'Partner', venture: 'Llife', status: 'identified', priority: 'medium', notes: 'Consent rails for the Finances domain — bank balances, credits and net worth. Required before financial data can be read.' },
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

export const LEADS: Lead[] = [];

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

export const DEALS: Deal[] = [];

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

export const CLIENTS: Client[] = [];
