import { NextRequest, NextResponse } from 'next/server';
import { addTask, updateTask, removeTask } from '@/lib/site-projects';
import type { Status } from '@/lib/tasks';

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const { title, assignee, dueDate } = await req.json();
  if (!title?.trim()) return NextResponse.json({ error: 'title required' }, { status: 400 });
  const task = addTask(id, { title: title.trim(), status: 'todo', assignee: assignee?.trim() || undefined, dueDate: dueDate || undefined });
  if (!task) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(task, { status: 201 });
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const { taskId, status } = await req.json();
  if (!taskId || !status) return NextResponse.json({ error: 'taskId and status required' }, { status: 400 });
  const task = updateTask(id, taskId, status as Status);
  if (!task) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(task);
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const taskId = req.nextUrl.searchParams.get('taskId');
  if (!taskId) return NextResponse.json({ error: 'taskId required' }, { status: 400 });
  removeTask(id, taskId);
  return NextResponse.json({ ok: true });
}
