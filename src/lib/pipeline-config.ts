/**
 * Shared configuration for the sales funnel: prospect → lead → deal → client.
 * All four dashboard pages render the same board from this config; only the
 * stage differs.
 */

export type Stage = 'prospect' | 'lead' | 'deal' | 'client';

export { VENTURES } from './ventures';

export type Segment = { key: string; label: string; unit: string };

/** Each venture sells into a different market, so segments differ per venture. */
export const SEGMENTS: Record<string, Segment[]> = {
  // Mirrors roborns.com: one input, three revenue streams (compute, water,
  // minerals), plus the capital and site pipelines that make them possible.
  Roborns: [
    { key: 'investor',       label: 'Investors',      unit: 'investors' },
    { key: 'infrastructure', label: 'Infrastructure', unit: 'sites'     },
    { key: 'compute',        label: 'Compute',        unit: 'tenants'   },
    { key: 'minerals',       label: 'Minerals',       unit: 'buyers'    },
    { key: 'water',          label: 'Water',          unit: 'offtakers' },
  ],
  Franchiseen: [
    { key: 'brand',      label: 'Brands',      unit: 'brands'      },
    { key: 'investor',   label: 'Investors',   unit: 'investors'   },
    { key: 'franchisee', label: 'Franchisees', unit: 'franchisees' },
  ],
  HubCV: [
    { key: 'school',   label: 'School',   unit: 'schools'    },
    { key: 'college',  label: 'College',  unit: 'colleges'   },
    { key: 'business', label: 'Business', unit: 'businesses' },
  ],
  Dextrip: [
    { key: 'creator',   label: 'Creators',    unit: 'creators'    },
    { key: 'exchange',  label: 'Exchanges',   unit: 'exchanges'   },
    { key: 'community', label: 'Communities', unit: 'communities' },
  ],
  // Llife's five life domains. Education is fed by the HubCV API, Earnings by
  // the Dextrip (job/crypto/stocks) and Franchiseen (franchise) APIs.
  Llife: [
    { key: 'finances',  label: 'Finances',  unit: 'institutions' },
    { key: 'education', label: 'Education', unit: 'providers'    },
    { key: 'earnings',  label: 'Earnings',  unit: 'platforms'    },
    { key: 'mind',      label: 'Mind',      unit: 'services'     },
    { key: 'body',      label: 'Body',      unit: 'services'     },
  ],
};

export type StatusDef = { key: string; label: string; color: string };

/** Funnel position determines the status vocabulary. */
export const STATUSES: Record<Stage, StatusDef[]> = {
  prospect: [
    { key: 'identified',  label: 'Identified',  color: '#7a7870' },
    { key: 'researching', label: 'Researching', color: '#85B7EB' },
    { key: 'contacted',   label: 'Contacted',   color: '#c8f53a' },
    { key: 'responded',   label: 'Responded',   color: '#5DCAA5' },
    { key: 'shortlisted', label: 'Shortlisted', color: '#FAC775' },
    { key: 'rejected',    label: 'Rejected',    color: '#ff8080' },
  ],
  lead: [
    { key: 'new',           label: 'New',           color: '#c8f53a' },
    { key: 'qualified',     label: 'Qualified',     color: '#FAC775' },
    { key: 'nurturing',     label: 'Nurturing',     color: '#85B7EB' },
    { key: 'disqualified',  label: 'Disqualified',  color: '#ff8080' },
  ],
  deal: [
    { key: 'discovery',   label: 'Discovery',   color: '#85B7EB' },
    { key: 'call-booked', label: 'Call Booked', color: '#c8f53a' },
    { key: 'proposal',    label: 'Proposal',    color: '#7F77DD' },
    { key: 'negotiating', label: 'Negotiating', color: '#FAC775' },
    { key: 'closed-won',  label: 'Closed Won',  color: '#5DCAA5' },
    { key: 'closed-lost', label: 'Closed Lost', color: '#ff8080' },
  ],
  client: [
    { key: 'onboarding', label: 'Onboarding', color: '#85B7EB' },
    { key: 'active',     label: 'Active',     color: '#5DCAA5' },
    { key: 'at-risk',    label: 'At Risk',    color: '#FAC775' },
    { key: 'churned',    label: 'Churned',    color: '#ff8080' },
  ],
};

export const STAGE_META: Record<Stage, {
  title: string; sub: string; next: Stage | null; convertLabel: string;
}> = {
  prospect: {
    title: 'Prospects',
    sub: 'Shortlisted target organisations — per venture, per segment.',
    next: 'lead',
    convertLabel: 'To Lead',
  },
  lead: {
    title: 'Leads',
    sub: 'Inbound from lead forms and social media — per venture, per segment.',
    next: 'deal',
    convertLabel: 'To Deal',
  },
  deal: {
    title: 'Deals',
    sub: 'Scheduled calls and appointments in progress — per venture, per segment.',
    next: 'client',
    convertLabel: 'To Client',
  },
  client: {
    title: 'Clients',
    sub: 'Converted customers — per venture, per segment.',
    next: null,
    convertLabel: '',
  },
};

export function statusColor(stage: Stage, key: string): string {
  return STATUSES[stage].find(s => s.key === key)?.color ?? '#7a7870';
}
