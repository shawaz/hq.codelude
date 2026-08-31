import { NextRequest, NextResponse } from 'next/server';
import { requireApiProject } from '@/lib/api-auth';
import { getProject, updateProject, type SiteProject, type SiteProjectStatus } from '@/lib/site-projects';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const guard = await requireApiProject(id);
  if (guard instanceof NextResponse) return guard;
  const project = getProject(id);
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(project);
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const guard = await requireApiProject(id);
  if (guard instanceof NextResponse) return guard;
  const { name, location, status, boundary, center, areaHectares } = await req.json();
  const patch: Partial<Pick<SiteProject, 'name' | 'location' | 'status' | 'boundary' | 'center' | 'areaHectares'>> = {};
  if (typeof name === 'string')     patch.name = name.trim();
  if (typeof location === 'string') patch.location = location.trim();
  if (typeof status === 'string')   patch.status = status as SiteProjectStatus;
  if (boundary === null || (boundary && typeof boundary === 'object')) patch.boundary = boundary ?? undefined;
  if (center === null) patch.center = undefined;
  else if (Array.isArray(center) && center.length === 2) patch.center = center as [number, number];
  if (typeof areaHectares === 'number' || areaHectares === null) patch.areaHectares = areaHectares ?? undefined;

  const project = updateProject(id, patch);
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(project);
}
