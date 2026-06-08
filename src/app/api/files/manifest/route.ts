import { NextResponse } from 'next/server';
import { readManifest } from '@/lib/files-upload';

export async function GET() {
  try {
    const files = await readManifest();
    return NextResponse.json({ files });
  } catch (err: any) {
    console.error('Manifest read error:', err);
    return NextResponse.json({ error: err.message || 'Failed to read manifest' }, { status: 500 });
  }
}
