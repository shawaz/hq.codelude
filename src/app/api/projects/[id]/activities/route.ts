import { NextRequest, NextResponse } from 'next/server';
import { requireApiProject } from '@/lib/api-auth';
import { addActivity, updateActivity, removeActivity } from '@/lib/site-projects';
import type { ActivityStatus } from '@/lib/site-projects';

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const guard = await requireApiProject(id);
  if (guard instanceof NextResponse) return guard;
  const { title, notes, date, status } = await req.json();
  if (!title?.trim()) return NextResponse.json({ error: 'title required' }, { status: 400 });
  const activity = addActivity(id, { title: title.trim(), notes: notes?.trim() || undefined, date: date || undefined, status: (status as ActivityStatus) || 'planned' });
  if (!activity) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(activity, { status: 201 });
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const guard = await requireApiProject(id);
  if (guard instanceof NextResponse) return guard;
  const { activityId, status } = await req.json();
  if (!activityId || !status) return NextResponse.json({ error: 'activityId and status required' }, { status: 400 });
  const activity = updateActivity(id, activityId, status as ActivityStatus);
  if (!activity) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(activity);
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const guard = await requireApiProject(id);
  if (guard instanceof NextResponse) return guard;
  const activityId = req.nextUrl.searchParams.get('activityId');
  if (!activityId) return NextResponse.json({ error: 'activityId required' }, { status: 400 });
  removeActivity(id, activityId);
  return NextResponse.json({ ok: true });
}
