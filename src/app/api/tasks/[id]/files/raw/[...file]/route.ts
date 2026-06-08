import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { uploadsDir } from '@/lib/task-data';

type Ctx = { params: Promise<{ id: string; file: string[] }> };

// Serves uploaded files when they live outside the Next.js public/ dir
// (e.g. the production data directory), since those aren't reachable as static assets.
export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id, file } = await params;
  const { dir } = uploadsDir(id);
  const target = path.join(dir, ...file);

  if (!target.startsWith(dir) || !fs.existsSync(target)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const buffer = fs.readFileSync(target);
  return new NextResponse(buffer, {
    headers: { 'Content-Disposition': `inline; filename="${path.basename(target)}"` },
  });
}
