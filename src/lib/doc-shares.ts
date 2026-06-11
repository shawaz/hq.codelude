import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import type { Letterhead } from './markdown';

// Same dual-path idiom as the docs API: server path first, local fallback.
const DATA_PATHS = [
  '/home/centos/codelude/data',
  path.join(process.cwd(), 'data'),
];

function dataDir(): string {
  for (const p of DATA_PATHS) if (fs.existsSync(p)) return p;
  const fallback = DATA_PATHS[DATA_PATHS.length - 1];
  fs.mkdirSync(fallback, { recursive: true });
  return fallback;
}

function sharesFile(): string {
  return path.join(dataDir(), 'docs-shares.json');
}

export interface DocShare {
  token: string;
  slug: string;
  recipientEmail: string;
  letterhead: Letterhead;
  createdAt: string;
  expiresAt: string;
  revoked: boolean;
  views: string[]; // ISO timestamps of successful OTP-verified views
  otp?: { hash: string; expiresAt: string; attempts: number };
}

export function readShares(): DocShare[] {
  const file = sharesFile();
  if (!fs.existsSync(file)) return [];
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch {
    return [];
  }
}

export function writeShares(shares: DocShare[]): void {
  fs.writeFileSync(sharesFile(), JSON.stringify(shares, null, 2));
}

export function createShare(slug: string, recipientEmail: string, letterhead: Letterhead): DocShare {
  const now = new Date();
  const share: DocShare = {
    token: crypto.randomBytes(32).toString('hex'),
    slug,
    recipientEmail: recipientEmail.trim().toLowerCase(),
    letterhead,
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    revoked: false,
    views: [],
  };
  const shares = readShares();
  shares.push(share);
  writeShares(shares);
  return share;
}

export function findShare(token: string): DocShare | undefined {
  return readShares().find(s => s.token === token);
}

export function updateShare(token: string, patch: Partial<DocShare>): DocShare | undefined {
  const shares = readShares();
  const idx = shares.findIndex(s => s.token === token);
  if (idx === -1) return undefined;
  shares[idx] = { ...shares[idx], ...patch };
  writeShares(shares);
  return shares[idx];
}

export function isShareActive(share: DocShare): boolean {
  return !share.revoked && new Date(share.expiresAt).getTime() > Date.now();
}

export function hashOtp(otp: string): string {
  return crypto.createHash('sha256').update(otp).digest('hex');
}

export function generateOtp(): string {
  return crypto.randomInt(100000, 1000000).toString();
}
