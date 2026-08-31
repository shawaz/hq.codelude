/**
 * The permission vocabulary, shared by the Convex backend and the Next app.
 *
 * Lives under src/convex/ rather than src/lib/ because the Convex tsconfig has
 * no "@/*" path alias — backend files import it as "./access", the app as
 * "@/convex/access" (re-exported through src/lib/ventures.ts and src/lib/nav.ts).
 *
 * A grant is a (venture, page) pair. `users.access` holds an array of them;
 * `undefined` means unrestricted (admins), `[]` means no access at all. The
 * model fails closed: a page absent from NAV cannot be granted, and a user with
 * no matching grant sees nothing.
 *
 * Pure data and pure functions only — no Convex imports, no React.
 */

// ─── SCOPES ───────────────────────────────────────────────────────────────────

export interface Scope {
  id: string;
  name: string;
  color: string;
  sector: string;
  /** The HoldCo pseudo-venture: company-level rows (cap table, holdco budgets). */
  holdco?: boolean;
}

/**
 * Company-level scope. Not a venture — it is the `venture: 'Codelude'` string
 * already used across src/lib/people.ts, legal-data.ts, finance.ts and ops.ts
 * to mean "HoldCo, not venture-specific".
 */
export const HOLDCO: Scope = {
  id: 'codelude',
  name: 'Codelude',
  color: '#c8f53a',
  sector: 'HoldCo',
  holdco: true,
};

/**
 * The five ventures. `name` is load-bearing: every static dataset in src/lib
 * keys off these exact strings, so they must not be renamed casually.
 */
export const VENTURES: Scope[] = [
  { id: 'roborns',     name: 'Roborns',     color: '#5DCAA5', sector: 'Coastal AI Infrastructure' },
  { id: 'franchiseen', name: 'Franchiseen', color: '#7F77DD', sector: 'AI Business Assistant' },
  { id: 'hubcv',       name: 'HubCV',       color: '#FAC775', sector: 'AI Career Assistant' },
  { id: 'dextrip',     name: 'Dextrip',     color: '#F0997B', sector: 'AI Trading Assistant' },
  { id: 'llife',       name: 'Llife',       color: '#85B7EB', sector: 'AI Life Assistant' },
];

/** Everything grantable: HoldCo first, then the ventures. */
export const ALL_SCOPES: Scope[] = [HOLDCO, ...VENTURES];

export const ALL_SCOPE_NAMES: string[] = ALL_SCOPES.map((s) => s.name);

export function scopeByName(name: string): Scope | undefined {
  return ALL_SCOPES.find((s) => s.name === name);
}

// ─── PAGE REGISTRY ────────────────────────────────────────────────────────────

export interface NavPage {
  /** Stable permission key. Matches the href suffix. */
  slug: string;
  label: string;
  href: string;
}

export interface NavSection {
  title: string;
  pages: NavPage[];
}

function page(slug: string, label: string): NavPage {
  return { slug, label, href: `/dashboard/${slug}` };
}

/**
 * The navigation *is* the permission vocabulary — a page missing from here
 * cannot be granted, so keep it complete. Lifted out of src/components/Sidebar.tsx
 * so the sidebar, the route guard and the grant matrix all read one list.
 */
