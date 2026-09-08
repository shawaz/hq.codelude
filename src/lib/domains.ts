/**
 * Every host HQ knows about, derived from one root.
 *
 * The studio is on llife.app as a deliberate placeholder for llife.ai, which
 * is wanted but not yet budgeted. Hardcoding the host across ~50 files would
 * mean repeating the whole migration sweep the day that changes, so it lives
 * here and everything else references it.
 *
 * Moving to .ai means editing ROOT_DOMAIN, then DNS, the Vercel domain, and
 * ALLOWED_EMAIL_DOMAINS in src/convex/access.ts. Nothing else.
 *
 * Note .app is on the HSTS preload list — browsers refuse plain http:// to it
 * outright rather than redirecting, so any link to these hosts must be https.
 */

export const ROOT_DOMAIN = 'llife.app';

/** This dashboard. Replaced hq.codelude.com. */
export const HQ_DOMAIN = `hq.${ROOT_DOMAIN}`;

/** The customer app. */
export const APP_DOMAIN = ROOT_DOMAIN;

export const HQ_URL = `https://${HQ_DOMAIN}`;
export const APP_URL = `https://${APP_DOMAIN}`;
