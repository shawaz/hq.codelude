import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Codelude HQ',
  description: 'Internal company dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <script dangerouslySetInnerHTML={{ __html:
          `(function(){var t=localStorage.getItem('theme');if(t)document.documentElement.setAttribute('data-theme',t);})()`
        }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
