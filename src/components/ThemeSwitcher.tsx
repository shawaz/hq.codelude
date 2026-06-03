'use client';

import { useEffect, useState } from 'react';

type Theme = 'system' | 'light' | 'dark';

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const saved = (localStorage.getItem('theme') as Theme) || 'dark';
    setTheme(saved);
  }, []);

  function set(t: Theme) {
    setTheme(t);
    applyTheme(t);
  }

  return (
    <div className="theme-switcher">
      {(['system', 'light', 'dark'] as Theme[]).map(t => (
        <button
          key={t}
          className={`theme-btn${theme === t ? ' active' : ''}`}
          onClick={() => set(t)}
          title={t.charAt(0).toUpperCase() + t.slice(1)}
        >
          {t === 'system' ? 'sys' : t === 'light' ? 'lt' : 'dk'}
        </button>
      ))}
    </div>
  );
}
