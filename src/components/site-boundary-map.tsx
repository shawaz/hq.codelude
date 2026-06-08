'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { TerraDraw, TerraDrawPolygonMode, TerraDrawSelectMode } from 'terra-draw';
import { TerraDrawMapLibreGLAdapter } from 'terra-draw-maplibre-gl-adapter';
import { area } from '@turf/area';
import { centroid } from '@turf/centroid';
import { polygon as turfPolygon } from '@turf/helpers';

export interface BoundaryResult {
  polygon: GeoJSON.Polygon;
  center: [number, number];
  areaHectares: number;
}

interface GeocodeHit { label: string; lon: number; lat: number; }

interface Props {
  /** Existing boundary to display read-only (ignored once the user starts drawing). */
  boundary?: GeoJSON.Polygon | null;
  /** Map center to use when no boundary is set. Defaults to a wide world view. */
  center?: [number, number] | null;
  /** When true, shows draw/search controls. When false, renders a static read-only view. */
  editable: boolean;
  height?: number;
  onChange?: (result: BoundaryResult | null) => void;
}

const SATELLITE_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    satellite: {
      type: 'raster',
      tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
      tileSize: 256,
      attribution: 'Esri, Maxar, Earthstar Geographics',
    },
  },
  layers: [{ id: 'satellite', type: 'raster', source: 'satellite' }],
};

const VIEW_SOURCE_ID = 'sb-existing-boundary';
const WORLD_CENTER: [number, number] = [20, 15];

function fromGeometry(geometry: GeoJSON.Polygon): BoundaryResult {
  const poly = turfPolygon(geometry.coordinates);
  const sqMeters = area(poly);
  const areaHectares = Math.round((sqMeters / 10000) * 100) / 100;
  const center = centroid(poly).geometry.coordinates as [number, number];
  return { polygon: geometry, center, areaHectares };
}

const btnStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase',
  padding: '0.55rem 1.1rem', border: '1px solid var(--accent)', color: 'var(--accent)',
  background: 'transparent', cursor: 'pointer',
};
const inputStyle: React.CSSProperties = {
  background: 'var(--black)', border: '1px solid var(--card-border)', color: 'var(--off-white)',
  fontFamily: 'var(--font-mono)', fontSize: '0.7rem', padding: '0.55rem 0.85rem', outline: 'none',
};

