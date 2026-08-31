'use client';

/**
 * Light/dark switch. Writes `data-theme` on <html> and remembers the choice in
 * localStorage under THEME_KEY, which the inline script in src/app/layout.tsx
 * reads before first paint — see that file for why the two must stay in sync.
 *
 * Defaults to dark, which is what HQ has always been. The OS preference is not
 * consulted: an explicit choice on one machine should not be silently
 * overridden by a different machine's setting.
 */

import { useEffect, useState } from 'react';

export const THEME_KEY = 'hq-theme';
export type Theme = 'dark' | 'light';

function apply(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Safari in private mode throws on setItem. The theme still applies for
    // this page load; it just will not persist.
  }
}

export default function ThemeToggle() {
  // Starts undefined so the server render and the first client render agree.
  // The inline script has already set the attribute by this point, so we read
  // it back rather than guessing and causing a hydration mismatch.
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'light' ? 'light' : 'dark');
  }, []);

  function toggle() {
    const next: Theme = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    apply(next);
  }

  const isLight = theme === 'light';

  return (
    <button
      onClick={toggle}
      // Rendered before the effect resolves, so keep it non-committal until then.
      aria-label={theme ? `Switch to ${isLight ? 'dark' : 'light'} mode` : 'Toggle theme'}
      title={theme ? `Switch to ${isLight ? 'dark' : 'light'} mode` : 'Toggle theme'}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        color: 'var(--muted)',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.65rem',
        letterSpacing: '0.1em',
        transition: 'color 0.15s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--off-white)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--muted)'; }}
    >
      <span style={{ fontSize: '0.8rem', lineHeight: 1 }}>{isLight ? '◐' : '◑'}</span>
      <span>{isLight ? 'Light' : 'Dark'}</span>
    </button>
  );
}
