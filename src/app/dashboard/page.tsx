'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import ChatHistory, { useLazySummarise } from '@/components/ChatHistory';
import NewTaskForm from '@/components/NewTaskForm';
import { usePageScopes, clampIndex } from '@/lib/use-page-scopes';
import { sc, scBorder } from '@/lib/status-colors';

const ALL_VENTURE_CARDS = [
  {
    name: 'Roborns',     color: '#dbdbdb', sector: 'Coastal AI Infrastructure',
    status: 'In Development', statusColor: '#dbdbdb',
    metrics: [{ k: 'Raise', v: '₹18.1 Cr' }, { k: 'Phase', v: 'Feasibility' }, { k: 'HoldCo', v: 'Dubai' }],
  },
  {
    name: 'Franchiseen', color: '#c8c8c8', sector: 'AI Business Assistant',
    status: 'Alpha', statusColor: '#eeeeee',
    metrics: [{ k: 'Stage', v: 'Alpha' }, { k: 'Payout', v: 'Daily + monthly' }, { k: 'Target AUM', v: '$60M Y5' }],
  },
  {
    name: 'HubCV',       color: '#b5b5b5', sector: 'AI Career Assistant',
    status: 'In Development', statusColor: '#dbdbdb',
    metrics: [{ k: 'Stage', v: 'Build' }, { k: 'Beta', v: 'Q4 2026' }, { k: 'Y5 ARR', v: '$4.4M' }],
  },
  {
    name: 'Nanotrade',     color: '#adadad', sector: 'AI Trading Assistant',
    status: 'Live — Beta', statusColor: '#dbdbdb',
    metrics: [{ k: 'MRR', v: '$227' }, { k: 'Subscribers', v: '3 beta' }, { k: 'Y5 ARR', v: '$7.1M' }],
  },
  {
    name: 'Llife',     color: '#a5a5a5', sector: 'AI Life Assistant',
    status: 'Planning', statusColor: '#b5b5b5',
    metrics: [{ k: 'Stage', v: 'Planning' }, { k: 'Hub price', v: '$499' }, { k: 'MOQ', v: '$300K' }],
  },
];

const PRIORITY_COLOR: Record<string, string> = { high: '#9d9d9d', medium: '#b5b5b5', low: 'var(--muted)' };
type AIModel = 'opencode' | 'claude' | 'deepseek';


/** Renders the live Convex pipeline snapshot into prompt text. */
function pipelineSection(briefing: any): string {
  if (!briefing || !briefing.stages?.length) {
    return 'No prospects, leads, deals or clients recorded for this venture yet.';
  }
  const fmt = (r: any) => {
    const bits = [
      r.segment,
      r.status,
      r.priority && r.priority !== 'medium' ? `${r.priority} priority` : null,
      r.category,
      [r.city, r.state].filter(Boolean).join(', ') || null,
      r.value,
      r.interest ? `wants: ${r.interest}` : null,
      r.source ? `via ${r.source}` : null,
      r.email,
      r.phone,
      r.meetingAt ? `meeting ${new Date(r.meetingAt).toLocaleString('en-IN')}` : null,
    ].filter(Boolean);
    return `  - ${r.name} — ${bits.join(' · ')}`;
  };
  return briefing.stages.map((s: any) => {
    const seg = s.bySegment.map((b: any) => `${b.segment} ${b.count}`).join(', ');
    const head = `${s.stage.toUpperCase()}S — ${s.total} total (${seg})`;
    const rows = s.sample.map(fmt).join('\n');
    const more = s.truncated ? `\n  …and ${s.total - s.sample.length} more not listed here.` : '';
    return `${head}\n${rows}${more}`;
  }).join('\n\n');
}

/** Renders the venture's task board into prompt text. */
function tasksSection(tasks: { title: string; status: string; priority: string; category: string }[]): string {
  if (!tasks.length) return 'No tasks recorded for this venture.';
  const line = (t: any) => `  - [${t.status}] ${t.title} (${t.priority} · ${t.category})`;
  return tasks.map(line).join('\n');
}

const MODEL_LABELS: Record<AIModel, string> = {
  opencode: 'Big Pickle',
  claude:   'Claude Sonnet',
  deepseek: 'DeepSeek Flash',
};

