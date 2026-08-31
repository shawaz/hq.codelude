import { NextRequest, NextResponse } from 'next/server';
import { getAllProjects, createProject } from '@/lib/site-projects';
import { requireApiAccess, requireApiPage } from '@/lib/api-auth';
import { VENTURES } from '@/lib/ventures';
import { venturesForPage } from '@/lib/nav';

const KNOWN_VENTURES = VENTURES.map(v => v.name);

export async function GET() {
  const auth = await requireApiPage('projects');
  if (auth instanceof NextResponse) return auth;
  // Scoped members see only their own ventures' projects.
  const allowed = new Set(venturesForPage(auth, 'projects'));
  return NextResponse.json(
    getAllProjects().filter(p => allowed.has(p.ventureId)),
  );
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { ventureId, name, location, status, source, leadId, config, boundary, center, areaHectares } = body;

  if (!ventureId || !KNOWN_VENTURES.includes(ventureId)) {
    return NextResponse.json({ error: 'Valid ventureId required' }, { status: 400 });
  }
  const auth = await requireApiAccess(ventureId, 'projects');
  if (auth instanceof NextResponse) return auth;
  if (!name?.trim() || !location?.trim()) {
    return NextResponse.json({ error: 'name and location required' }, { status: 400 });
  }
  if (source !== 'lead' && source !== 'manual') {
    return NextResponse.json({ error: 'source must be "lead" or "manual"' }, { status: 400 });
  }

  const project = createProject({
    ventureId,
    name: name.trim(),
    location: location.trim(),
    status,
    source,
    leadId: leadId || undefined,
    config: config || undefined,
    boundary: boundary || undefined,
    center: Array.isArray(center) && center.length === 2 ? (center as [number, number]) : undefined,
    areaHectares: typeof areaHectares === 'number' ? areaHectares : undefined,
  });
  return NextResponse.json(project, { status: 201 });
}
