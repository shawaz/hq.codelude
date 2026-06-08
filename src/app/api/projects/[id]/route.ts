import { NextRequest, NextResponse } from 'next/server';
import { getProject, updateProject } from '@/lib/site-projects';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(project);
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const { name, location, status } = await req.json();
  const patch: Record<string, string> = {};
  if (typeof name === 'string')     patch.name = name.trim();
  if (typeof location === 'string') patch.location = location.trim();
  if (typeof status === 'string')   patch.status = status;

  const project = updateProject(id, patch);
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(project);
}
