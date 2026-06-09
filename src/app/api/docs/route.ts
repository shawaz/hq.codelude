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

export async function GET() {
  const dir = docsDir();
  const files = fs.readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .map(f => {
      const full = path.join(dir, f);
      const stat = fs.statSync(full);
      const content = fs.readFileSync(full, 'utf-8');
      const firstLine = content.split('\n').find(l => l.startsWith('# '));
      const title = firstLine ? firstLine.replace(/^#\s+/, '') : f.replace('.md', '');
      return {
        slug: f.replace('.md', ''),
        title,
        size: stat.size,
        updatedAt: stat.mtime.toISOString(),
      };
    })
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return NextResponse.json(files);
}

export async function POST(req: NextRequest) {
  const { slug, content } = await req.json();
  if (!slug || typeof content !== 'string') return NextResponse.json({ error: 'invalid' }, { status: 400 });
  const safe = slug.replace(/[^a-z0-9-_]/gi, '-').toLowerCase();
  const file = path.join(docsDir(), `${safe}.md`);
  fs.writeFileSync(file, content);
  return NextResponse.json({ slug: safe });
}
