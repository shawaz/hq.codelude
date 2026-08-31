#!/usr/bin/env node
/**
 * Bulk-load a CSV registry export (UDISE+ schools, AISHE colleges, MCA
 * business data) into the prospect_orgs table.
 *
 *   node scripts/import-pipeline.mjs <csv> --venture HubCV --segment school [--stage prospect] [--prod]
 *
 * The CSV needs a header row. Recognised columns (case/space-insensitive):
 *   name | school_name | college_name   -> name          (required)
 *   code | udise_code | aishe_code | cin -> code         (used to dedupe)
 *   category | management | type         -> category
 *   state | state_name                   -> state
 *   district | district_name             -> district
 *   city | block | town                  -> city
 *   email, phone, website, size|students|enrolment
 *
 * Rows are sent in batches; re-running is safe because rows with a `code`
 * already present are skipped server-side.
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const BATCH = 200;

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith("--"));
const flag = (n, d) => {
  const i = args.indexOf(`--${n}`);
  return i === -1 ? d : args[i + 1];
};
const venture = flag("venture");
const segment = flag("segment");
const stage = flag("stage", "prospect");
const prod = args.includes("--prod");

if (!file || !venture || !segment) {
  console.error("usage: node scripts/import-pipeline.mjs <csv> --venture <V> --segment <S> [--stage prospect] [--prod]");
  process.exit(1);
}

/** Minimal RFC4180 parser — handles quoted fields containing commas/newlines. */
function parseCsv(text) {
  const rows = [];
  let row = [], field = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else quoted = false;
      } else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else if (c !== "\r") field += c;
  }
  if (field !== "" || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

const norm = (h) => h.trim().toLowerCase().replace(/[\s_-]+/g, "");
const ALIASES = {
  name: ["name", "schoolname", "collegename", "institutionname", "companyname"],
  code: ["code", "udisecode", "udiseplus", "aishecode", "cin", "registrationnumber"],
  category: ["category", "management", "type", "schooltype", "collegetype"],
  state: ["state", "statename"],
  district: ["district", "districtname"],
  city: ["city", "block", "town", "village", "location"],
  email: ["email", "emailid", "mail"],
  phone: ["phone", "mobile", "contact", "phoneno", "contactnumber"],
  website: ["website", "url", "web"],
  size: ["size", "students", "enrolment", "enrollment", "totalstudents", "headcount"],
};

const rows = parseCsv(readFileSync(file, "utf8"));
const header = rows[0].map(norm);
const col = {};
for (const [key, names] of Object.entries(ALIASES)) {
  const i = header.findIndex((h) => names.includes(h));
  if (i !== -1) col[key] = i;
}
if (col.name === undefined) {
  console.error(`No name column found. Header: ${rows[0].join(", ")}`);
  process.exit(1);
}

const records = [];
for (const r of rows.slice(1)) {
  const get = (k) => {
    const i = col[k];
    if (i === undefined) return undefined;
    const v = (r[i] ?? "").trim();
    return v === "" ? undefined : v;
  };
  const name = get("name");
  if (!name) continue;
  const sizeRaw = get("size");
  const size = sizeRaw && !Number.isNaN(Number(sizeRaw)) ? Number(sizeRaw) : undefined;
  records.push({
    venture, segment, name,
    code: get("code"), category: get("category"), state: get("state"),
    district: get("district"), city: get("city"), email: get("email"),
    phone: get("phone"), website: get("website"), size,
    status: "identified", priority: "medium", source: "import",
  });
}

console.log(`Parsed ${records.length} rows from ${file}. Importing to ${prod ? "prod" : "dev"} as ${stage}…`);

let inserted = 0, skipped = 0;
for (let i = 0; i < records.length; i += BATCH) {
  const batch = records.slice(i, i + BATCH);
  const cmd = ["convex", "run", "pipeline:bulkImport", JSON.stringify({ stage, rows: batch })];
  if (prod) cmd.push("--prod");
  const out = execFileSync("npx", cmd, { encoding: "utf8", maxBuffer: 1 << 26 });
  const res = JSON.parse(out);
  inserted += res.inserted; skipped += res.skipped;
  const done = Math.min(i + BATCH, records.length);
  process.stdout.write(`\r  ${done}/${records.length}  inserted=${inserted} skipped=${skipped}`);
}
console.log(`\nDone. inserted=${inserted} skipped=${skipped}`);
