import { VENTURES } from '@/lib/ventures';

export type Priority = 'high' | 'medium' | 'low';
export type Status   = 'todo' | 'in-progress' | 'done';

/**
 * Live venture names.
 *
 * Roborns, Franchiseen, HubCV and Nanotrade were consolidated into Llife. Their
 * Convex rows still exist but are archived, and tasks:list filters them out, so
 * nothing typed as a Project ever carries one of those names at runtime.
 */
export type Project = 'Llife';

export interface Task {
  id: string;
  title: string;
  project: Project;
  category: string;
  priority: Priority;
  status: Status;
}

/**
 * Derived from the scope registry rather than restated.
 *
 * These colours used to be a second hardcoded copy of the ones in access.ts,
 * which is exactly how the two drifted apart. Deriving them means removing a
 * venture from the registry removes it here for free.
 */
export const PROJECT_COLORS: Record<string, string> = Object.fromEntries(
  VENTURES.map((v) => [v.name, v.color]),
);

/**
 * Colour for a venture name, tolerating names that no longer resolve.
 *
 * Convex queries filter archived rows out, but the file-backed site-project
 * store does not, so a stored ventureId can still name a consolidated venture.
 * Returning a neutral grey beats rendering `undefined` into a CSS border.
 */
export function projectColor(name: string | undefined | null): string {
  return (name && PROJECT_COLORS[name]) || 'var(--muted)';
}

