import fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';

const LEADS_FILE = process.env.LEADS_FILE || '/home/centos/codelude/data/leads.json';

function readLeads(): Record<string, unknown>[] {
  try {
    if (fs.existsSync(LEADS_FILE)) return JSON.parse(fs.readFileSync(LEADS_FILE, 'utf-8'));
  } catch {}
  return [];
}

const VALID_STATUSES = ['new', 'qualified', 'meeting-booked', 'proposal-sent', 'negotiating'];

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { status } = await req.json();
    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }
    const leads = readLeads();
    const idx = leads.findIndex((l) => l.id === id);
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    leads[idx] = { ...leads[idx], status };
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
