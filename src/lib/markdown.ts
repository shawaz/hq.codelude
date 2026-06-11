// Shared markdown renderer + styles for the Docs dashboard page and the
// public share viewer. Kept as a tiny regex renderer — docs are trusted
// internal markdown, not arbitrary user input.

export function renderMarkdown(md: string): string {
  return md
    .replace(/^---[\s\S]*?---\n?/, '')
    .replace(/^######\s+(.+)$/gm, '<h6>$1</h6>')
    .replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>')
    .replace(/^####\s+(.+)$/gm, '<h4>$1</h4>')
    .replace(/^###\s+(.+)$/gm, '<h3>$1</h3>')
    .replace(/^##\s+(.+)$/gm, '<h2>$1</h2>')
    .replace(/^#\s+(.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/^---$/gm, '<hr />')
    .replace(/```([^`]*(?:`[^`]+)*)```/g, (_, inner) => {
      const body = inner.replace(/^\w+\n/, '');
      return `<pre><code>${body.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
    })
    .replace(/^\|(.+)\|$/gm, (row) => {
      const cells = row.slice(1, -1).split('|').map((c: string) => c.trim());
      return `<tr>${cells.map((c: string) => `<td>${c}</td>`).join('')}</tr>`;
    })
    .replace(/(<tr>[^]*?<\/tr>\n?)+/g, (block: string) => {
      const rows = block.trim().split('\n');
      const [header, , ...body] = rows;
      if (!header) return block;
      const headerHtml = header.replace(/<td>/g, '<th>').replace(/<\/td>/g, '</th>');
      return `<table><thead>${headerHtml}</thead><tbody>${body.join('')}</tbody></table>`;
    })
    .replace(/^(\d+)\.\s+(.+)$/gm, '<li class="ol">$2</li>')
    .replace(/^[-*]\s+(.+)$/gm, '<li>$1</li>')
    .replace(/(<li[^>]*>[^]*?<\/li>\n?)+/g, (m: string) => `<ul>${m}</ul>`)
    .replace(/^(?!<[hultpodre]).+$/gm, (m: string) => m.trim() ? `<p>${m}</p>` : '')
    .replace(/\n{2,}/g, '\n');
}

// Screen styles for rendered docs (dark theme, uses app CSS variables).
export const DOC_RENDER_CSS = `
  .doc-render h1 { font-size: 1.55rem; font-weight: 800; margin: 0 0 0.4rem; letter-spacing: -0.02em; }
  .doc-render h2 { font-size: 1.1rem; font-weight: 700; margin: 2rem 0 0.65rem; letter-spacing: -0.01em; border-bottom: 1px solid var(--card-border); padding-bottom: 0.35rem; }
  .doc-render h3 { font-size: 0.9rem; font-weight: 700; margin: 1.4rem 0 0.45rem; color: var(--accent); }
  .doc-render p  { font-family: var(--font-mono); font-size: 0.78rem; line-height: 1.9; color: var(--muted); margin: 0 0 0.7rem; font-weight: 300; }
  .doc-render strong { color: var(--off-white); font-weight: 700; }
  .doc-render em { color: var(--off-white); font-style: italic; }
  .doc-render code { font-family: var(--font-mono); font-size: 0.72rem; background: var(--card-bg); border: 1px solid var(--card-border); padding: 0.1rem 0.35rem; color: var(--accent); }
  .doc-render pre  { background: var(--card-bg); border: 1px solid var(--card-border); padding: 1rem 1.25rem; margin: 1rem 0; overflow-x: auto; }
  .doc-render pre code { background: none; border: none; padding: 0; font-size: 0.7rem; color: var(--off-white); line-height: 1.75; white-space: pre; }
  .doc-render table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-family: var(--font-mono); font-size: 0.68rem; }
  .doc-render th { background: var(--card-bg); border: 1px solid var(--card-border); padding: 0.45rem 0.75rem; text-align: left; color: var(--off-white); font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; font-size: 0.58rem; }
  .doc-render td { border: 1px solid var(--card-border); padding: 0.45rem 0.75rem; color: var(--muted); font-weight: 300; line-height: 1.5; vertical-align: top; }
  .doc-render tr:hover td { background: var(--card-bg); }
  .doc-render ul { margin: 0.4rem 0 0.9rem 1.25rem; }
  .doc-render li { font-family: var(--font-mono); font-size: 0.75rem; color: var(--muted); line-height: 1.85; font-weight: 300; }
  .doc-render hr { border: none; border-top: 1px solid var(--card-border); margin: 1.5rem 0; }
`;

// Print styles — applied when exporting to PDF (browser print) and on the
// public share viewer's print. White paper, black ink, no app chrome.
export const DOC_PRINT_CSS = `
  @media print {
    body { background: #fff !important; }
    .no-print, nav, aside { display: none !important; }
    .print-area { display: block !important; position: static !important; overflow: visible !important; }
    .doc-render { max-width: none !important; padding: 0 !important; overflow: visible !important; }
    .doc-render h1, .doc-render h2, .doc-render strong, .doc-render em,
    .doc-render pre code, .doc-render th { color: #111 !important; }
    .doc-render h2 { border-bottom-color: #ddd !important; }
    .doc-render h3 { color: #333 !important; }
    .doc-render p, .doc-render li, .doc-render td { color: #333 !important; }
    .doc-render code { background: #f4f4f2 !important; border-color: #ddd !important; color: #111 !important; }
    .doc-render pre { background: #f4f4f2 !important; border-color: #ddd !important; }
    .doc-render th { background: #f4f4f2 !important; border-color: #ccc !important; }
    .doc-render td { border-color: #ccc !important; }
    .doc-render tr:hover td { background: transparent !important; }
    .doc-render hr { border-top-color: #ddd !important; }
    .doc-render table, .doc-render pre { break-inside: avoid; }
    .doc-render h1, .doc-render h2, .doc-render h3 { break-after: avoid; }
    .letterhead { display: flex !important; }
  }
`;

export type Letterhead = 'roborns' | 'codelude' | 'none';

export const LETTERHEADS: Record<Exclude<Letterhead, 'none'>, {
  name: string;
  entity: string;
  contact: string;
  logoLight?: string; // for white/print backgrounds; falls back to text wordmark
  logoDark?: string;  // for dark screen backgrounds
}> = {
  roborns: {
    name: 'Roborns',
    entity: 'Roborns Infrastructure Pvt Ltd',
    contact: 'roborns@codelude.com · roborns.com',
    logoLight: '/letterhead/roborns-light.png',
    logoDark: '/letterhead/roborns-dark.png',
  },
  codelude: {
    name: 'Codelude',
    entity: 'Codelude',
    contact: 'hello@codelude.com · codelude.com',
    // No image asset — rendered as a text wordmark.
  },
};
