/**
 * The tool catalog, in a form the browser can hold.
 *
 * The agent form needs to offer tool names as checkboxes, but src/lib/ai-tools.ts
 * imports every department dataset — finance, legal, sales, plans — to answer
 * with. Importing it into a client component would ship all of that to the
 * browser. This file has no imports at all.
 *
 * ai-tools.ts keeps TOOL_SPECS as the execution truth and asserts the two lists
 * agree (see assertCatalogMatchesSpecs), so a tool added there without a catalog
 * entry is a build-time failure rather than a checkbox that silently never
 * appears.
 *
 * `writes` marks the tools that change HQ records. The form groups on it, so
 * granting an agent write access is a deliberate act rather than a long
 * undifferentiated list.
 */

export interface AgentToolInfo {
  name: string;
  label: string;
  description: string;
  writes: boolean;
}

export const AGENT_TOOLS: AgentToolInfo[] = [
  // ── Reads ────────────────────────────────────────────────────────────────
  {
    name: 'get_department_data',
    label: 'Read any department',
    description: 'Finance, Management, Operations, Sales, Marketing, People, Legal, Support, Software, Plan.',
    writes: false,
  },
  { name: 'list_tasks',        label: 'List tasks',        description: 'Tasks with status, priority, category and dates.',      writes: false },
  { name: 'list_positions',    label: 'List open roles',   description: 'Open positions and their hiring stage.',               writes: false },
  { name: 'list_applications', label: 'List applications', description: 'Candidate applications and their status.',             writes: false },
  { name: 'list_offices',      label: 'List offices',      description: 'Office locations and headcount.',                      writes: false },
  { name: 'pipeline_summary',  label: 'Pipeline summary',  description: 'Counts and samples across prospects, leads, deals, clients.', writes: false },

  // ── Writes ───────────────────────────────────────────────────────────────
  { name: 'create_task',          label: 'Create tasks',        description: 'Add a task to a venture.',                         writes: true },
  { name: 'update_task',          label: 'Update tasks',        description: 'Change a task title, category, priority or due date.', writes: true },
  { name: 'set_task_status',      label: 'Move task status',    description: 'Move a task to todo, in-progress or done.',        writes: true },
  { name: 'assign_task',          label: 'Assign tasks',        description: 'Hand a task to a teammate or another agent.',      writes: true },
  { name: 'toggle_task_today',    label: "Set today's focus",   description: "Add or remove a task from today's list.",          writes: true },
  { name: 'create_pipeline_org',  label: 'Create pipeline org', description: 'Add a prospect, lead, deal or client.',            writes: true },
  { name: 'create_position',      label: 'Open a role',         description: 'Create a hiring position.',                       writes: true },
  { name: 'set_position_status',  label: 'Move role status',    description: 'Move a position through hiring.',                  writes: true },
  { name: 'create_application',   label: 'Add a candidate',     description: 'Create a candidate application.',                  writes: true },
  { name: 'set_application_status', label: 'Move candidate',    description: 'Move an application through its stages.',          writes: true },
];

/** Catalog entry for a tool name, if it has one. */
export const agentTool = (name: string): AgentToolInfo | undefined =>
  AGENT_TOOLS.find((t) => t.name === name);

/** Read-only tools — the sensible default for a new agent. */
export const READ_ONLY_TOOL_NAMES: string[] = AGENT_TOOLS
  .filter((t) => !t.writes)
  .map((t) => t.name);
