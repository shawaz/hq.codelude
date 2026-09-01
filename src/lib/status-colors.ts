/**
 * Theme-aware status colours.
 *
 * The palette is monochrome. The literals below are the *fill* greys — light
 * enough to carry dark --on-brand text as a background in either theme. Used
 * as *text* they are far too light on a light card (~1.3:1), so sc() maps each
 * to a --st-* token that flips with the theme.
 *
 * The keys must stay in step with the fill values used at call sites. They were
 * the brand hex (#5DCAA5, #FAC775, …) until the monochrome conversion; a call
 * site passing a value absent from this map silently falls through and renders
 * the fill grey as text, which is invisible in light mode.
 *
 * The mapping is applied at the point of use rather than by rewriting the
 * palette, because the same value is also a background fill:
 *
 *   text    → sc(hex)         resolves to a --st-* token that darkens in light
 *   border  → scBorder(hex)   the old `${hex}40` trick, but var()-safe
 *   fill    → leave the hex alone
 */

/** Fill grey → the token carrying its readable-as-text counterpart per theme. */
const TOKEN: Record<string, string> = {
  '#dbdbdb': 'var(--st-green)',
  '#b5b5b5': 'var(--st-amber)',
  '#eeeeee': 'var(--st-lime)',
  '#9d9d9d': 'var(--st-red)',
  '#a5a5a5': 'var(--st-blue)',
  '#c8c8c8': 'var(--st-purple)',
  '#adadad': 'var(--st-orange)',
};

/**
 * Status colour safe to use as text. Anything not in the palette — a CSS
 * variable, `var(--muted)`, a one-off hex — passes through untouched.
 */
export function sc(color: string | undefined): string {
  if (!color) return 'var(--muted)';
  return TOKEN[color] ?? TOKEN[color.toUpperCase()] ?? TOKEN[color.toLowerCase()] ?? color;
}

/**
 * Translucent border in the status colour. Replaces string-concatenating an
 * alpha suffix (`${color}40`), which silently produces garbage once `color`
 * is a var() rather than a hex.
 */
export function scBorder(color: string | undefined, percent = 35): string {
  return `color-mix(in srgb, ${sc(color)} ${percent}%, transparent)`;
}
