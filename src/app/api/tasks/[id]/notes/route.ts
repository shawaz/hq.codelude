import { NextRequest, NextResponse } from 'next/server';
import { requireApiPage } from '@/lib/api-auth';
import { getTaskExtra, addNote, deleteNote } from '@/lib/task-data';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const guard = await requireApiPage('tasks');
  if (guard instanceof NextResponse) return guard;
  return NextResponse.json(getTaskExtra(id).notes);
}

export async function POST(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const guard = await requireApiPage('tasks');
  if (guard instanceof NextResponse) return guard;
  const { text } = await req.json();
  if (!text || !text.trim()) {
    return NextResponse.json({ error: 'Note text required' }, { status: 400 });
  }
  return NextResponse.json(addNote(id, text.trim()));
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const guard = await requireApiPage('tasks');
  if (guard instanceof NextResponse) return guard;
  const noteId = req.nextUrl.searchParams.get('noteId');
  if (!noteId) return NextResponse.json({ error: 'noteId required' }, { status: 400 });
  deleteNote(id, noteId);
  return NextResponse.json({ ok: true });
}
