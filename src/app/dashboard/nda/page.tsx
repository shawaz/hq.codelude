'use client';

import { useState } from 'react';
import { NDAS, type NDAStatus } from '@/lib/legal-data';

const STATUS_STYLES: Record<NDAStatus, { color: string; label: string }> = {
  active:   { color: '#5DCAA5', label: 'Active'   },
  expired:  { color: 'var(--muted)', label: 'Expired'  },
  pending:  { color: '#FAC775', label: 'Pending'  },
  unsigned: { color: '#ff8080', label: 'Unsigned' },
};
const VENTURE_COLORS: Record<string, string> = {
  Codelude: '#c8f53a', Roborns: '#5DCAA5', Franchiseen: '#7F77DD',
  HubCV: '#FAC775', Llife: '#85B7EB', Dextrip: '#F0997B',
};

interface SendState { sending: boolean; sent: boolean; error: string }
const defaultSend: SendState = { sending: false, sent: false, error: '' };

export default function NDAPage() {
  const [modal, setModal] = useState<typeof NDAS[0] | null>(null);
  const [toEmail,  setToEmail]  = useState('');
  const [note,     setNote]     = useState('');
  const [sendState, setSendState] = useState<SendState>(defaultSend);

  function openModal(nda: typeof NDAS[0]) {
    setModal(nda);
    setToEmail('');
    setNote('');
    setSendState(defaultSend);
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!modal) return;
    setSendState({ sending: true, sent: false, error: '' });
    try {
      const res = await fetch('/api/nda/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ndaId:        modal.id,
          party:        modal.party,
          toEmail,
          venture:      modal.venture,
          purpose:      modal.purpose,
          personalNote: note,
        }),
      });
      if (res.ok) {
        setSendState({ sending: false, sent: true, error: '' });
      } else {
        setSendState({ sending: false, sent: false, error: 'Failed to send. Check RESEND_API_KEY in .env.' });
      }
    } catch {
      setSendState({ sending: false, sent: false, error: 'Network error.' });
    }
  }

  return (
    <div>
      <h1 className="page-title">NDA</h1>
      <p className="page-sub">Non-disclosure agreement registry — send, track, and file all NDAs.</p>

      <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderLeft: '2px solid #F0997B', padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: '#F0997B', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Policy reminder</div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', lineHeight: 1.8, fontWeight: 300, margin: 0 }}>
          An NDA must be signed before sharing financial models, technical specs, investor terms, or unannounced roadmaps. Template in <strong style={{ color: 'var(--off-white)' }}>Google Drive / Legal / Templates</strong>. Click <strong style={{ color: 'var(--off-white)' }}>Request signature</strong> to send via email.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
        {NDAS.map((n, i) => {
          const ss = STATUS_STYLES[n.status];
          return (
            <div key={i} style={{ background: 'var(--card-bg)', padding: '1.25rem 1.5rem', display: 'grid', gridTemplateColumns: '200px 90px 90px 1fr auto', gap: '1.25rem', alignItems: 'start' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>{n.id}</div>
                <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>{n.party}</div>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: VENTURE_COLORS[n.venture] }}>{n.venture}</span>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', marginBottom: '0.2rem' }}>{n.type}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)' }}>Signed: {n.signed}</div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--muted)', lineHeight: 1.6, fontWeight: 300, marginBottom: '0.3rem' }}>{n.purpose}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', opacity: 0.7 }}>{n.location}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'flex-end' }}>
                <span className="status-badge" style={{ color: ss.color, borderColor: `${ss.color}40`, whiteSpace: 'nowrap' }}>{ss.label}</span>
                <button onClick={() => openModal(n)} style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em',
                  textTransform: 'uppercase', padding: '0.25rem 0.7rem', border: '1px solid var(--accent)',
                  color: 'var(--accent-text)', background: 'transparent', cursor: 'pointer', whiteSpace: 'nowrap',
                  transition: 'all 0.15s',
                }}>
                  Request signature →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Send modal ───────────────────────────────────────────────── */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'var(--overlay)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
          onClick={() => setModal(null)}>
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', maxWidth: 500, width: '100%', padding: '2rem' }}
            onClick={e => e.stopPropagation()}>

            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--accent-text)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Request NDA signature</div>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.3rem' }}>{modal.id}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', marginBottom: '1.5rem' }}>{modal.party} · {modal.venture}</div>

            {sendState.sent ? (
              <div style={{ background: 'rgba(93,202,165,0.08)', border: '1px solid rgba(93,202,165,0.3)', padding: '1.25rem', marginBottom: '1rem' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#5DCAA5', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Sent</div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', lineHeight: 1.7, fontWeight: 300, margin: 0 }}>
                  NDA signature request sent to <strong style={{ color: 'var(--off-white)' }}>{toEmail}</strong>. Update the status below once signed and file the document in Google Drive.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Recipient email</label>
                  <input style={{ background: 'var(--black)', border: '1px solid var(--card-border)', color: 'var(--off-white)', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', padding: '0.75rem 1rem', outline: 'none' }}
                    type="email" value={toEmail} onChange={e => setToEmail(e.target.value)} placeholder="party@company.com" required autoFocus />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Personal note (optional)</label>
                  <textarea style={{ background: 'var(--black)', border: '1px solid var(--card-border)', color: 'var(--off-white)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', padding: '0.75rem 1rem', outline: 'none', resize: 'vertical' }}
                    rows={3} value={note} onChange={e => setNote(e.target.value)} placeholder="Add context about why you're sharing and what they'll see..." />
                </div>
                {sendState.error && <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#ff8080' }}>{sendState.error}</div>}
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button type="submit" disabled={sendState.sending} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em', background: 'var(--accent)', color: 'var(--on-brand)', border: 'none', padding: '0.75rem 1.5rem', cursor: 'pointer', fontWeight: 600 }}>
                    {sendState.sending ? 'Sending...' : 'Send →'}
                  </button>
                  <button type="button" onClick={() => setModal(null)} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em', background: 'transparent', color: 'var(--muted)', border: '1px solid var(--card-border)', padding: '0.75rem 1.5rem', cursor: 'pointer' }}>
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
