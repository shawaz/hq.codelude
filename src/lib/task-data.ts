import fs from 'fs';
import path from 'path';

export interface TaskNote { id: string; text: string; createdAt: string; }
export interface TaskFile { id: string; name: string; url: string; size: number; type: string; uploadedAt: string; }
export interface TaskExtra { notes: TaskNote[]; files: TaskFile[]; }

const DATA_PATHS = [
  process.env.TASK_DATA_FILE,
  '/home/centos/codelude/data/task-data.json',
  path.join(process.cwd(), 'data', 'task-data.json'),
].filter(Boolean) as string[];

const UPLOAD_DIRS = [
  process.env.TASK_UPLOADS_DIR,
  '/home/centos/codelude/data/uploads/tasks',
  path.join(process.cwd(), 'public', 'uploads', 'tasks'),
].filter(Boolean) as string[];

function resolvePath(candidates: string[]): string {
  for (const p of candidates) if (fs.existsSync(p)) return p;
  for (const p of candidates) if (fs.existsSync(path.dirname(p))) return p;
  return candidates[candidates.length - 1];
}

function dataPath(): string { return resolvePath(DATA_PATHS); }

export function uploadsDir(taskId: string): { dir: string; publicUrlBase: string } {
  const base = resolvePath(UPLOAD_DIRS);
  const dir = path.join(base, taskId);
  // Files saved under the project's public/ dir are served at /uploads/tasks/<id>/...
  const isPublicDir = base.includes(path.join('public', 'uploads', 'tasks'));
  const publicUrlBase = isPublicDir
    ? `/uploads/tasks/${taskId}`
    : `/api/tasks/${taskId}/files/raw`;
  return { dir, publicUrlBase };
}

function readAll(): Record<string, TaskExtra> {
  try {
    const p = dataPath();
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf-8'));
  } catch { /* ignore — start fresh */ }
  return {};
}

function writeAll(data: Record<string, TaskExtra>) {
  const p = dataPath();
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(data, null, 2));
}

function entryFor(all: Record<string, TaskExtra>, taskId: string): TaskExtra {
  return all[taskId] ?? { notes: [], files: [] };
}

function genId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function getTaskExtra(taskId: string): TaskExtra {
  return entryFor(readAll(), taskId);
}

export function addNote(taskId: string, text: string): TaskNote {
  const all = readAll();
  const entry = entryFor(all, taskId);
  const note: TaskNote = { id: genId('note'), text, createdAt: new Date().toISOString() };
  entry.notes = [note, ...entry.notes];
  all[taskId] = entry;
  writeAll(all);
  return note;
}

export function deleteNote(taskId: string, noteId: string) {
  const all = readAll();
  const entry = all[taskId];
  if (!entry) return;
  entry.notes = entry.notes.filter(n => n.id !== noteId);
  writeAll(all);
}

export function addFile(taskId: string, file: Omit<TaskFile, 'id' | 'uploadedAt'>): TaskFile {
  const all = readAll();
  const entry = entryFor(all, taskId);
  const record: TaskFile = { ...file, id: genId('file'), uploadedAt: new Date().toISOString() };
  entry.files = [record, ...entry.files];
  all[taskId] = entry;
  writeAll(all);
  return record;
}

export function deleteFile(taskId: string, fileId: string): TaskFile | undefined {
  const all = readAll();
  const entry = all[taskId];
  if (!entry) return undefined;
  const removed = entry.files.find(f => f.id === fileId);
  entry.files = entry.files.filter(f => f.id !== fileId);
  writeAll(all);
  return removed;
}
