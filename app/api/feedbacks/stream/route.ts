import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/supabase-server";
import { generateFeedbackStream } from "@/services/ai-service";
import { getStudyLog } from "@/services/study-log-service";
import { saveFeedback } from "@/services/feedback-service";

export async function POST(request: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { study_log_id } = await request.json();
  const log = await getStudyLog(study_log_id, user.id);
  if (!log) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let stream;
  try {
    stream = await generateFeedbackStream(log.title, log.content);
  } catch (err) {
    const message = err instanceof Error ? err.message : "OpenAI 호출 실패";
    console.error("[stream route]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const encoder = new TextEncoder();
  let accumulated = "";

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const text = chunk.text ?? "";
          accumulated += text;
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
          );
        }
        try {
          const result = JSON.parse(accumulated);
          await saveFeedback(study_log_id, user.id, result);
        } catch (e) {
          console.error("[stream route] saveFeedback 실패", e);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "스트림 오류";
        console.error("[stream route] 스트리밍 중 오류", message);
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: message })}\n\n`)
        );
      } finally {
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
