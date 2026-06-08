import fs from 'fs';
import { LEADS } from '@/lib/sales';
import ConvertToProjectButton from './convert-to-project-button';
import { isConvertibleLead } from '@/lib/lead-conversion';

interface ContactLead {
  id: string; name: string; email: string;
  interest: string; message: string;
  source: string; date: string; status: string;
  config?: string;
}

function loadContactLeads(): ContactLead[] {
  const paths = [
    process.env.LEADS_FILE,
    '/home/centos/codelude/data/leads.json',
    '/tmp/codelude-leads.json',
  ].filter(Boolean) as string[];

  for (const p of paths) {
    try {
      if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf-8'));
    } catch { /* ignore */ }
  }
  return [];
}

const STATUS_STYLES: Record<string, { color: string; label: string }> = {
  new:              { color: '#c8f53a', label: 'New'            },
  qualified:        { color: '#FAC775', label: 'Qualified'      },
  'meeting-booked': { color: '#85B7EB', label: 'Meeting Booked' },
  'proposal-sent':  { color: '#7F77DD', label: 'Proposal Sent'  },
  negotiating:      { color: '#5DCAA5', label: 'Negotiating'    },
};

const VENTURE_COLORS: Record<string, string> = {
  Codelude: '#c8f53a', Roborns: '#5DCAA5', Franchiseen: '#7F77DD',
  HubCV: '#FAC775', Cuestay: '#85B7EB', Dextrip: '#F0997B',
};

export default function LeadsPage() {
  const contactLeads = loadContactLeads();
  const allLeads = [
    ...LEADS.map(l => ({ ...l, config: undefined as string | undefined })),
    ...contactLeads.map(c => ({
      id:       c.id,
      name:     c.name,
      company:  c.email,
      type:     'Customer' as const,
      venture:  detectVenture(c.interest),
      status:   c.status as 'new',
      source:   c.source,
      value:    '—',
      nextStep: `Reply to ${c.email}`,
      notes:    c.message,
      config:   c.config,
    })),
  ];

  return (
    <div>
      <h1 className="page-title">Leads</h1>
      <p className="page-sub">Qualified leads — from direct outreach and codelude.com/contact form submissions.</p>

      {contactLeads.length > 0 && (
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderLeft: '2px solid var(--accent)', padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--accent)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>{contactLeads.length} contact form {contactLeads.length === 1 ? 'submission' : 'submissions'}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', fontWeight: 300 }}>from codelude.com — showing below</span>
        </div>
      )}

      {allLeads.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
          {allLeads.map((l, i) => {
            const ss = STATUS_STYLES[l.status] || { color: '#7a7870', label: l.status };
            const isContact = 'notes' in l && l.source?.includes('codelude.com');
            return (
              <div key={i} style={{ background: 'var(--card-bg)', padding: '1.25rem 1.5rem', borderLeft: isContact ? '2px solid var(--accent)' : '2px solid transparent' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 130px 100px auto', gap: '1rem', alignItems: 'start', marginBottom: isContact && l.notes ? '0.75rem' : 0 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.82rem', marginBottom: '0.2rem' }}>{l.name}</div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)' }}>{l.company}</span>
                      {isContact && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--accent)', letterSpacing: '0.1em' }}>via contact form</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: VENTURE_COLORS[l.venture] || 'var(--muted)' }}>{l.venture}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)' }}>{l.source}</span>
                  </div>
                  <span className="status-badge" style={{ color: ss.color, borderColor: `${ss.color}40`, alignSelf: 'flex-start' }}>{ss.label}</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'flex-end' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--accent)' }}>→ {l.nextStep}</div>
                    {isConvertibleLead(l) && (
                      <ConvertToProjectButton lead={{ id: l.id, name: l.name, venture: l.venture, config: l.config }} />
                    )}
                  </div>
                </div>
                {isContact && (l.notes || l.config) && (
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--muted)', lineHeight: 1.7, fontWeight: 300, paddingTop: '0.75rem', borderTop: '1px solid var(--card-border)' }}>
                    {l.notes && <>&ldquo;{l.notes}&rdquo;</>}
                    {l.config && <div style={{ marginTop: l.notes ? '0.5rem' : 0, color: 'var(--accent)', opacity: 0.8 }}>{l.config}</div>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '2rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', lineHeight: 1.8 }}>
          No leads yet. Contact form submissions from codelude.com will appear here automatically.
        </div>
      )}
    </div>
  );
}

function detectVenture(interest: string): string {
  if (interest.includes('Roborns'))    return 'Roborns';
  if (interest.includes('Franchiseen'))return 'Franchiseen';
  if (interest.includes('HubCV'))      return 'HubCV';
  if (interest.includes('Cuestay'))    return 'Cuestay';
  if (interest.includes('Dextrip'))    return 'Dextrip';
  return 'Codelude';
}
