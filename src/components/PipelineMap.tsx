'use client';

/**
 * Pipeline geography — where prospects, leads, deals and clients actually are.
 *
 * Records carry city/district/state as text; only the public site-enquiry form
 * sets coordinates. scripts/geocode-pipeline.mjs backfills the rest once, so
 * this renders whatever has a `center` and says so plainly when that is nothing.
 *
 * The basemap is CARTO's greyscale raster, swapped by theme. Satellite imagery
 * (what site-boundary-map uses) is the wrong register here — this is a data
 * view, and the markers should be the only thing with weight.
 */

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export interface MapPoint {
  _id: string;
  name: string;
  stage: string;
  venture: string;
  segment: string;
  status: string;
  city?: string;
  state?: string;
  value?: string;
  center: number[];
}

/** Monochrome, so stages read by weight rather than hue. */
const STAGE_STYLE: Record<string, { size: number; fill: string; label: string }> = {
  prospect: { size: 8,  fill: '#a5a5a5', label: 'Prospect' },
  lead:     { size: 10, fill: '#c8c8c8', label: 'Lead'     },
  deal:     { size: 12, fill: '#dbdbdb', label: 'Deal'     },
  client:   { size: 14, fill: '#eeeeee', label: 'Client'   },
};

function basemap(theme: 'light' | 'dark'): maplibregl.StyleSpecification {
  const set = theme === 'dark' ? 'dark_all' : 'light_all';
  return {
    version: 8,
    sources: {
      carto: {
        type: 'raster',
        tiles: [`https://a.basemaps.cartocdn.com/${set}/{z}/{x}/{y}@2x.png`],
        tileSize: 256,
        attribution: '© OpenStreetMap contributors © CARTO',
      },
    },
    layers: [{ id: 'carto', type: 'raster', source: 'carto' }],
  };
}

export default function PipelineMap({ points, height = 520 }: { points: MapPoint[]; height?: number }) {
  const holder = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markers = useRef<maplibregl.Marker[]>([]);
  const [selected, setSelected] = useState<MapPoint | null>(null);

  // Read the theme off the document rather than a prop — ThemeToggle writes it
  // there, so this stays correct without threading state through the page.
  const theme: 'light' | 'dark' =
    typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'light'
      ? 'light' : 'dark';

  useEffect(() => {
    if (!holder.current || map.current) return;
    map.current = new maplibregl.Map({
      container: holder.current,
      style: basemap(theme),
      center: [77.5, 15.3],   // Karnataka — where the pipeline actually is
      zoom: 4.6,
      attributionControl: { compact: true },
    });
    map.current.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    return () => { map.current?.remove(); map.current = null; };
  }, [theme]);

  // Redraw markers whenever the filtered set changes.
  useEffect(() => {
    const m = map.current;
    if (!m) return;

    markers.current.forEach(mk => mk.remove());
    markers.current = [];

    for (const p of points) {
      const style = STAGE_STYLE[p.stage] ?? STAGE_STYLE.prospect;
      const el = document.createElement('button');
      el.setAttribute('aria-label', `${p.name} — ${style.label}`);
      el.style.cssText = [
        `width:${style.size}px`, `height:${style.size}px`,
        `background:${style.fill}`,
        'border:1px solid rgba(0,0,0,0.55)', 'border-radius:50%',
        'cursor:pointer', 'padding:0', 'display:block',
      ].join(';');
      el.onclick = e => { e.stopPropagation(); setSelected(p); };

      markers.current.push(
        new maplibregl.Marker({ element: el })
          .setLngLat([p.center[0], p.center[1]])
          .addTo(m),
      );
    }

    // Frame the data rather than leaving the user at a default zoom.
    if (points.length > 0) {
      const b = new maplibregl.LngLatBounds();
      points.forEach(p => b.extend([p.center[0], p.center[1]]));
      m.fitBounds(b, { padding: 60, maxZoom: 9, duration: 400 });
    }
  }, [points]);

  return (
    <div style={{ position: 'relative', border: '1px solid var(--card-border)' }}>
      <div ref={holder} style={{ height, width: '100%' }} />

      {/* Legend */}
      <div style={{
        position: 'absolute', left: 12, bottom: 12, zIndex: 2,
        background: 'var(--card-bg)', border: '1px solid var(--card-border)',
        padding: '0.5rem 0.7rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap',
      }}>
        {Object.entries(STAGE_STYLE).map(([k, s]) => (
          <span key={k} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)' }}>
            <span style={{ width: s.size, height: s.size, background: s.fill, borderRadius: '50%', border: '1px solid rgba(0,0,0,0.55)' }} />
            {s.label}
          </span>
        ))}
      </div>

      {selected && (
        <div style={{
          position: 'absolute', right: 12, top: 12, zIndex: 2, width: 240,
          background: 'var(--card-bg)', border: '1px solid var(--card-border)',
          borderLeft: `2px solid ${(STAGE_STYLE[selected.stage] ?? STAGE_STYLE.prospect).fill}`,
          padding: '0.85rem 1rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', alignItems: 'flex-start' }}>
            <div style={{ fontWeight: 600, fontSize: '0.8rem', lineHeight: 1.35 }}>{selected.name}</div>
            <button onClick={() => setSelected(null)} style={{
              background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)',
              fontFamily: 'var(--font-mono)', fontSize: '0.7rem', padding: 0, lineHeight: 1,
            }}>×</button>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', marginTop: '0.35rem', lineHeight: 1.7 }}>
            {(STAGE_STYLE[selected.stage] ?? STAGE_STYLE.prospect).label} · {selected.status}
            <br />{selected.venture} · {selected.segment}
            {(selected.city || selected.state) && <><br />{[selected.city, selected.state].filter(Boolean).join(', ')}</>}
            {selected.value && <><br />{selected.value}</>}
          </div>
        </div>
      )}
    </div>
  );
}
