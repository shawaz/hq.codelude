import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DOCS_PATHS = [
  '/home/centos/codelude/data/docs',
  path.join(process.cwd(), 'data', 'docs'),
];

function docsDir(): string {
  for (const p of DOCS_PATHS) if (fs.existsSync(p)) return p;
  const fallback = DOCS_PATHS[DOCS_PATHS.length - 1];
  fs.mkdirSync(fallback, { recursive: true });
  return fallback;
}

function safePath(slug: string): string {
  const safe = path.basename(slug).replace(/[^a-z0-9-_]/gi, '-');
  return path.join(docsDir(), `${safe}.md`);
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const file = safePath(slug);
  if (!fs.existsSync(file)) return NextResponse.json({ error: 'not found' }, { status: 404 });
  return NextResponse.json({ content: fs.readFileSync(file, 'utf-8') });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { content } = await req.json();
  if (typeof content !== 'string') return NextResponse.json({ error: 'invalid' }, { status: 400 });
  fs.writeFileSync(safePath(slug), content);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const file = safePath(slug);
  if (fs.existsSync(file)) fs.unlinkSync(file);
  return NextResponse.json({ ok: true });
}
