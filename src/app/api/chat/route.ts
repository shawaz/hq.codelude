// Chat API route — DeepSeek V4 Flash only via OpenCode Go.

const SYSTEM_PROMPT = `You are the AI assistant for Codelude HQ — Shawaz's internal company OS.

Codelude is a deep-tech venture studio (Mangaluru, India + Dubai HoldCo).
5 ventures: Roborns (coastal AI+desalination), Franchiseen (franchise finance OS), HubCV (AI career intelligence), Cuestay (home AI automation), Dextrip (trading automation, live $227 MRR).

Be direct, concise, and actionable. Provide specific, practical answers.`;

const MODEL = {
  apiUrl: 'https://opencode.ai/zen/go/v1/chat/completions',
  model: 'deepseek-v4-flash',
  apiKey: process.env.OPENCODE_GO_API_KEY,
};

async function callModel(apiMessages: { role: string; content: string }[]): Promise<string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (MODEL.apiKey) {
    headers['Authorization'] = `Bearer ${MODEL.apiKey}`;
  }

  const response = await fetch(MODEL.apiUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: MODEL.model,
      messages: apiMessages,
      max_tokens: 2048,
      temperature: 0.7,
      extra_body: { reasoning: 'none' },
    }),
    signal: AbortSignal.timeout(120000),
  });

  if (!response.ok) {
    throw new Error(`API returned ${response.status}`);
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
  return content || 'No response';
}

function buildMessages(systemPrompt: string, messages: { role: string; content: string }[] | null | undefined) {
  const apiMessages: { role: string; content: string }[] = [
    { role: 'system', content: systemPrompt },
  ];
  if (messages && messages.length > 0) {
    for (const msg of messages.slice(-6)) {
      if (msg.role === 'user' || msg.role === 'assistant') {
        apiMessages.push({ role: msg.role, content: msg.content });
      }
    }
  }
  return apiMessages;
}

export async function POST(req: Request) {
  try {
    const { messages, systemOverride } = await req.json();
    const systemPrompt = systemOverride ?? SYSTEM_PROMPT;
    const apiMessages = buildMessages(systemPrompt, messages);
    const content = await callModel(apiMessages);
    return new Response(content, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (e: any) {
    const msg = e.message || 'Unknown error';
    return new Response(`Sorry, the AI backend is temporarily unavailable. Try again in a moment. (${msg})`, {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
}

export const dynamic = 'force-dynamic';
