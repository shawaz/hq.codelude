import { NextRequest, NextResponse } from 'next/server';
import { getAllProjects, createProject } from '@/lib/site-projects';
import type { Project } from '@/lib/tasks';

const KNOWN_VENTURES: Project[] = ['Roborns', 'Franchiseen', 'HubCV', 'Cuestay', 'Dextrip'];

export async function GET() {
  return NextResponse.json(getAllProjects());
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { ventureId, name, location, status, source, leadId, config } = body;

  if (!ventureId || !KNOWN_VENTURES.includes(ventureId)) {
    return NextResponse.json({ error: 'Valid ventureId required' }, { status: 400 });
  }
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
  });
  return NextResponse.json(project, { status: 201 });
}
