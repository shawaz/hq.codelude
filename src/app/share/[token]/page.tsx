'use client';

import { useState, useEffect, use } from 'react';
import { renderMarkdown, DOC_RENDER_CSS, DOC_PRINT_CSS, LETTERHEADS, type Letterhead } from '@/lib/markdown';

type Step = 'loading' | 'inactive' | 'email' | 'otp' | 'doc';

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'var(--black)', border: '1px solid var(--card-border)',
  color: 'var(--off-white)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem',
  padding: '0.75rem 0.9rem', outline: 'none', boxSizing: 'border-box',
};

const buttonStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.12em',
  textTransform: 'uppercase', padding: '0.75rem 1.5rem', marginTop: '0.85rem',
  border: '1px solid var(--accent)', color: 'var(--black)', background: 'var(--accent)',
  cursor: 'pointer', fontWeight: 600, width: '100%',
};

function LetterheadBlock({ letterhead, forPrint }: { letterhead: Letterhead; forPrint?: boolean }) {
  if (letterhead === 'none') return null;
  const lh = LETTERHEADS[letterhead];
  const logo = forPrint ? lh.logoLight : lh.logoDark;
  return (
    <div className="letterhead" style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      borderBottom: '2px solid var(--accent)', paddingBottom: '1rem', marginBottom: '2rem',
    }}>
      {logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logo} alt={lh.name} style={{ height: 34 }} />
      ) : (
        <span style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '0.02em' }}>
          {lh.name.toUpperCase()}
        </span>
      )}
      <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', lineHeight: 1.8 }}>
        {lh.entity}<br />{lh.contact}
      </div>
    </div>
  );
}

export default function SharePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [step, setStep]             = useState<Step>('loading');
  const [email, setEmail]           = useState('');
  const [otp, setOtp]               = useState('');
  const [content, setContent]       = useState('');
  const [letterhead, setLetterhead] = useState<Letterhead>('none');
  const [error, setError]           = useState('');
  const [busy, setBusy]             = useState(false);

  useEffect(() => {
    fetch(`/api/share/${token}`)
      .then(r => r.json())
      .then(d => setStep(d.active ? 'email' : 'inactive'))
      .catch(() => setStep('inactive'));
  }, [token]);

  async function requestOtp() {
    if (!email.trim()) return;
    setBusy(true);
    setError('');
    const res = await fetch(`/api/share/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'request-otp', email }),
    });
    setBusy(false);
    if (res.status === 410) { setStep('inactive'); return; }
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error || 'Something went wrong. Try again.');
      return;
    }
    setStep('otp');
  }

  async function verify() {
    if (!otp.trim()) return;
    setBusy(true);
    setError('');
    const res = await fetch(`/api/share/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'verify', otp }),
    });
    setBusy(false);
    const d = await res.json().catch(() => ({}));
    if (res.status === 410) { setStep('inactive'); return; }
    if (!res.ok) { setError(d.error || 'Verification failed.'); return; }
    setContent(d.content);
    setLetterhead(d.letterhead ?? 'none');
    setStep('doc');
  }

  if (step === 'doc') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--black)' }}>
        <div className="no-print" style={{
          padding: '0.85rem 1.5rem', borderBottom: '1px solid var(--card-border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            Shared document · Confidential
          </span>
          <button
            onClick={() => window.print()}
            style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em',
              textTransform: 'uppercase', padding: '0.45rem 0.9rem', cursor: 'pointer',
              border: '1px solid var(--card-border)', color: 'var(--muted)', background: 'transparent',
            }}
          >
            Print / PDF
          </button>
        </div>
        <div className="print-area" style={{ maxWidth: 820, margin: '0 auto', padding: '2.5rem 2rem' }}>
          <LetterheadBlock letterhead={letterhead} />
          <div className="doc-render" dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
        </div>
        <style>{DOC_RENDER_CSS}</style>
        <style>{DOC_PRINT_CSS}</style>
        <style>{`
          @media print {
            .letterhead img { content: url(${letterhead !== 'none' && LETTERHEADS[letterhead].logoLight ? LETTERHEADS[letterhead].logoLight : ''}); }
            .letterhead { border-bottom-color: #111 !important; }
            .letterhead div { color: #555 !important; }
            .letterhead span { color: #111 !important; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--black)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '1.5rem',
    }}>
      <div style={{ width: 380, maxWidth: '100%' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
          Secure document
        </div>

        {step === 'loading' && (
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)' }}>Loading…</p>
        )}

        {step === 'inactive' && (
          <>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.75rem', color: 'var(--off-white)' }}>
              This link is no longer active
            </h1>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted)', lineHeight: 1.9, fontWeight: 300 }}>
              It may have expired or been revoked. Please contact the sender to request a new link.
            </p>
          </>
        )}

        {step === 'email' && (
          <>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.75rem', color: 'var(--off-white)' }}>
              Verify your email
            </h1>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', lineHeight: 1.9, fontWeight: 300, marginBottom: '1.25rem' }}>
              Enter the email address this document was shared with. We&apos;ll send you a one-time access code.
            </p>
            <input
              autoFocus type="email" placeholder="you@company.com" value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && requestOtp()}
              style={inputStyle}
            />
            <button onClick={requestOtp} disabled={busy} style={buttonStyle}>
              {busy ? 'Sending…' : 'Send code'}
            </button>
          </>
        )}

        {step === 'otp' && (
          <>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.75rem', color: 'var(--off-white)' }}>
              Enter your code
            </h1>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', lineHeight: 1.9, fontWeight: 300, marginBottom: '1.25rem' }}>
              If <strong style={{ color: 'var(--off-white)' }}>{email}</strong> matches the recipient of this document,
              a 6-digit code is on its way. It expires in 10 minutes.
            </p>
            <input
              autoFocus inputMode="numeric" maxLength={6} placeholder="······" value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
              onKeyDown={e => e.key === 'Enter' && verify()}
              style={{ ...inputStyle, letterSpacing: '0.6em', textAlign: 'center', fontSize: '1.2rem' }}
            />
            <button onClick={verify} disabled={busy} style={buttonStyle}>
              {busy ? 'Verifying…' : 'View document'}
            </button>
            <button
              onClick={() => { setStep('email'); setOtp(''); setError(''); }}
              style={{ ...buttonStyle, background: 'transparent', color: 'var(--muted)', borderColor: 'var(--card-border)', marginTop: '0.5rem' }}
            >
              Use a different email
            </button>
          </>
        )}

        {error && (
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#ff8080', marginTop: '1rem' }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
