'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { SiteProjectStatus } from '@/lib/site-projects';
import { parseInfraLocation } from '@/lib/lead-conversion';

const STATUS_OPTIONS: { value: SiteProjectStatus; label: string }[] = [
  { value: 'planning',  label: 'Planning'  },
  { value: 'active',    label: 'Active'    },
  { value: 'paused',    label: 'Paused'    },
  { value: 'completed', label: 'Completed' },
];

const inputStyle: React.CSSProperties = {
  background: 'var(--black)', border: '1px solid var(--card-border)', color: 'var(--off-white)',
  fontFamily: 'var(--font-mono)', fontSize: '0.78rem', padding: '0.75rem 1rem', outline: 'none', width: '100%',
};
const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)',
  letterSpacing: '0.12em', textTransform: 'uppercase',
};

interface LeadForConversion {
  id: string;
  name: string;
  venture: string;
  config?: string;
  boundary?: GeoJSON.Polygon;
  center?: [number, number];
  areaHectares?: number;
}

export default function ConvertToProjectButton({ lead }: { lead: LeadForConversion }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState<SiteProjectStatus>('planning');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function openModal() {
    const parsedLocation = parseInfraLocation(lead.config);
    setName(`${lead.venture} — ${parsedLocation || lead.name}`);
    setLocation(parsedLocation);
    setStatus('planning');
    setSaving(false);
    setError('');
    setOpen(true);
  }

  async function handleConvert(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ventureId: lead.venture,
          name, location, status,
          source: 'lead',
          leadId: lead.id,
          config: lead.config,
          boundary: lead.boundary,
          center: lead.center,
          areaHectares: lead.areaHectares,
        }),
      });
      if (!res.ok) throw new Error();
      const project = await res.json();
      setOpen(false);
      router.push(`/dashboard/projects/${project.id}`);
    } catch {
      setError('Failed to convert lead. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <button onClick={openModal} style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.56rem', letterSpacing: '0.1em', textTransform: 'uppercase',
        padding: '0.3rem 0.7rem', border: '1px solid var(--accent)', color: 'var(--accent)',
        background: 'transparent', cursor: 'pointer', whiteSpace: 'nowrap',
      }}>
        Convert to project →
      </button>

      {open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
          onClick={() => setOpen(false)}>
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', maxWidth: 480, width: '100%', padding: '2rem' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--accent)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Convert lead to site project</div>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.3rem' }}>{lead.name}</div>
            {lead.config && (
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', lineHeight: 1.6, marginBottom: lead.boundary ? '0.5rem' : '1.5rem' }}>{lead.config}</div>
            )}
            {lead.boundary && (
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--accent)', letterSpacing: '0.06em', marginBottom: '1.5rem' }}>
                ✓ Site boundary marked on submission — {lead.areaHectares?.toLocaleString()} ha. Will carry over to the new project.
              </div>
            )}

            <form onSubmit={handleConvert} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={labelStyle}>Project name</label>
                <input style={inputStyle} type="text" value={name} onChange={e => setName(e.target.value)} required autoFocus />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1.4 }}>
                  <label style={labelStyle}>Location</label>
                  <input style={inputStyle} type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. West Coast, India" required />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
                  <label style={labelStyle}>Status</label>
                  <select style={inputStyle} value={status} onChange={e => setStatus(e.target.value as SiteProjectStatus)}>
                    {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>
              {error && <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#ff8080' }}>{error}</div>}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="submit" disabled={saving} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em', background: 'var(--accent)', color: 'var(--black)', border: 'none', padding: '0.75rem 1.5rem', cursor: 'pointer', fontWeight: 600 }}>
                  {saving ? 'Converting...' : 'Convert →'}
                </button>
                <button type="button" onClick={() => setOpen(false)} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em', background: 'transparent', color: 'var(--muted)', border: '1px solid var(--card-border)', padding: '0.75rem 1.5rem', cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
