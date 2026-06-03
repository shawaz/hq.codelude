import fs from 'fs';
import LeadsClient from './LeadsClient';

const LEADS_FILE = process.env.LEADS_FILE || '/home/centos/codelude/data/leads.json';

function readLeads() {
  try {
    if (fs.existsSync(LEADS_FILE)) {
      return JSON.parse(fs.readFileSync(LEADS_FILE, 'utf-8'));
    }
  } catch {}
  return [];
}

export default function LeadsPage() {
  const leads = readLeads();
  return <LeadsClient initialLeads={leads} />;
}
