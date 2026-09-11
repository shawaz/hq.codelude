/**
 * Every host HQ knows about, derived from one root.
 *
 * The company is Codelude and the studio site is codelude.com; HQ sits on
 * hq.codelude.com. Hardcoding the host across ~50 files would mean repeating
 * the whole migration sweep the day that changes, so it lives here and
 * everything else references it.
 *
 * llife.app is NOT this root — it is the Llife venture's own product host, one
 * of five venture domains, and is referenced from the venture data rather than
 * from here. Only move it in if Llife ever becomes the company again.
 *
 * Changing the company host means editing ROOT_DOMAIN, then DNS, the Vercel
 * domain, and ALLOWED_EMAIL_DOMAINS in src/convex/access.ts. Nothing else.
 */

export const ROOT_DOMAIN = 'codelude.com';

/** This dashboard. */
export const HQ_DOMAIN = `hq.${ROOT_DOMAIN}`;

/** The public studio site. */
export const APP_DOMAIN = ROOT_DOMAIN;

export const HQ_URL = `https://${HQ_DOMAIN}`;
export const APP_URL = `https://${APP_DOMAIN}`;