export const SEED_TASKS: Task[] = [



  // ── ROBORNS (tagged Llife — Roborns is a consolidated scope, see Project) ──
  // Ordered by dependency: gates first, then the things gated on them.
  // Zero-cost and time-sensitive items (govt policy window, legal exposure)
  // are high priority regardless of where they sit in the build sequence.
  { id: 'rb01', project: 'Llife', category: 'Roborns — Gate',    priority: 'high',   status: 'todo', title: 'GATE 1 — Power load feasibility opinion via KPT (EXP-010, ~₹15–25K)' },
  { id: 'rb02', project: 'Llife', category: 'Roborns — Gate',    priority: 'high',   status: 'todo', title: 'GATE 2 — CRZ classification for Panambur survey no. (EXP-011, ~₹25–50K)' },
  { id: 'rb03', project: 'Llife', category: 'Roborns — Gate',    priority: 'high',   status: 'todo', title: 'GATE 3 — Kaveri guidance value + KIADB Baikampady rate (EXP-012, free)' },
  { id: 'rb04', project: 'Llife', category: 'Roborns — Legal',   priority: 'high',   status: 'todo', title: 'Gate roborns.com/investors — s.42(7) public solicitation exposure' },
  { id: 'rb05', project: 'Llife', category: 'Roborns — Legal',   priority: 'high',   status: 'todo', title: 'Email CA/CS — incorporation, FDI structure, s.42, Nidhi second opinion' },
  { id: 'rb06', project: 'Llife', category: 'Roborns — Legal',   priority: 'high',   status: 'todo', title: 'Incorporate Roborns Energy & Infrastructure Pvt Ltd + DPIIT recognition' },
  { id: 'rb07', project: 'Llife', category: 'Roborns — Legal',   priority: 'high',   status: 'todo', title: 'Sign NDA-001 with thermal engineering partner — blocks CON-002' },
  { id: 'rb08', project: 'Llife', category: 'Roborns — Govt',    priority: 'high',   status: 'todo', title: 'Send KDEM approach note — coastal AI hub, get on radar pre-consultation' },
  { id: 'rb09', project: 'Llife', category: 'Roborns — Govt',    priority: 'high',   status: 'todo', title: 'File Karnataka DC policy consultation response — window closes on rollout' },
  { id: 'rb10', project: 'Llife', category: 'Roborns — Govt',    priority: 'high',   status: 'todo', title: 'KIADB Mangaluru — Baikampady allotment enquiry, marine-intake parcel' },
  { id: 'rb11', project: 'Llife', category: 'Roborns — Comms',   priority: 'high',   status: 'todo', title: 'Correct 15 May 2026 news entry — feasibility study was never commissioned' },
  { id: 'rb12', project: 'Llife', category: 'Roborns — Comms',   priority: 'high',   status: 'todo', title: 'Audit investor deck v1.2 for the same unsupported feasibility claim' },
  { id: 'rb13', project: 'Llife', category: 'Roborns — Finance', priority: 'high',   status: 'todo', title: 'Fix opex model — 20MW draws ~175 GWh/yr, exceeds stated ₹20 Cr opex' },
  { id: 'rb14', project: 'Llife', category: 'Roborns — Eng',     priority: 'high',   status: 'todo', title: 'Verify MED-TVC vs available waste heat grade — TVC needs motive steam' },
  { id: 'rb15', project: 'Llife', category: 'Roborns — Eng',     priority: 'medium', status: 'todo', title: 'Dark fibre enquiry — KPTCL OPGW, RailTel (Konkan), Jio/Airtel/Tata NLD' },
  { id: 'rb16', project: 'Llife', category: 'Roborns — Gate',    priority: 'medium', status: 'todo', title: 'Site survey at Mangaluru site (EXP-008 — rescope from Uchila Thalapady)' },
  { id: 'rb17', project: 'Llife', category: 'Roborns — Gate',    priority: 'medium', status: 'todo', title: 'Thermal feasibility study (EXP-009) — only after Gates 1–3 clear' },
  { id: 'rb18', project: 'Llife', category: 'Roborns — Comms',   priority: 'medium', status: 'todo', title: 'Reframe pitch on PUE not water — ~₹40 Cr/yr energy delta at 20MW' },
  { id: 'rb19', project: 'Llife', category: 'Roborns — Comms',   priority: 'medium', status: 'todo', title: 'Update roborns.com site from Kapu to Mangaluru/DK' },
  { id: 'rb20', project: 'Llife', category: 'Roborns — Finance', priority: 'medium', status: 'todo', title: 'Reconcile instrument — ₹18.1 Cr CCD (HQ) vs ₹15 Cr equity 8% pref (site)' },
  { id: 'rb21', project: 'Llife', category: 'Roborns — Finance', priority: 'medium', status: 'todo', title: 'R7 verification checklist — no spend, no FD, no office until cleared' },

  // ── LLIFE ─────────────────────────────────────────────────────────────
  { id: 'c01', project: 'Llife', category: 'Product',        priority: 'high',   status: 'done',        title: 'Five-domain model specification' },
  { id: 'c02', project: 'Llife', category: 'Business',       priority: 'high',   status: 'in-progress', title: 'Ecosystem API contracts with HubCV and Nanotrade' },
  { id: 'c03', project: 'Llife', category: 'Product',        priority: 'high',   status: 'todo',        title: 'AI personal assistant core development' },
  { id: 'c04', project: 'Llife', category: 'Product',        priority: 'high',   status: 'todo',        title: 'HubCV Education API integration' },
  { id: 'c05', project: 'Llife', category: 'Product',        priority: 'high',   status: 'todo',        title: 'Routine learning algorithm' },
  { id: 'c06', project: 'Llife', category: 'Product',        priority: 'medium', status: 'todo',        title: 'Nanotrade + Franchiseen Earnings integration' },
  { id: 'c07', project: 'Llife', category: 'Product',        priority: 'medium', status: 'todo',        title: 'Voice command integration' },
  { id: 'c08', project: 'Llife', category: 'Product',        priority: 'high',   status: 'todo',        title: 'Mobile app development' },
  { id: 'c09', project: 'Llife', category: 'Product',        priority: 'medium', status: 'todo',        title: 'Ambient intelligence layer' },
  { id: 'c10', project: 'Llife', category: 'Business',       priority: 'high',   status: 'todo',        title: 'Account Aggregator TSP signed' },
  { id: 'c11', project: 'Llife', category: 'Business',       priority: 'high',   status: 'todo',        title: 'First 100 private beta users onboarded' },
  { id: 'c12', project: 'Llife', category: 'Business',       priority: 'medium', status: 'todo',        title: 'Pricing model definition' },
  { id: 'c13', project: 'Llife', category: 'Marketing',      priority: 'medium', status: 'todo',        title: 'Beta waitlist setup and launch' },
  { id: 'c14', project: 'Llife', category: 'Marketing',      priority: 'medium', status: 'todo',        title: 'B2C go-to-market strategy' },

];