export default function SiteBoundaryMap({ boundary, center, editable, height = 380, onChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const drawRef = useRef<TerraDraw | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const initialCenter = center ?? (boundary ? fromGeometry(boundary).center : WORLD_CENTER);
  const initialZoom = boundary ? 13 : center ? 11 : 2;

  const [hasShape, setHasShape] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [areaHectares, setAreaHectares] = useState<number | null>(boundary ? fromGeometry(boundary).areaHectares : null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodeHit[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: SATELLITE_STYLE,
      center: initialCenter,
      zoom: initialZoom,
    });
    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

    const draw = new TerraDraw({
      adapter: new TerraDrawMapLibreGLAdapter({ map: map as any }),
      modes: [
        new TerraDrawPolygonMode(),
        new TerraDrawSelectMode({
          flags: {
            polygon: { feature: { draggable: true, coordinates: { midpoints: true, draggable: true, deletable: true } } },
          },
        }),
      ],
    });
    drawRef.current = draw;

    function showExistingBoundary() {
      if (!boundary) return;
      if (map.getLayer(`${VIEW_SOURCE_ID}-fill`)) return;
      map.addSource(VIEW_SOURCE_ID, { type: 'geojson', data: { type: 'Feature', properties: {}, geometry: boundary } });
      map.addLayer({ id: `${VIEW_SOURCE_ID}-fill`, type: 'fill', source: VIEW_SOURCE_ID, paint: { 'fill-color': '#5DCAA5', 'fill-opacity': 0.18 } });
      map.addLayer({ id: `${VIEW_SOURCE_ID}-line`, type: 'line', source: VIEW_SOURCE_ID, paint: { 'line-color': '#5DCAA5', 'line-width': 2 } });
      setHasShape(true);
    }

    function hideExistingBoundary() {
      if (map.getLayer(`${VIEW_SOURCE_ID}-fill`)) map.removeLayer(`${VIEW_SOURCE_ID}-fill`);
      if (map.getLayer(`${VIEW_SOURCE_ID}-line`)) map.removeLayer(`${VIEW_SOURCE_ID}-line`);
      if (map.getSource(VIEW_SOURCE_ID)) map.removeSource(VIEW_SOURCE_ID);
    }

    function syncFromSnapshot() {
      const snapshot = draw.getSnapshot();
      const feature = snapshot.find(f => f.geometry.type === 'Polygon');
      if (!feature) {
        setHasShape(false);
        setAreaHectares(null);
        onChangeRef.current?.(null);
        return;
      }
      const result = fromGeometry(feature.geometry as GeoJSON.Polygon);
      setHasShape(true);
      setAreaHectares(result.areaHectares);
      onChangeRef.current?.(result);
    }

    function handleFinish() {
      setDrawing(false);
      draw.setMode('select');
      syncFromSnapshot();
    }

    map.on('load', () => {
      draw.start();
      draw.setMode('static');
      showExistingBoundary();
    });

    draw.on('finish', handleFinish);
    draw.on('change', syncFromSnapshot);

    return () => {
      draw.off('finish', handleFinish);
      draw.off('change', syncFromSnapshot);
      hideExistingBoundary();
      draw.stop();
      map.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startDrawing() {
    const map = mapRef.current;
    const draw = drawRef.current;
    if (!draw || !map) return;
    if (map.getLayer(`${VIEW_SOURCE_ID}-fill`)) map.removeLayer(`${VIEW_SOURCE_ID}-fill`);
    if (map.getLayer(`${VIEW_SOURCE_ID}-line`)) map.removeLayer(`${VIEW_SOURCE_ID}-line`);
    if (map.getSource(VIEW_SOURCE_ID)) map.removeSource(VIEW_SOURCE_ID);
    draw.clear();
    setHasShape(false);
    setAreaHectares(null);
    onChangeRef.current?.(null);
    draw.setMode('polygon');
    setDrawing(true);
  }

  function clearShape() {
    const draw = drawRef.current;
    if (!draw) return;
    draw.clear();
    draw.setMode('static');
    setHasShape(false);
    setAreaHectares(null);
    setDrawing(false);
    onChangeRef.current?.(null);
  }

  async function runSearch() {
    if (!query.trim() || searching) return;
    setSearching(true);
    setResults([]);
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(query.trim())}`);
      const hits: GeocodeHit[] = await res.json();
      setResults(hits);
    } finally {
      setSearching(false);
    }
  }

  function flyToHit(hit: GeocodeHit) {
    mapRef.current?.flyTo({ center: [hit.lon, hit.lat], zoom: 12, essential: true });
    setResults([]);
    setQuery(hit.label);
  }

  return (
    <div>
      <div ref={containerRef} style={{ height, border: '1px solid var(--card-border)', position: 'relative' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.85rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {editable && (
            <div style={{ position: 'relative' }}>
              <input
                style={{ ...inputStyle, width: 220 }}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); runSearch(); }
                }}
                placeholder="Search a place to jump to…"
              />
              {results.length > 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 5, background: 'var(--card-bg)', border: '1px solid var(--card-border)', maxHeight: 180, overflowY: 'auto' }}>
                  {results.map((r, i) => (
                    <button key={i} type="button" onClick={() => flyToHit(r)} style={{
                      display: 'block', width: '100%', textAlign: 'left', padding: '0.5rem 0.7rem', border: 'none',
                      background: 'transparent', color: 'var(--off-white)', fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                      cursor: 'pointer', borderBottom: '1px solid var(--card-border)',
                    }}>{r.label}</button>
                  ))}
                </div>
              )}
            </div>
          )}
          {editable && !hasShape && !drawing && (
            <button type="button" onClick={startDrawing} style={btnStyle}>
              Draw site boundary →
            </button>
          )}
          {editable && drawing && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--accent)', letterSpacing: '0.08em' }}>
              Click to place each corner · click the first point again to finish
            </span>
          )}
          {editable && hasShape && !drawing && (
            <button type="button" onClick={clearShape} style={btnStyle}>
              Clear &amp; redraw
            </button>
          )}
          {!editable && !hasShape && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)' }}>
              No boundary marked for this site yet.
            </span>
          )}
        </div>
        {areaHectares != null && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)' }}>
            Marked area: <strong style={{ color: 'var(--off-white)' }}>{areaHectares.toLocaleString()} ha</strong>
          </span>
        )}
      </div>
    </div>
  );
}
