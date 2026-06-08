import { NextRequest, NextResponse } from 'next/server';
import { getFileById } from '@/lib/files-upload';
import { promises as fs } from 'fs';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const file = await getFileById(id);

    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const buffer = await fs.readFile(file.storagePath);

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': file.mimeType || 'application/octet-stream',
        'Content-Disposition': `inline; filename="${file.originalName}"`,
        'Content-Length': String(file.size),
      },
    });
  } catch (err: any) {
    console.error('File download error:', err);
    return NextResponse.json({ error: err.message || 'Download failed' }, { status: 500 });
  }
}
