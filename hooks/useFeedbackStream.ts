"use client";

import { useState } from "react";
import type { FeedbackType } from "@/types";

type PartialFeedback = Partial<Record<FeedbackType, string>>;

export function useFeedbackStream(studyLogId: string) {
  const [streaming, setStreaming] = useState(false);
  const [streamedFeedback, setStreamedFeedback] = useState<PartialFeedback | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startStream = async (onDone?: (feedback: PartialFeedback) => void) => {
    setStreaming(true);
    setStreamedFeedback(null);
    setError(null);

    try {
      const response = await fetch("/api/feedbacks/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ study_log_id: studyLogId }),
      });

      if (!response.ok) {
        const json = await response.json().catch(() => ({}));
        throw new Error(json.error ?? `서버 오류 (${response.status})`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("스트림을 읽을 수 없습니다.");

      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const lines = decoder.decode(value, { stream: true }).split("\n");
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6).trim();
          if (payload === "[DONE]") break;
          try {
            accumulated += (JSON.parse(payload) as { text: string }).text;
            // JSON이 완성될 때마다 UI 업데이트 시도
            const partial = JSON.parse(accumulated) as PartialFeedback;
            setStreamedFeedback(partial);
          } catch {}
        }
      }

      if (!accumulated) throw new Error("응답이 비어있습니다.");
      let final: PartialFeedback;
      try {
        final = JSON.parse(accumulated) as PartialFeedback;
      } catch {
        throw new Error(`JSON 파싱 실패. 원문: ${accumulated.slice(0, 100)}`);
      }
      onDone?.(final);
    } catch (err) {
      const message = err instanceof Error ? err.message : "알 수 없는 오류";
      setError(message);
      console.error("[FeedbackStream]", message);
    } finally {
      setStreaming(false);
    }
  };

  return { streaming, streamedFeedback, error, startStream };
}
