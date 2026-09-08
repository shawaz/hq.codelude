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
  // Llife's five life domains. Education, Earnings and the rest are now first
  // -party surfaces rather than integrations, since the ventures that used to
  // feed them were consolidated into Llife.
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
    { key: 'researching', label: 'Researching', color: '#a5a5a5' },
    { key: 'contacted',   label: 'Contacted',   color: '#eeeeee' },
    { key: 'responded',   label: 'Responded',   color: '#dbdbdb' },
    { key: 'shortlisted', label: 'Shortlisted', color: '#b5b5b5' },
    { key: 'rejected',    label: 'Rejected',    color: '#9d9d9d' },
  ],
  lead: [
    { key: 'new',           label: 'New',           color: '#eeeeee' },
    { key: 'qualified',     label: 'Qualified',     color: '#b5b5b5' },
    { key: 'nurturing',     label: 'Nurturing',     color: '#a5a5a5' },
    { key: 'disqualified',  label: 'Disqualified',  color: '#9d9d9d' },
  ],
  deal: [
    { key: 'discovery',   label: 'Discovery',   color: '#a5a5a5' },
    { key: 'call-booked', label: 'Call Booked', color: '#eeeeee' },
    { key: 'proposal',    label: 'Proposal',    color: '#c8c8c8' },
    { key: 'negotiating', label: 'Negotiating', color: '#b5b5b5' },
    { key: 'closed-won',  label: 'Closed Won',  color: '#dbdbdb' },
    { key: 'closed-lost', label: 'Closed Lost', color: '#9d9d9d' },
  ],
  client: [
    { key: 'onboarding', label: 'Onboarding', color: '#a5a5a5' },
    { key: 'active',     label: 'Active',     color: '#dbdbdb' },
    { key: 'at-risk',    label: 'At Risk',    color: '#b5b5b5' },
    { key: 'churned',    label: 'Churned',    color: '#9d9d9d' },
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