export const NAV: NavSection[] = [
  {
    title: 'Home',
    pages: [
      page('overview', 'Overview'),
      page('tasks',    'Tasks'),
      page('events',   'Events'),
      page('news',     'News'),
      page('travels',  'Travels'),
      page('files',    'Files'),
      page('handbook', 'Handbook'),
    ],
  },
  {
    title: 'Management',
    pages: [
      page('plan',      'Plan'),
      page('strategy',  'Strategy'),
      page('partners',  'Partners'),
      page('activity',  'Activity'),
      page('channel',   'Channel'),
      page('resources', 'Resources'),
      page('relations', 'Relations'),
    ],
  },
  {
    title: 'Operations',
    pages: [
      page('projects',    'Projects'),
      page('office',      'Office'),
      page('departments', 'Departments'),
      page('franchise',   'Franchise'),
      page('properties',  'Properties'),
    ],
  },
  {
    title: 'Finance',
    pages: [
      { slug: 'financial-model', label: 'Model', href: '/dashboard/financial-model' },
      { slug: 'fundraise', label: 'Planning', href: '/dashboard/fundraise' },
      page('budget',    'Budget'),
      page('expenses',  'Expenses'),
      page('accounts',  'Accounts'),
      page('wallets',   'Wallets'),
      page('invoice',   'Invoice'),
      page('payee',     'Payee'),
      page('shares',    'Shares'),
      page('investors', 'Investors'),
    ],
  },
  {
    title: 'People',
    pages: [
      page('attendance',  'Attendance'),
      page('application', 'Application'),
      page('positions',   'Positions'),
      page('onboarding',  'Onboarding'),
      { slug: 'users', label: 'Team', href: '/dashboard/users' },
      page('payroll',     'Payroll'),
      page('training',    'Training'),
      page('offboarding', 'Offboarding'),
    ],
  },
  {
    title: 'Legal',
    pages: [
      page('nda',       'NDA'),
      page('contracts', 'Contracts'),
      page('govt',      'Govt'),
    ],
  },
  {
    title: 'Marketing',
    pages: [
      page('brand',       'Brand'),
      page('market',      'Market'),
      page('competition', 'Competition'),
      page('campaign',    'Campaign'),
      page('content',     'Content'),
    ],
  },
  {
    title: 'Sales',
    pages: [
      page('prospects', 'Prospects'),
      page('leads',     'Leads'),
      page('deals',     'Deals'),
      page('clients',   'Clients'),
    ],
  },
  {
    title: 'Software',
    pages: [
      page('platform', 'Platform'),
      page('features', 'Features'),
      page('bugs',     'Bugs'),
    ],
  },
  {
    title: 'Support',
    pages: [
      page('tickets',  'Tickets'),
      { slug: 'helpdesk', label: 'Help Desk', href: '/dashboard/helpdesk' },
    ],
  },
];

export const ALL_PAGES: NavPage[] = NAV.flatMap((s) => s.pages);
export const ALL_PAGE_SLUGS: string[] = ALL_PAGES.map((p) => p.slug);
export const TOTAL_PAGES = ALL_PAGE_SLUGS.length;

/**
 * Pages every signed-in user can always reach, regardless of the matrix.
 * Without this a zero-access member would bounce between the route guard and
 * its own redirect target forever.
 */
export const ALWAYS_ALLOWED_PAGES = ['overview'] as const;

/** Section titles, in sidebar order. */
export const SECTION_TITLES: string[] = NAV.map((s) => s.title);

export function sectionForSlug(slug: string): string | null {
  for (const section of NAV) {
    if (section.pages.some((p) => p.slug === slug)) return section.title;
  }
  return null;
}

/**
 * Resolve a pathname to its page. Handles nested routes — /dashboard/projects/abc
 * resolves to the `projects` page — by matching the first path segment after
 * /dashboard. Returns null for /dashboard itself (the AI page) and unknown routes.
 */
