import { PROJECT_COLORS, type Project } from '@/lib/tasks';

const KNOWN_VENTURES = Object.keys(PROJECT_COLORS) as Project[];

/** Roborns infrastructure config string format:
 *  "{location} · {budgetLabel} ({scale}) · {n} MW compute · {n} kL/day water · {n} t/mo minerals" */
export function parseInfraLocation(config?: string): string {
  if (!config) return '';
  return config.split('·')[0]?.trim() ?? '';
}

export function isConvertibleLead(lead: { venture: string; status: string }): boolean {
  return KNOWN_VENTURES.includes(lead.venture as Project) && lead.status !== 'new';
}
