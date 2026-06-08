import fs from 'fs';
import path from 'path';
import type { Project, Status } from '@/lib/tasks';

export type SiteProjectStatus = 'planning' | 'active' | 'paused' | 'completed';
export type ActivityStatus = 'planned' | 'in-progress' | 'done';

export interface BudgetLine  { id: string; label: string; category: string; amount: number; currency: string; notes?: string; }
export interface TeamMember  { id: string; name: string; role: string; contact?: string; }
export interface ProjectTask { id: string; title: string; status: Status; assignee?: string; dueDate?: string; }
export interface Activity    { id: string; title: string; notes?: string; date: string; status: ActivityStatus; }

export interface SiteProject {
  id: string;
  ventureId: Project;
  name: string;
  location: string;
  status: SiteProjectStatus;
  source: 'lead' | 'manual';
  leadId?: string;
  config?: string;
  budget: BudgetLine[];
  team: TeamMember[];
  tasks: ProjectTask[];
  activities: Activity[];
  createdAt: string;
}

const DATA_PATHS = [
  process.env.SITE_PROJECTS_FILE,
  '/home/centos/codelude/data/site-projects.json',
  path.join(process.cwd(), 'data', 'site-projects.json'),
].filter(Boolean) as string[];

function resolvePath(candidates: string[]): string {
  for (const p of candidates) if (fs.existsSync(p)) return p;
  for (const p of candidates) if (fs.existsSync(path.dirname(p))) return p;
  return candidates[candidates.length - 1];
}

function dataPath(): string { return resolvePath(DATA_PATHS); }

function genId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

const SEED_PROJECTS: SiteProject[] = [
  {
    id: 'SP-seed-mangaluru',
    ventureId: 'Roborns',
    name: 'Roborns Coastal Site — Mangaluru',
    location: 'Uchila Thalapady, Mangaluru',
    status: 'planning',
    source: 'manual',
    config: 'West Coast, India · $10M – $50M (Pilot Infrastructure) · 2 MW compute · 15 kL/day water · 30 t/mo minerals',
    budget: [
      { id: genId('bl'), label: 'Coastal land lease (1 acre)', category: 'Land', amount: 0, currency: 'INR', notes: 'Lease value TBD — pending site survey and permits' },
    ],
    team: [],
    tasks: [
      { id: genId('pt'), title: 'Coastal site survey — Mangaluru', status: 'in-progress' },
      { id: genId('pt'), title: 'Coastal land lease / acquisition', status: 'todo' },
      { id: genId('pt'), title: 'Coastal construction permits (Govt)', status: 'todo' },
    ],
    activities: [
      { id: genId('act'), title: 'Site identified — Uchila Thalapady, 1-acre coastal plot', date: new Date().toISOString(), status: 'done' },
    ],
    createdAt: new Date().toISOString(),
  },
];

function readAll(): SiteProject[] {
  try {
    const p = dataPath();
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf-8'));
  } catch { /* ignore — start fresh */ }
  return SEED_PROJECTS;
}

function writeAll(projects: SiteProject[]) {
  const p = dataPath();
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(projects, null, 2));
}

export function getAllProjects(): SiteProject[] {
  return readAll();
}

export function getProject(id: string): SiteProject | undefined {
  return readAll().find(p => p.id === id);
}

export interface CreateProjectInput {
  ventureId: Project;
  name: string;
  location: string;
  status?: SiteProjectStatus;
  source: 'lead' | 'manual';
  leadId?: string;
  config?: string;
  budget?: BudgetLine[];
}

export function createProject(input: CreateProjectInput): SiteProject {
  const all = readAll();
  const project: SiteProject = {
    id: genId('SP'),
    ventureId: input.ventureId,
    name: input.name,
    location: input.location,
    status: input.status ?? 'planning',
    source: input.source,
    leadId: input.leadId,
    config: input.config,
    budget: input.budget ?? [],
    team: [],
    tasks: [],
    activities: [],
    createdAt: new Date().toISOString(),
  };
  all.unshift(project);
  writeAll(all);
  return project;
}

export function updateProject(id: string, patch: Partial<Pick<SiteProject, 'name' | 'location' | 'status'>>): SiteProject | undefined {
  const all = readAll();
  const project = all.find(p => p.id === id);
  if (!project) return undefined;
  Object.assign(project, patch);
  writeAll(all);
  return project;
}

export function addTeamMember(projectId: string, member: Omit<TeamMember, 'id'>): TeamMember | undefined {
  const all = readAll();
  const project = all.find(p => p.id === projectId);
  if (!project) return undefined;
  const rec: TeamMember = { ...member, id: genId('tm') };
  project.team = [rec, ...project.team];
  writeAll(all);
  return rec;
}

export function removeTeamMember(projectId: string, memberId: string) {
  const all = readAll();
  const project = all.find(p => p.id === projectId);
  if (!project) return;
  project.team = project.team.filter(m => m.id !== memberId);
  writeAll(all);
}

export function addBudgetLine(projectId: string, line: Omit<BudgetLine, 'id'>): BudgetLine | undefined {
  const all = readAll();
  const project = all.find(p => p.id === projectId);
  if (!project) return undefined;
  const rec: BudgetLine = { ...line, id: genId('bl') };
  project.budget = [rec, ...project.budget];
  writeAll(all);
  return rec;
}

export function removeBudgetLine(projectId: string, lineId: string) {
  const all = readAll();
  const project = all.find(p => p.id === projectId);
  if (!project) return;
  project.budget = project.budget.filter(b => b.id !== lineId);
  writeAll(all);
}

export function addTask(projectId: string, task: Omit<ProjectTask, 'id'>): ProjectTask | undefined {
  const all = readAll();
  const project = all.find(p => p.id === projectId);
  if (!project) return undefined;
  const rec: ProjectTask = { ...task, id: genId('pt') };
  project.tasks = [rec, ...project.tasks];
  writeAll(all);
  return rec;
}

export function updateTask(projectId: string, taskId: string, status: Status): ProjectTask | undefined {
  const all = readAll();
  const project = all.find(p => p.id === projectId);
  const task = project?.tasks.find(t => t.id === taskId);
  if (!project || !task) return undefined;
  task.status = status;
  writeAll(all);
  return task;
}

export function removeTask(projectId: string, taskId: string) {
  const all = readAll();
  const project = all.find(p => p.id === projectId);
  if (!project) return;
  project.tasks = project.tasks.filter(t => t.id !== taskId);
  writeAll(all);
}

export function addActivity(projectId: string, activity: Omit<Activity, 'id' | 'date'> & { date?: string }): Activity | undefined {
  const all = readAll();
  const project = all.find(p => p.id === projectId);
  if (!project) return undefined;
  const rec: Activity = { id: genId('act'), title: activity.title, notes: activity.notes, status: activity.status, date: activity.date ?? new Date().toISOString() };
  project.activities = [rec, ...project.activities];
  writeAll(all);
  return rec;
}

export function updateActivity(projectId: string, activityId: string, status: ActivityStatus): Activity | undefined {
  const all = readAll();
  const project = all.find(p => p.id === projectId);
  const activity = project?.activities.find(a => a.id === activityId);
  if (!project || !activity) return undefined;
  activity.status = status;
  writeAll(all);
  return activity;
}

export function removeActivity(projectId: string, activityId: string) {
  const all = readAll();
  const project = all.find(p => p.id === projectId);
  if (!project) return;
  project.activities = project.activities.filter(a => a.id !== activityId);
  writeAll(all);
}
