import { NextResponse } from 'next/server';
import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const DEXTRIP = '/home/centos/codelude/dextrip';

function readJson(path: string): any {
  try { return existsSync(path) ? JSON.parse(readFileSync(path, 'utf-8')) : null; } catch { return null; }
}

function parseCsv(path: string): any[] {
  try {
    if (!existsSync(path)) return [];
    const lines = readFileSync(path, 'utf-8').trim().split('\n');
    if (lines.length < 2) return [];
    const headers = lines[0].split(',').map(h => h.trim());
    return lines.slice(1).map(line => {
      const vals = line.split(',').map(v => v.trim());
      const row: Record<string, string> = {};
      headers.forEach((h, i) => { row[h] = vals[i] ?? ''; });
      return row;
    });
  } catch { return []; }
}

export async function GET() {
  try {
    const STRATEGIES = ['every_up', 'every_down', 'ema', 'previous_2', 'previous_4', 'rsi'];
    const STRATEGY_NAMES: Record<string, string> = {
      every_up: 'Every UP', every_down: 'Every DOWN',
      previous_2: 'Prev 2', previous_4: 'Prev 4',
      ema: 'EMA', rsi: 'RSI',
    };

    // ── Indicator strategies ──────────────────────────────────────────
    const strategies = STRATEGIES.flatMap(s =>
      ['5m', '15m'].map(tf => {
        const state = readJson(join(DEXTRIP, `state_${s}_${tf}.json`));
        const trades = parseCsv(join(DEXTRIP, `trades_${s}_${tf}.csv`));
        if (!state) return null;
        return {
          id: `${s}_${tf}`, name: STRATEGY_NAMES[s], tf,
          wins: state.wins ?? 0, losses: state.losses ?? 0,
          totalPnl: state.total_pnl ?? 0, totalTrades: state.total_trades ?? 0,
          currentStep: state.current_step ?? 0,
          openPosition: state.open_position ?? null,
          lastDecision: state.last_decision ?? '',
          paused: state.paused ?? false,
          recentTrades: trades.slice(-5).reverse(),
        };
      }).filter(Boolean)
    );

    // ── Webhook strategies ────────────────────────────────────────────
    const webhookFile = readJson(join(DEXTRIP, 'signal_strategies.json'));
    const webhooks = (webhookFile?.strategies ?? []).map((cfg: any) => {
      const tf  = cfg.timeframe ?? '5m';
      const state = readJson(join(DEXTRIP, `state_custom_${cfg.id}_${tf}.json`));
      return {
        id: cfg.id, name: cfg.name, tf,
        entryMode: cfg.entry_mode ?? 'signal',
        wins: state?.wins ?? 0, losses: state?.losses ?? 0,
        totalPnl: state?.total_pnl ?? 0, totalTrades: state?.total_trades ?? 0,
        currentStep: state?.current_step ?? 0,
        openPosition: state?.open_position ?? null,
        paused: state?.paused ?? false,
      };
    });

    // ── PM2 health ────────────────────────────────────────────────────
    let pm2Processes: any[] = [];
    try {
      const raw = execSync('pm2 jlist 2>/dev/null', { timeout: 5000, encoding: 'utf-8' });
      pm2Processes = JSON.parse(raw).map((p: any) => ({
        id: p.pm_id, name: p.name, status: p.pm2_env?.status,
        uptime: p.pm2_env?.pm_uptime, restarts: p.pm2_env?.restart_time,
        memory: p.monit?.memory ?? 0, cpu: p.monit?.cpu ?? 0,
      }));
    } catch {}

    // ── Revenue summary ───────────────────────────────────────────────
    // Count trades and compute total PnL across all strategies
    const allPnl = strategies.reduce((s: number, st) => s + (st?.totalPnl ?? 0), 0)
      + webhooks.reduce((s: number, w: any) => s + w.totalPnl, 0);
    const allTrades = strategies.reduce((s: number, st) => s + (st?.totalTrades ?? 0), 0)
      + webhooks.reduce((s: number, w: any) => s + w.totalTrades, 0);
    const allWins  = strategies.reduce((s: number, st) => s + (st?.wins ?? 0), 0)
      + webhooks.reduce((s: number, w: any) => s + w.wins, 0);

    // Subscription MRR (hardcoded known values until subscription DB exists)
    const subscriptionMrr = 227; // $99 + $99 + $29 from 3 beta users

    return NextResponse.json({
      strategies, webhooks, pm2Processes,
      summary: {
        totalPnl: allPnl, totalTrades: allTrades, totalWins: allWins,
        winRate: allTrades > 0 ? Math.round((allWins / allTrades) * 100) : 0,
        subscriptionMrr, totalRevenueMtd: subscriptionMrr + Math.max(0, allPnl),
        activeStrategies: strategies.filter((s: any) => !s?.paused).length + webhooks.filter((w: any) => !w.paused).length,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
