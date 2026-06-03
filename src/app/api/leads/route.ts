import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

const LEADS_FILE = process.env.LEADS_FILE || '/home/centos/codelude/data/leads.json';

function readLeads(): Record<string, unknown>[] {
  try {
    if (fs.existsSync(LEADS_FILE)) return JSON.parse(fs.readFileSync(LEADS_FILE, 'utf-8'));
  } catch {}
  return [];
}

function writeLeads(leads: Record<string, unknown>[]) {
  const dir = path.dirname(LEADS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, interest, config, message, source } = await req.json();
    if (!name?.trim() || !email?.trim() || !interest) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const lead = {
      id: `ROB-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      interest,
      config: config || '',
      message: message?.trim() || '',
      source: source || 'roborns.com',
      venture: 'Roborns',
      date: new Date().toISOString(),
      status: 'new',
    };
    const leads = readLeads();
    leads.unshift(lead);
    writeLeads(leads);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(readLeads());
}
