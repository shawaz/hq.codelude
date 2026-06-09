'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PROJECT_COLORS, type Project } from '@/lib/tasks';
import type { SiteProject, SiteProjectStatus } from '@/lib/site-projects';

const VENTURES: Project[] = ['Roborns', 'Franchiseen', 'HubCV', 'Cuestay', 'Dextrip'];

const STATUS_STYLES: Record<SiteProjectStatus, { color: string; label: string }> = {
  planning:  { color: '#FAC775', label: 'Planning'  },
  active:    { color: '#5DCAA5', label: 'Active'    },
  paused:    { color: '#7a7870', label: 'Paused'    },
  completed: { color: '#85B7EB', label: 'Completed' },
};

const inputStyle: React.CSSProperties = {
  background: 'var(--black)', border: '1px solid var(--card-border)', color: 'var(--off-white)',
  fontFamily: 'var(--font-mono)', fontSize: '0.78rem', padding: '0.75rem 1rem', outline: 'none', width: '100%',
};
const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)',
  letterSpacing: '0.12em', textTransform: 'uppercase',
};

export default function SiteProjectsBoard({ projects, initialVenture }: { projects: SiteProject[]; initialVenture?: Project }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [ventureId, setVentureId] = useState<Project>(initialVenture ?? 'Roborns');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState<SiteProjectStatus>('planning');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function openModal() {
    setName(''); setVentureId(initialVenture ?? 'Roborns'); setLocation(''); setStatus('planning');
    setBoundary(null);