export function pageForPath(pathname: string): NavPage | null {
  const match = /^\/dashboard\/([^/?#]+)/.exec(pathname);
  if (!match) return null;
  const slug = match[1];
  return ALL_PAGES.find((p) => p.slug === slug) ?? null;
}

// ─── GRANTS ───────────────────────────────────────────────────────────────────

export interface Grant {
  venture: string;
  pages: string[];
}

/**
 * The subset of a user doc the permission helpers need. Kept structural so both
 * a raw Convex document and the trimmed object returned by team.getCurrentUser
 * satisfy it.
 */
export interface AccessSubject {
  role?: string;
  access?: Grant[];
}

/** Admins, and any user whose access was never restricted, bypass the matrix. */
export function isUnrestricted(user: AccessSubject | null | undefined): boolean {
  if (!user) return false;
  return user.role === 'admin' || user.access === undefined;
}

/** Does this user hold a grant on (venture, page)? */
export function can(
  user: AccessSubject | null | undefined,
  venture: string,
  pageSlug: string,
): boolean {
  if (!user) return false;
  if (isUnrestricted(user)) return true;
  return (user.access ?? []).some(
    (g) => g.venture === venture && g.pages.includes(pageSlug),
  );
}

/** Which ventures may this user see on a given page? Drives every venture strip. */
export function venturesForPage(
  user: AccessSubject | null | undefined,
  pageSlug: string,
): string[] {
  if (!user) return [];
  if (isUnrestricted(user)) return ALL_SCOPE_NAMES;
  return (user.access ?? [])
    .filter((g) => g.pages.includes(pageSlug))
    .map((g) => g.venture)
    // Keep ALL_SCOPES ordering rather than whatever order the grants were saved in.
    .sort((a, b) => ALL_SCOPE_NAMES.indexOf(a) - ALL_SCOPE_NAMES.indexOf(b));
}

/**
 * Every venture the user holds at least one grant on, in registry order.
 * Coarser than venturesForPage — use it where the scope is the whole venture
 * rather than a single page (e.g. what the AI assistant may discuss).
 */
export function venturesForUser(user: AccessSubject | null | undefined): string[] {
  if (!user) return [];
  if (isUnrestricted(user)) return ALL_SCOPE_NAMES;
  const held = new Set((user.access ?? []).filter((g) => g.pages.length > 0).map((g) => g.venture));
  return ALL_SCOPE_NAMES.filter((name) => held.has(name));
}

/** A page is visible when the user holds at least one venture grant on it. */
export function canSeePage(
  user: AccessSubject | null | undefined,
  pageSlug: string,
): boolean {
  if (!user) return false;
  if (isUnrestricted(user)) return true;
  if ((ALWAYS_ALLOWED_PAGES as readonly string[]).includes(pageSlug)) return true;
  return venturesForPage(user, pageSlug).length > 0;
}

/** A section is visible when at least one of its pages is. */
export function canSeeSection(
  user: AccessSubject | null | undefined,
  sectionTitle: string,
): boolean {
  const section = NAV.find((s) => s.title === sectionTitle);
  if (!section) return false;
  return section.pages.some((p) => canSeePage(user, p.slug));
}

/** The sidebar, filtered. Empty sections collapse out entirely. */
export function visibleNav(user: AccessSubject | null | undefined): NavSection[] {
  if (isUnrestricted(user)) return NAV;
  return NAV
    .map((s) => ({ title: s.title, pages: s.pages.filter((p) => canSeePage(user, p.slug)) }))
    .filter((s) => s.pages.length > 0);
}

/** Total granted (venture, page) pairs — the counter shown on the grant matrix. */
export function grantCount(access: Grant[] | undefined): number {
  return (access ?? []).reduce((n, g) => n + g.pages.length, 0);
}

// ─── VALIDATION ───────────────────────────────────────────────────────────────

/**
 * Drop unknown ventures and page slugs, empty grants, and duplicates. Called on
 * every write so a renamed page cannot leave orphan grants that silently mean
 * nothing, and so a malformed client payload cannot widen access.
 */
export function normalizeAccess(access: Grant[]): Grant[] {
  const byVenture = new Map<string, Set<string>>();
  for (const grant of access) {
    if (!ALL_SCOPE_NAMES.includes(grant.venture)) continue;
    const pages = byVenture.get(grant.venture) ?? new Set<string>();
    for (const slug of grant.pages) {
      if (ALL_PAGE_SLUGS.includes(slug)) pages.add(slug);
    }
    if (pages.size > 0) byVenture.set(grant.venture, pages);
  }
  return ALL_SCOPE_NAMES
    .filter((name) => byVenture.has(name))
    .map((name) => ({
      venture: name,
      pages: ALL_PAGE_SLUGS.filter((slug) => byVenture.get(name)!.has(slug)),
    }));
}

// ─── PRESETS ──────────────────────────────────────────────────────────────────

/** Sections a venture lead gets but an operating member does not. */
const SENSITIVE_SECTIONS = ['Finance', 'People', 'Legal'];

/** Every page, for one venture. */
export function presetVentureLead(venture: string): Grant[] {
  return normalizeAccess([{ venture, pages: [...ALL_PAGE_SLUGS] }]);
}

/** One venture, minus Finance / People / Legal. */
export function presetOperating(venture: string): Grant[] {
  const pages = NAV
    .filter((s) => !SENSITIVE_SECTIONS.includes(s.title))
    .flatMap((s) => s.pages.map((p) => p.slug));
  return normalizeAccess([{ venture, pages }]);
}

/** Every page, every scope. */
export function presetFullAccess(): Grant[] {
  return normalizeAccess(
    ALL_SCOPE_NAMES.map((venture) => ({ venture, pages: [...ALL_PAGE_SLUGS] })),
  );
}
