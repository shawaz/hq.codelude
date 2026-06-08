import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { getTaskExtra, addFile, deleteFile, uploadsDir } from '@/lib/task-data';

type Ctx = { params: Promise<{ id: string }> };

const MAX_SIZE = 25 * 1024 * 1024; // 25MB

function safeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-180);
}

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  return NextResponse.json(getTaskExtra(id).files);
}

export async function POST(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const form = await req.formData();
  const file = form.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File too large (25MB max)' }, { status: 413 });
  }

  const { dir, publicUrlBase } = uploadsDir(id);
  fs.mkdirSync(dir, { recursive: true });

  const stored = `${Date.now()}-${safeName(file.name)}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(path.join(dir, stored), buffer);

  const record = addFile(id, {
    name: file.name,
    url: `${publicUrlBase}/${stored}`,
    size: file.size,
    type: file.type || 'application/octet-stream',
  });

  return NextResponse.json(record);
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const fileId = req.nextUrl.searchParams.get('fileId');
  if (!fileId) return NextResponse.json({ error: 'fileId required' }, { status: 400 });

  const removed = deleteFile(id, fileId);
  if (removed) {
    const { dir } = uploadsDir(id);
    const stored = removed.url.split('/').pop();
    if (stored) {
      try { fs.unlinkSync(path.join(dir, stored)); } catch { /* already gone */ }
    }
  }
  return NextResponse.json({ ok: true });
}
