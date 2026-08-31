/**
 * Theme-aware status colours.
 *
 * The brand palette (#5DCAA5 green, #FAC775 amber, #c8f53a lime, …) was tuned
 * for dark backgrounds. As *text* on white those run 1.3–3.8:1 — lime is
 * effectively invisible — so light mode needs darkened hues.
 *
 * The same literals also serve as venture brand colours and as background
 * fills, where the bright value is correct in both themes. So the mapping is
 * applied at the point of use rather than by rewriting the palette:
 *
 *   text    → sc(hex)         resolves to a --st-* token that darkens in light
 *   border  → scBorder(hex)   the old `${hex}40` trick, but var()-safe
 *   fill    → leave the hex alone
 */

/** Brand hex → the token that carries its light-mode-safe counterpart. */
const TOKEN: Record<string, string> = {
  '#5DCAA5': 'var(--st-green)',
  '#FAC775': 'var(--st-amber)',
  '#c8f53a': 'var(--st-lime)',
  '#ff8080': 'var(--st-red)',
  '#85B7EB': 'var(--st-blue)',
  '#7F77DD': 'var(--st-purple)',
  '#F0997B': 'var(--st-orange)',
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
