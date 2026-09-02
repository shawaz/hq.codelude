// ─── TICKETS ─────────────────────────────────────────────────────────────────

export type TicketStatus   = 'open' | 'in-progress' | 'resolved' | 'closed';
export type TicketPriority = 'critical' | 'high' | 'medium' | 'low';
export type TicketType     = 'Bug' | 'Feature Request' | 'Access' | 'Billing' | 'General';

export interface Ticket {
  id:       string;
  title:    string;
  venture:  string;
  type:     TicketType;
  priority: TicketPriority;
  status:   TicketStatus;
  reporter: string;
  date:     string;
  notes:    string;
}

export const TICKETS: Ticket[] = [];

// ─── HELP DESK ARTICLES ───────────────────────────────────────────────────────

export interface HelpArticle {
  title:    string;
  venture:  string;
  category: string;
  content:  string;
}

export const HELP_ARTICLES: HelpArticle[] = [
  {
    title: 'How to deploy a code update to the server',
    venture: 'Codelude',
    category: 'Infrastructure',
    content: `1. Make changes locally and test (npm run dev)\n2. Build locally: npm run build — fix any errors before proceeding\n3. Sync to server: rsync -avz --exclude 'node_modules' --exclude '.next' ./ centos@64.227.160.224:~/codelude/company/software/[project]/\n4. Build on server: ssh to server, run nohup npm run build > /tmp/build.log 2>&1 &\n5. Wait for build: until ! pgrep -f 'next build'; do sleep 5; done\n6. Restart: pm2 restart [process-name]\n7. Check logs: pm2 logs [process-name] --lines 5 --nostream\n\nNever edit files directly on the production server. Always build locally first.`,
  },
  {
    title: 'How to add a new team member to HQ',
    venture: 'Codelude',
    category: 'Admin',
    content: `1. Add their email as a user in the Google Workspace codelude.com domain\n2. Ask them to visit hq.codelude.com → Continue with Google\n3. Sign-in is restricted to @codelude.com accounts (enforced by Convex Auth)\n4. They will appear in HQ → Team as a member\n5. The first person to sign in becomes admin and can assign roles from the Convex dashboard`,
  },
  {
    title: 'How to check server health',
    venture: 'Codelude',
    category: 'Infrastructure',
    content: `SSH into the server: ssh centos@64.227.160.224\n\nCheck all PM2 processes: pm2 list\nCheck specific process logs: pm2 logs [name] --lines 20 --nostream\nCheck server load: htop\nCheck disk usage: df -h\nCheck port availability: ss -tlnp\nCheck Apache status: sudo systemctl status httpd\n\nKey processes to monitor:\n- codelude-web (port 3004) — codelude.com\n- hq-codelude (port 3005) — hq.codelude.com\n- nanotrade-web (port 3000) — bot.nanotrade.com\n- nanotrade-multi-bot (port 8081) — core trading engine\n\nIf a process is stopped: pm2 restart [name]\nIf Apache is down: sudo systemctl restart httpd`,
  },
  {
    title: 'How to renew SSL certificates',
    venture: 'Codelude',
    category: 'Infrastructure',
    content: `SSL certificates via Let\'s Encrypt / Certbot auto-renew via scheduled task.\n\nTo manually trigger renewal:\nsudo certbot renew\n\nTo check certificate expiry:\nsudo certbot certificates\n\nAll current certificates expire 2026-08-18. Certbot will auto-renew 30 days before expiry.\n\nTo add a new domain:\nsudo certbot --apache -d [domain.com] --non-interactive --agree-tos -m shawaz@codelude.com\n\nNote: Domain must have DNS A record pointing to 64.227.160.224 before running certbot.`,
  },
  {
    title: 'Nanotrade — strategy not executing',
    venture: 'Nanotrade',
    category: 'Platform',
    content: `If a Nanotrade strategy is not executing:\n\n1. Check PM2 status: pm2 logs nanotrade-multi-bot --lines 20\n2. Verify exchange API keys are valid and not rate-limited\n3. Check Binance/Bybit API status (status.binance.com)\n4. Confirm the strategy is enabled in the user's dashboard\n5. Check if the bot has sufficient account balance to execute\n\nCommon causes:\n- Exchange API rate limit hit → upgrade to VIP tier\n- API key expired or permissions changed → re-issue keys\n- Market conditions triggering risk management stop → expected behaviour\n- Bot restarted and lost state → pm2 restart nanotrade-multi-bot`,
  },
];
