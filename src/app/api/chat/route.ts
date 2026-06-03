// Model-aware chat API route. Accepts `model` from the request body
// to select which LLM backend to use.

const SYSTEM_PROMPT = `You are the AI assistant for Codelude HQ — Shawaz's internal company OS.

Codelude is a deep-tech venture studio (Mangaluru, India + Dubai HoldCo).
5 ventures: Roborns (coastal AI+desalination), Franchiseen (franchise finance OS), HubCV (AI career intelligence), Cuestay (home AI automation), Dextrip (trading automation, live $227 MRR).

Be direct, concise, and actionable. Provide specific, practical answers.`;

const MODEL_CONFIGS: Record<string, { apiUrl: string; model: string; apiKey?: string }> = {
  'deepseek-v4-flash': {
    apiUrl: 'https://opencode.ai/zen/go/v1/chat/completions',
    model: 'deepseek-v4-flash',
    apiKey: process.env.OPENCODE_GO_API_KEY,
  },
  'big-pickle': {
    apiUrl: 'https://opencode.ai/zen/v1/chat/completions',
    model: 'big-pickle',
    // Free tier — no API key needed
  },
};

// Ordered display for the frontend model picker
export const MODEL_OPTIONS = [
  { id: 'deepseek-v4-flash', label: 'DeepSeek V4 Flash', badge: 'Fast' },
  { id: 'big-pickle',        label: 'Big Pickle',        badge: 'Free' },
];

const DEFAULT_MODEL = 'deepseek-v4-flash';

export async function POST(req: Request) {
  try {
    const { messages, systemOverride, model: modelId } = await req.json();
    const cfg = MODEL_CONFIGS[modelId] || MODEL_CONFIGS[DEFAULT_MODEL];
    if (!cfg) throw new Error(`Unknown model: ${modelId}`);

    const systemPrompt = systemOverride ?? SYSTEM_PROMPT;

    // Build OpenAI-compatible messages array
    const apiMessages: { role: string; content: string }[] = [
      { role: 'system', content: systemPrompt },
    ];

    if (messages && messages.length > 0) {
      const recentMessages = messages.slice(-6); // last 6 for context
      for (const msg of recentMessages) {
        if (msg.role === 'user' || msg.role === 'assistant') {
          apiMessages.push({ role: msg.role, content: msg.content });
        }
      }
    }

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (cfg.apiKey) {
      headers['Authorization'] = `Bearer ${cfg.apiKey}`;
    }

    const response = await fetch(cfg.apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: cfg.model,
        messages: apiMessages,
        max_tokens: 2048,
        temperature: 0.7,
        extra_body: { reasoning: 'none' },
      }),
      signal: AbortSignal.timeout(120000),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => 'Unknown error');
      return new Response(`API error (${response.status}): ${errText}`, {
        status: 502,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    const data = await response.json();
    const msg = data?.choices?.[0]?.message || {};
    let content = msg.content?.trim();
    if (!content && msg.reasoning_content) {
      content = msg.reasoning_content.trim();
    }
    if (content) {
      content = content.replace(/^Thinking[.:]?\s*/i, '');
    }
    content = content || 'No response';

    return new Response(content, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (e: any) {
    const errorMsg = e.message || 'Unknown error';
    return new Response(`Error: ${errorMsg}`, {
      status: 500,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
}

export const dynamic = 'force-dynamic';
