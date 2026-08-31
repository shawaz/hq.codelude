/**
 * Navigation + permission helpers for the Next app.
 *
 * Re-exported from src/convex/access.ts, which is the single definition shared
 * with the Convex backend. The sidebar, the dashboard route guard and the grant
 * matrix all render from NAV, so adding a page here is what makes it grantable.
 */
export {
  NAV,
  ALL_PAGES,
  ALL_PAGE_SLUGS,
  TOTAL_PAGES,
  SECTION_TITLES,
  ALWAYS_ALLOWED_PAGES,
  sectionForSlug,
  pageForPath,
  can,
  canSeePage,
  canSeeSection,
  isUnrestricted,
  venturesForPage,
  venturesForUser,
  visibleNav,
  grantCount,
  normalizeAccess,
  presetFullAccess,
  presetVentureLead,
  presetOperating,
} from '@/convex/access';
export type { NavPage, NavSection, Grant, AccessSubject, Scope } from '@/convex/access';
export { ALL_SCOPES, ALL_SCOPE_NAMES, scopeByName } from '@/convex/access';