interface Message { role: 'user' | 'assistant'; content: string; }

function VentureChat({ venture }: { venture: typeof ALL_VENTURE_CARDS[0] }) {
  // Today's conversation is the source of truth; local state only holds the
  // in-flight turn, so a refresh mid-thought loses nothing.
  const stored      = useQuery(api.aichat.today, { venture: venture.name });
  const append      = useMutation(api.aichat.append);
  const clearToday  = useMutation(api.aichat.clearToday);
  const [pending,   setPending]   = useState<Message[]>([]);
  const [input,     setInput]     = useState('');
  const [loading,   setLoading]   = useState(false);
  const [model,     setModel]     = useState<AIModel>('opencode');
  const [rail,      setRail]      = useState<'tasks' | 'history'>('tasks');
  const [taskFilter, setTaskFilter] = useState<'today' | 'todo' | 'done'>('today');
  const [newTaskOpen, setNewTaskOpen] = useState(false);
  // Task ids the user has put on today. Per-user and cross-venture — you have
  // one day, not five — so this rail shows the intersection with this venture.
  const todayIds    = useQuery(api.tasks.today);
  const toggleToday = useMutation(api.tasks.toggle);
  // Roll up any finished day the moment the assistant is opened, so the
  // summary exists before anyone goes looking for it.
  useLazySummarise(venture.name);
  const bottomRef   = useRef<HTMLDivElement>(null);
  const inputRef    = useRef<HTMLTextAreaElement>(null);
  const briefing    = useQuery(api.pipeline.ventureBriefing, { venture: venture.name });

  // Persisted turns, plus whatever is still streaming.
  const messages: Message[] = [
    ...(stored ?? []).map(m => ({ role: m.role, content: m.content })),
    ...pending,
  ];
  const allTasks    = useQuery(api.tasks.list, { project: venture.name });
  const tasks       = allTasks ?? [];
  const inProgress  = tasks.filter(t => t.status === 'in-progress');
  const todo        = tasks.filter(t => t.status === 'todo');
  const done        = tasks.filter(t => t.status === 'done');

  // Today is stored per user across all ventures, so intersect it with this
  // venture's tasks. `undefined` means the query is still in flight — treat it
  // as empty rather than flashing every task in as "on today".
  const onTodayIds  = new Set(todayIds ?? []);
  // In-progress first, then todo, then done — the order the rail always used.
  const ordered     = [...inProgress, ...todo, ...done];
  const TASK_FILTERS = [
    { key: 'today' as const, label: 'Today', rows: ordered.filter(t => onTodayIds.has(t._id)) },
    { key: 'todo'  as const, label: 'Todo',  rows: ordered.filter(t => t.status !== 'done') },
    { key: 'done'  as const, label: 'Done',  rows: done },
  ];
  const visibleTasks = TASK_FILTERS.find(f => f.key === taskFilter)?.rows ?? ordered;

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);
  useEffect(() => { setPending([]); setInput(''); setTimeout(() => inputRef.current?.focus(), 100); }, [venture.name]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const newMessages: Message[] = [...messages, { role: 'user', content: text }];
    // Show the turn immediately, persist it in the background — a failed write
    // should not swallow what was typed.
    setPending([{ role: 'user', content: text }]);
    setInput(''); setLoading(true);
    void append({ venture: venture.name, role: 'user', content: text });
    try {
      const res = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          venture: venture.name,
          liveData: `## LIVE DATA FROM THE HQ DATABASE (${venture.name})
This is real current data from the dashboard, not an example. Use it directly
when asked about prospects, leads, deals, clients or tasks. Sample rows are
capped — where a count exceeds the rows listed, say so rather than implying the
list is complete.

### Sales pipeline
${pipelineSection(briefing)}

### Tasks (${tasks.length} total — ${inProgress.length} active, ${todo.length} todo, ${done.length} done)
${tasksSection(tasks)}`,
          model,
        }),
      });
      if (!res.body) throw new Error('No stream');
      const reader = res.body.getReader(); const decoder = new TextDecoder(); let reply = '';
      setPending(prev => [...prev, { role: 'assistant', content: '' }]);
      while (true) {
        const { value, done: d } = await reader.read();
        if (d) break;
        reply += decoder.decode(value, { stream: true });
        setPending(prev => { const u = [...prev]; u[u.length - 1] = { role: 'assistant', content: reply }; return u; });
      }
      // Persist the completed reply, then drop the local copy — the Convex
      // query re-renders it, so clearing early would blank the thread.
      if (reply.trim()) {
        await append({ venture: venture.name, role: 'assistant', content: reply });
        setPending([]);
      }
    } catch (e: any) {
      setPending(prev => [...prev, { role: 'assistant', content: `Error: ${e.message}` }]);
    } finally { setLoading(false); inputRef.current?.focus(); }
  }

  function handleKey(e: React.KeyboardEvent) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }

  const SUGGESTIONS: Record<string, string[]> = {
    Roborns:     ['What should I prioritise this week?', 'Draft an investor one-pager', 'Who should I contact first for thermal engineering?', 'What permits do I need before construction?'],
    Franchiseen: ['Which KYC provider should I choose?', 'How do I find the first franchise brand partner?', 'Draft an outreach email to a franchise brand', 'What are the SEBI compliance steps?'],
    HubCV:       ['How do I get the first 5 recruiter design partners?', 'Draft outreach to a bootcamp', 'What should the matching engine prioritise?', 'How do I recruit human skill verifiers?'],
    Llife:     ['How should Llife pull Education data from HubCV?', 'Design the daily time-block board', 'What does Account Aggregator onboarding require?', 'How do I keep daily retention above 40%?'],
    Nanotrade:     ['Why is EMA Trend performing this way?', 'How should I recruit the first strategy creators?', 'Draft a tweet for the public beta launch', 'What DeFi integrations should I prioritise?'],
  };

  return (
    <div style={{ display: 'flex', flex: 1, minHeight: 0, gap: 0 }}>

      {/* ── Chat panel ──────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, borderRight: '1px solid var(--card-border)', background: 'var(--card-bg)' }}>
        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', scrollbarWidth: 'none' }}>
          {messages.length === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--muted)', lineHeight: 1.8, fontWeight: 300 }}>
                I have full context on {venture.name}. Ask anything — strategy, next steps, drafts, analysis.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {(SUGGESTIONS[venture.name] ?? []).map(s => (
                  <button key={s} onClick={() => { setInput(s); inputRef.current?.focus(); }}
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', padding: '0.3rem 0.75rem', border: '1px solid var(--card-border)', background: 'transparent', cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--off-white)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--muted)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--muted)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--card-border)'; }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '88%', padding: '0.75rem 1rem',
                background: m.role === 'user' ? `${venture.color}15` : 'rgba(255,255,255,0.03)',
                border: `1px solid ${m.role === 'user' ? `${scBorder(venture.color, 30)}` : 'var(--card-border)'}`,
                fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--off-white)',
                lineHeight: 1.85, fontWeight: 300, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
              }}>
                {m.content || (loading && i === messages.length - 1 ? <span style={{ color: 'var(--muted)' }}>▌</span> : '')}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid var(--card-border)', display: 'flex', flexDirection: 'column', gap: '0.5rem', flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <textarea
              ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
              placeholder={`Ask about ${venture.name}… (Enter to send)`} rows={1}
              style={{ flex: 1, background: 'var(--black)', border: '1px solid var(--card-border)', color: 'var(--off-white)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', padding: '0.6rem 0.85rem', outline: 'none', resize: 'none', lineHeight: 1.6, maxHeight: 96, overflowY: 'auto' }}
              onFocus={e => { e.target.style.borderColor = venture.color; }}
              onBlur={e => { e.target.style.borderColor = 'var(--card-border)'; }}
            />
            <button onClick={send} disabled={loading || !input.trim()} style={{
              background: input.trim() && !loading ? venture.color : 'var(--card-border)', color: input.trim() && !loading ? 'var(--on-brand)' : 'var(--muted)',
              border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'default', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 700, padding: '0 1.25rem', transition: 'all 0.15s', flexShrink: 0,
            }}>
              {loading ? '...' : 'Send'}
            </button>
          </div>
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            {(['opencode', 'claude', 'deepseek'] as AIModel[]).map(m => (
              <button key={m} onClick={() => setModel(m)} style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.08em', textTransform: 'uppercase',
                padding: '0.2rem 0.65rem', border: `1px solid ${model === m ? venture.color : 'var(--card-border)'}`,
                background: model === m ? `${venture.color}18` : 'transparent',
                color: model === m ? venture.color : 'var(--muted)', cursor: 'pointer', transition: 'all 0.15s',
              }}>
                {MODEL_LABELS[m]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right rail: Tasks | History ──────────────────────── */}
      <div style={{ width: 280, flexShrink: 0, display: 'flex', flexDirection: 'column', overflowY: 'auto', scrollbarWidth: 'none' }}>
        <div style={{ flexShrink: 0, position: 'sticky', top: 0, background: 'var(--card-bg)', zIndex: 1, borderBottom: '1px solid var(--card-border)' }}>
          <div style={{ display: 'flex' }}>
            {([['tasks', `Tasks (${tasks.length})`], ['history', 'History']] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setRail(key)}
                style={{
                  flex: 1, padding: '0.7rem 0.5rem', background: 'none', cursor: 'pointer',
                  border: 'none', borderBottom: `2px solid ${rail === key ? venture.color : 'transparent'}`,
                  fontFamily: 'var(--font-mono)', fontSize: '0.56rem', letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: rail === key ? 'var(--off-white)' : 'var(--muted)',
                  transition: 'all 0.15s',
                }}
              >{label}</button>
            ))}
          </div>
          {rail === 'tasks' && (
            <div style={{ display: 'flex', gap: '0.25rem', padding: '0.6rem 0.75rem 0.6rem', flexWrap: 'wrap' }}>
              {TASK_FILTERS.map(f => {
                const active = taskFilter === f.key;
                return (
                  <button key={f.key} onClick={() => setTaskFilter(f.key)} style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.54rem', letterSpacing: '0.08em',
                    textTransform: 'uppercase', padding: '0.2rem 0.45rem', cursor: 'pointer',
                    background: active ? 'var(--accent)' : 'transparent',
                    border: `1px solid ${active ? 'var(--accent)' : 'var(--card-border)'}`,
                    color: active ? 'var(--on-accent)' : 'var(--muted)',
                    transition: 'all 0.12s',
                  }}>{f.label} {f.rows.length}</button>
                );
              })}
              <button
                onClick={() => setNewTaskOpen(true)}
                title="Create a task"
                style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.54rem', letterSpacing: '0.08em',
                  textTransform: 'uppercase', padding: '0.2rem 0.45rem', cursor: 'pointer',
                  background: 'transparent', border: '1px dashed var(--card-border)',
                  color: 'var(--muted)', transition: 'all 0.12s',
                }}
              >+ New</button>
            </div>
          )}
        </div>

        {rail === 'history' && <ChatHistory venture={venture.name} accent={venture.color} />}

        {rail === 'tasks' && newTaskOpen && (
          <NewTaskForm
            project={venture.name}
            accent={venture.color}
            onClose={() => setNewTaskOpen(false)}
          />
        )}

        {rail === 'tasks' && (
        <div style={{ flex: 1, padding: '0.5rem 0' }}>
          {visibleTasks.map(task => {
            const isToday = onTodayIds.has(task._id);
            const isDone  = task.status === 'done';
            return (
              <div key={task._id} className="rail-task">
                <button
                  onClick={() => void toggleToday({ taskId: task._id })}
                  aria-label={isToday ? `Remove "${task.title}" from today` : `Add "${task.title}" to today`}
                  title={isToday ? 'On today — click to remove' : 'Add to today'}
                  style={{
                    width: 12, height: 12, marginTop: '0.2rem', flexShrink: 0, padding: 0,
                    cursor: 'pointer',
                    background: isToday ? venture.color : 'transparent',
                    border: `1px solid ${isToday ? venture.color : 'var(--card-border)'}`,
                    transition: 'background 0.12s, border-color 0.12s',
                  }}
                />
                <Link href={`/dashboard/tasks/${task._id}`} style={{ flex: 1, minWidth: 0, textDecoration: 'none' }}>
                  {/* Two lines, not an ellipsis — a 280px rail cut most of these mid-word. */}
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.64rem', lineHeight: 1.45, fontWeight: 300,
                    color: isDone ? 'var(--muted)' : 'var(--off-white)',
                    textDecoration: isDone ? 'line-through' : 'none',
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>{task.title}</div>
                  {/* Priority as a marker, not shouted text — the title is what you read. */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.25rem' }}>
                    <span style={{ width: 5, height: 5, flexShrink: 0, background: sc(PRIORITY_COLOR[task.priority]) }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', color: 'var(--muted)' }}>
                      {task.priority} · {task.category}
                    </span>
                    {task.dueDate && (
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: '0.52rem',
                        color: !isDone && task.dueDate < new Date().toISOString().slice(0, 10)
                          ? 'var(--st-red)' : 'var(--muted)',
                      }}>· {task.dueDate.slice(5)}</span>
                    )}
                  </div>
                </Link>
              </div>
            );
          })}
          {visibleTasks.length === 0 && (
            <div style={{ padding: '1.5rem 1rem', fontFamily: 'var(--font-mono)', fontSize: '0.64rem', color: 'var(--muted)', lineHeight: 1.7 }}>
              {taskFilter === 'today'
                ? `Nothing planned for ${venture.name} today. Open Todo and click a square to add it.`
                : taskFilter === 'done'
                  ? `Nothing finished on ${venture.name} yet.`
                  : `No tasks for ${venture.name}.`}
            </div>
          )}
        </div>
        )}
      </div>
    </div>
  );
}

