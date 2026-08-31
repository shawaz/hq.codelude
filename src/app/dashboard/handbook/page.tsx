'use client';

import { useState } from 'react';
import { HANDBOOK } from '@/lib/workspace';

export default function HandbookPage() {
  const [openSection, setOpenSection] = useState<string | null>(HANDBOOK[0].title);
  const [openArticle, setOpenArticle] = useState<string | null>(HANDBOOK[0].articles[0].title);

  const activeSection = HANDBOOK.find(s => s.title === openSection);

  return (
    <div>
      <h1 className="page-title">Handbook</h1>
      <p className="page-sub">Company policies, operating principles, communication norms, and process documentation.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Section nav */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)', position: 'sticky', top: '2rem' }}>
          {HANDBOOK.map(section => (
            <button key={section.title}
              onClick={() => { setOpenSection(section.title); setOpenArticle(section.articles[0].title); }}
              style={{
                background: openSection === section.title ? 'var(--accent)' : 'var(--card-bg)',
                border: 'none', padding: '0.85rem 1.1rem', cursor: 'pointer', textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: '0.6rem', transition: 'background 0.15s',
              }}>
              <span style={{ fontSize: '0.7rem', color: openSection === section.title ? 'var(--black)' : 'var(--muted)', flexShrink: 0 }}>{section.icon}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.06em', color: openSection === section.title ? 'var(--black)' : 'var(--muted)', fontWeight: openSection === section.title ? 600 : 400 }}>{section.title}</span>
            </button>
          ))}
        </div>

        {/* Article content */}
        {activeSection && (
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--accent-text)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.25rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--card-border)' }}>
              {activeSection.icon} {activeSection.title}
            </div>

            {/* Article list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)', marginBottom: '1.5rem' }}>
              {activeSection.articles.map(article => {
                const isOpen = openArticle === article.title;
                return (
                  <div key={article.title}>
                    <button onClick={() => setOpenArticle(isOpen ? null : article.title)}
                      style={{ width: '100%', background: isOpen ? 'var(--card-bg-alt)' : 'var(--card-bg)', border: 'none',
                        padding: '1rem 1.25rem', cursor: 'pointer', textAlign: 'left', display: 'flex',
                        justifyContent: 'space-between', alignItems: 'center', borderLeft: isOpen ? '2px solid var(--accent)' : '2px solid transparent' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--off-white)' }}>{article.title}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'none' }}>▼</span>
                    </button>
                    {isOpen && (
                      <div style={{ background: 'var(--card-bg)', padding: '0 1.5rem 1.5rem', borderLeft: '2px solid var(--accent)' }}>
                        {article.content.split('\n').map((line, i) => {
                          const isBold = line.match(/^\d{2}\./);
                          const isEmpty = line.trim() === '';
                          return (
                            <p key={i} style={{
                              fontFamily: 'var(--font-mono)', fontSize: '0.72rem', lineHeight: 1.9, fontWeight: 300,
                              color: isBold ? 'var(--off-white)' : 'var(--muted)',
                              marginBottom: isEmpty ? '0.75rem' : '0',
                              marginTop: isEmpty ? '0' : '0',
                            }}>
                              {line || ' '}
                            </p>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
