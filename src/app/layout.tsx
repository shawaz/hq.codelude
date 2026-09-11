import type { Metadata } from 'next';
import './globals.css';
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import ConvexClientProvider from './ConvexClientProvider';

export const metadata: Metadata = {
  title: 'Codelude HQ',
  description: 'Internal company dashboard',
};

/**
 * Runs before first paint to set the theme, so a light-mode user does not get a
 * flash of the dark palette on every navigation. It has to be inline and
 * synchronous — a React effect runs after paint, which is exactly too late.
 *
 * The storage key is duplicated from ThemeToggle by necessity (this string is
 * embedded in HTML, not imported). If THEME_KEY changes there, change it here.
 */
const NO_FLASH_SCRIPT = `
(function(){
  try {
    var t = localStorage.getItem('hq-theme');
    if (t === 'light' || t === 'dark') {
      document.documentElement.setAttribute('data-theme', t);
      return;
    }
  } catch (e) {}
  document.documentElement.setAttribute('data-theme', 'dark');
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH_SCRIPT }} />
      </head>
      <body>
        <ConvexAuthNextjsServerProvider>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </ConvexAuthNextjsServerProvider>
      </body>
    </html>
  );
}
