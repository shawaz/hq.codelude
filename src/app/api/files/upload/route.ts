import { NextRequest, NextResponse } from 'next/server';
import { saveFile, ensureDir } from '@/lib/files-upload';
import { UPLOAD_CATEGORIES, VENTURES, ALL_DEPARTMENTS, FILE_DEPARTMENTS } from '@/lib/files-upload-types';

export async function POST(request: NextRequest) {
  try {
    await ensureDir();

    const formData = await request.formData();
    const fileField = formData.get('file') as File | null;
    const venture = (formData.get('venture') as string) || 'Codelude';
    const department = (formData.get('department') as string) || '';
    const category = (formData.get('category') as string) || '';
    const notes = (formData.get('notes') as string) || '';

    if (!fileField) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate size (max 50MB)
    if (fileField.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: 'File exceeds 50MB limit' }, { status: 400 });
    }

    // Validate venture
    if (!VENTURES.includes(venture)) {
      return NextResponse.json({ error: `Invalid venture: ${venture}` }, { status: 400 });
    }

    // Validate department
    if (department && !ALL_DEPARTMENTS.includes(department)) {
      return NextResponse.json({ error: `Invalid department: ${department}` }, { status: 400 });
    }

    const buffer = Buffer.from(await fileField.arrayBuffer());
    const entry = await saveFile(
      buffer,
      fileField.name,
      venture,
      department,
      category,
      notes,
      fileField.type || 'application/octet-stream',
    );

    return NextResponse.json({
      success: true,
      file: {
        id: entry.id,
        name: entry.name,
        venture: entry.venture,
        department: entry.department,
        category: entry.category,
        format: entry.format,
        size: entry.size,
        date: entry.date,
        notes: entry.notes,
        downloadUrl: `/api/files/${entry.id}`,
      },
    });
  } catch (err: any) {
    console.error('File upload error:', err);
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 });
  }
}