export default function AIPage() {
  // The AI page is not in the nav registry, so scope it by any-grant rather
  // than by page. The chat API re-checks this server-side — see api/chat.
  const { names: allowed, loading } = usePageScopes('overview');
  const VENTURES = ALL_VENTURE_CARDS.filter(v => allowed.includes(v.name));
  const [selected, setSelected] = useState(0);
  const index = clampIndex(selected, VENTURES.length);
  const venture = VENTURES[index];

  if (loading) return null;
  if (!venture) {
    return (
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', padding: '2rem' }}>
        No ventures assigned to your account yet. Ask an admin for access.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 4rem)', minHeight: 0 }}>

      {/* Venture selector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)', flexShrink: 0 }}>
        {VENTURES.map((v, i) => (
          <button key={v.name} onClick={() => setSelected(i)} style={{
            background: index === i ? 'var(--accent)' : 'var(--card-bg)', border: 'none', cursor: 'pointer',
            padding: '1rem 0.75rem', textAlign: 'left', transition: 'background 0.15s',
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: index === i ? 'var(--on-accent)' : v.color, opacity: index === i ? 0.6 : 1, marginBottom: '0.25rem' }}>0{i + 1}</div>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: index === i ? 'var(--on-accent)' : 'var(--off-white)', marginBottom: '0.15rem' }}>{v.name}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: index === i ? 'var(--on-accent)' : 'var(--muted)', opacity: index === i ? 0.75 : 1, letterSpacing: '0.04em' }}>{v.sector}</div>
          </button>
        ))}
      </div>

      {/* Venture header */}
      <div style={{ padding: '0.85rem 1.25rem', borderLeft: '1px solid var(--card-border)', borderRight: '1px solid var(--card-border)', borderBottom: '1px solid var(--card-border)', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{ borderLeft: `2px solid ${venture.color}`, paddingLeft: '0.85rem' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', color: venture.color, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.1rem' }}>{venture.sector}</div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{venture.name}</div>
        </div>
        <div style={{ display: 'flex', gap: '1.25rem', marginLeft: 'auto' }}>
          {venture.metrics.map(m => (
            <div key={m.k} style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.1rem' }}>{m.k}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--off-white)', fontWeight: 600 }}>{m.v}</div>
            </div>
          ))}
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.54rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.18rem 0.55rem', border: `1px solid ${scBorder(venture.statusColor)}`, color: venture.statusColor, flexShrink: 0 }}>{venture.status}</span>
      </div>

      {/* Chat + Tasks */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0, border: '1px solid var(--card-border)', borderTop: 'none' }}>
        <VentureChat venture={venture} />
      </div>
    </div>
  );
}
