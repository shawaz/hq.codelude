'use client';

import { useEffect, useState } from 'react';

const DEXTRIP_PROCESSES = [
  'dextrip-web', 'dextrip-multi-bot', 'dextrip-bot-strategies',
  'dextrip-tv-bot', 'dextrip-tv-bot-live', 'dextrip-tv-dashboard',
  'spot-bot', 'spot-dashboard', 'client-dextrip',
];

function fmtUptime(ms: number) {
  if (!ms) return '—';
  const secs = Math.floor((Date.now() - ms) / 1000);
  if (secs < 60)   return `${secs}s`;
  if (secs < 3600) return `${Math.floor(secs/60)}m`;
  if (secs < 86400)return `${Math.floor(secs/3600)}h`;
  return `${Math.floor(secs/86400)}d`;
}

function fmtMem(bytes: number) {
  if (!bytes) return '—';
  return `${(bytes / 1024 / 1024).toFixed(0)}MB`;
}

export default function BotHealthPage() {
  const [data, setData]       = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLast] = useState('');

  async function load() {
    const res = await fetch('/api/dextrip');
    const d   = await res.json();
    setData(d); setLoading(false);
    setLast(new Date().toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour12: false }));
  }

  useEffect(() => { load(); const i = setInterval(load, 15000); return () => clearInterval(i); }, []);

  const processes: any[] = data?.pm2Processes ?? [];
  const dextripProcs = processes.filter(p => DEXTRIP_PROCESSES.includes(p.name));
  const otherProcs   = processes.filter(p => !DEXTRIP_PROCESSES.includes(p.name));

  const online  = processes.filter(p => p.status === 'online').length;
  const stopped = processes.filter(p => p.status === 'stopped').length;

  function ProcessRow({ p }: { p: any }) {
    const isOnline  = p.status === 'online';
    const isStopped = p.status === 'stopped';
    const isDextrip = DEXTRIP_PROCESSES.includes(p.name);
    return (
      <div style={{ background: 'var(--card-bg)', padding: '0.75rem 1.25rem', display: 'grid', gridTemplateColumns: '180px 70px 80px 70px 70px 60px', gap: '1rem', alignItems: 'center',
        borderLeft: `2px solid ${isOnline ? (isDextrip ? '#F0997B' : '#7a7870') : '#ff8080'}` }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--off-white)', fontWeight: 500 }}>{p.name}</div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.12rem 0.45rem', border: `1px solid ${isOnline ? 'rgba(93,202,165,0.3)' : 'rgba(255,128,128,0.3)'}`, color: isOnline ? '#5DCAA5' : '#ff8080' }}>
          {p.status ?? '—'}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)' }}>{fmtUptime(p.uptime)}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: p.restarts > 10 ? '#FAC775' : 'var(--muted)' }}>↺ {p.restarts ?? 0}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)' }}>{fmtMem(p.memory)}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)' }}>{p.cpu ?? 0}%</span>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">Bot Health</h1>
      <p className="page-sub">PM2 process monitor — all Dextrip services. Auto-refreshes every 15 seconds.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total processes', val: processes.length, color: 'var(--off-white)' },
          { label: 'Online',          val: online,           color: '#5DCAA5' },
          { label: 'Stopped',         val: stopped,          color: stopped > 0 ? '#FAC775' : '#7a7870' },
          { label: 'Last refresh',    val: lastRefresh || '—', color: '#c8f53a' },
        ].map(c => (
          <div key={c.label} style={{ background: 'var(--card-bg)', padding: '1rem 1.25rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', color: 'var(--muted)', letterSpacing: '0.1em', marginBottom: '0.35rem' }}>{c.label}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: 800, color: c.color, lineHeight: 1 }}>{c.val}</div>
          </div>
        ))}
      </div>

      {loading && <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', padding: '2rem' }}>Loading...</div>}

      {/* Table header */}
      {!loading && (
        <div style={{ display: 'grid', gridTemplateColumns: '180px 70px 80px 70px 70px 60px', gap: '1rem', padding: '0.5rem 1.25rem', marginBottom: '1px' }}>
          {['Process', 'Status', 'Uptime', 'Restarts', 'Memory', 'CPU'].map(h => (
            <span key={h} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>{h}</span>
          ))}
        </div>
      )}

      {dextripProcs.length > 0 && (
        <>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#F0997B', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Dextrip</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)', marginBottom: '1.25rem' }}>
            {dextripProcs.map(p => <ProcessRow key={p.id} p={p} />)}
          </div>
        </>
      )}

      {otherProcs.length > 0 && (
        <>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Other services</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
            {otherProcs.map(p => <ProcessRow key={p.id} p={p} />)}
          </div>
        </>
      )}

      {!loading && processes.length === 0 && (
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '2rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', textAlign: 'center' }}>
          No PM2 data. The HQ API needs to run on the same server as Dextrip to read pm2 jlist.
        </div>
      )}
    </div>
  );
}
