import { execSync } from "child_process";

export async function POST(req: Request) {
  try {
    const { messages, sessionId } = await req.json();
    const lastMsg = messages?.filter((m: any) => m.role === "user").pop()?.content || "";
    if (!lastMsg) {
      return new Response("No user message", { status: 400 });
    }

    const escaped = lastMsg.replace(/'/g, "'\\''");
    const resume = sessionId ? ` --continue ${sessionId}` : "";
    const cmd = `/home/centos/.local/bin/hermes --profile homer chat --query '${escaped}' --quiet --source tool${resume} 2>&1`;
    const output = execSync(cmd, { encoding: "utf-8", timeout: 120000, maxBuffer: 10 * 1024 * 1024 });

    const lines = output.trim().split("\n");
    let session_id = "";
    let contentStart = 0;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith("session_id:")) {
        session_id = lines[i].replace("session_id:", "").trim();
        contentStart = i + 1;
        break;
      }
    }

    const content = lines.slice(contentStart).join("\n");

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(content));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Session-Id": session_id,
      },
    });
  } catch (e: any) {
    const msg = e.message || "Unknown error";
    return new Response("Sorry, the AI backend is temporarily unavailable. Try again in a moment. (" + msg + ")", {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}

export const dynamic = "force-dynamic";
