import { promises as fs } from 'fs';
import path from 'path';
import type { UploadFileCategory, UploadedFile } from './files-upload-types';

const DATA_DIR  = '/home/centos/codelude/data';
const FILES_DIR = path.join(DATA_DIR, 'files');
const MANIFEST  = path.join(DATA_DIR, 'files-manifest.json');

function extToFormat(ext: string): string {
  const map: Record<string, string> = {
    pdf: 'PDF', xlsx: 'XLSX', xls: 'XLSX', pptx: 'PPTX', ppt: 'PPTX',
    docx: 'DOCX', doc: 'DOCX', md: 'MD', markdown: 'MD',
    png: 'PNG/SVG', svg: 'PNG/SVG', jpg: 'PNG/SVG', jpeg: 'PNG/SVG', gif: 'PNG/SVG', webp: 'PNG/SVG',
    fig: 'Figma', html: 'HTML', htm: 'HTML', csv: 'CSV', json: 'JSON',
    txt: 'TXT', zip: 'ZIP', mp4: 'MP4', mov: 'MOV',
  };
  return map[ext.toLowerCase()] || ext.toUpperCase();
}

export async function ensureDir() {
  await fs.mkdir(FILES_DIR, { recursive: true });
}

/** Read the uploaded files manifest */
export async function readManifest(): Promise<UploadedFile[]> {
  try {
    const raw = await fs.readFile(MANIFEST, 'utf-8');
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : data.files ?? [];
  } catch {
    return [];
  }
}

/** Write the full manifest */
async function writeManifest(files: UploadedFile[]) {
  await fs.writeFile(MANIFEST, JSON.stringify(files, null, 2), 'utf-8');
}

/** Save an uploaded file to disk and register it in the manifest */
export async function saveFile(
  buffer: Buffer,
  originalName: string,
  venture: string,
  department: string,
  category: string,
  notes: string,
  mimeType: string,
): Promise<UploadedFile> {
  await ensureDir();

  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const ext = path.extname(originalName).replace(/^\./, '');
  const safeName = `${id}.${ext || 'bin'}`;
  const storagePath = path.join(FILES_DIR, safeName);

  await fs.writeFile(storagePath, buffer);

  const entry: UploadedFile = {
    id,
    name: originalName,
    originalName,
    venture,
    department,
    category,
    format: extToFormat(ext),
    size: buffer.length,
    date: new Date().toISOString().split('T')[0],
    notes: notes || '',
    mimeType,
    storagePath,
  };

  const manifest = await readManifest();
  manifest.unshift(entry);
  await writeManifest(manifest);

  return entry;
}

/** Get a file by ID */
export async function getFileById(id: string): Promise<UploadedFile | null> {
  const manifest = await readManifest();
  return manifest.find(f => f.id === id) ?? null;
}
