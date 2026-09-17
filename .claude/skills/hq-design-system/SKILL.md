---
name: hq-design-system
description: Repo-specific HQ visual conventions (complements the published ui-ux-pro-max skill). Use when building or changing any UI in this repo — new dashboard pages, components, tables, forms, or restyling existing ones. Enforces the HQ design system (tokens, mono type scale, status colours, scope colours) instead of inventing new styling.
---

# HQ design system

Build UI that looks like it was already here. This codebase has a specific,
consistent visual language — match it rather than introducing a new one.

## Never hardcode a colour

Every colour comes from a CSS custom property in `src/app/globals.css`. Both a
dark (`:root`) and light (`[data-theme]`) palette are defined, so a hardcoded
hex breaks theme switching.

| Token | Use |
|---|---|
| `--black` / `--off-white` | page ground / primary text |
| `--muted` | secondary text, labels, inactive state |
| `--card-bg` `--card-bg-alt` `--card-border` | surfaces and their edges |
| `--accent` `--accent-text` `--accent-glow` | emphasis, active state |
| `--hover-wash` | row and cell hover |
| `--st-*` | status palette (lime/green/purple/amber/orange/blue/red) |
| `--font-head` (Outfit) / `--font-mono` (DM Mono) | headings / everything else |

## Route colour through the helpers, not by hand

- `sc(color)` and `scBorder(color)` from `@/lib/status-colors` — text and border
  variants of a status colour. Do not apply a raw status hex directly.
- `scopeColor(ventureName)` from `@/lib/ventures` — a venture's colour. Never
  keep a second hardcoded map of venture colours; that is exactly how
  `tasks.ts` and `access.ts` drifted apart. Derive from the registry.
- `projectColor(name)` from `@/lib/tasks` tolerates names that no longer
  resolve and returns a neutral grey. Use it wherever a stored venture name
  might name a consolidated scope.

## The house type scale

Mono is the default, not the exception. Typical sizes seen across pages:

- `0.55–0.60rem`, `letter-spacing: 0.12em`, `text-transform: uppercase` — column
  labels and eyebrows
- `0.62–0.70rem`, `font-weight: 300`, `line-height: 1.6–1.8` — body and cell text
- `0.82rem`, `font-weight: 600` — row titles
- `.page-title` / `.page-sub` — page headers; use the existing classes

## Layout patterns already in use

- **Tables of records**: a `flex column` with `gap: 1px` over a
  `background: var(--card-border)` parent, each row `background: var(--card-bg)`.
  The gap *is* the divider — do not add borders to rows.
- **Filter bars**: `.filter-bar` with `.filter-pill` buttons; the active pill
  takes `borderColor: scopeColor(v)` and `color: sc(scopeColor(v))`.
- **Venture-scoped pages**: wrap in `VenturePageLayout` and use its render-prop
  `({ venture, tab })`. Do not rebuild venture tabs by hand.
- **Empty states**: use `NoRows` from `@/components/VenturePageLayout`.

## Access and scope

Pages are scoped. Use `usePageScopes('<pageSlug>')` and filter rows by the
returned `names`. A page absent from the nav registry has no grant to check —
fail closed rather than rendering everything.

## Checklist before you finish

1. No hex literals outside `globals.css`.
2. Renders correctly in both themes — check the `[data-theme]` block.
3. Long tables scroll inside their own container; the page body never scrolls
   sideways.
4. Venture and status colours come from the registry, not a local map.
5. `npx tsc --noEmit` is clean.
