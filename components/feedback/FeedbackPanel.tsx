"use client";

import { useState } from "react";
import { useFeedback } from "@/hooks/useFeedback";
import { useFeedbackStream } from "@/hooks/useFeedbackStream";
import { FeedbackItem } from "./FeedbackItem";
import { FeedbackTodos } from "./FeedbackTodos";
import { FEEDBACK_LABELS, FEEDBACK_TYPES } from "@/constants";
import type { Feedback, FeedbackType } from "@/types";

export function FeedbackPanel({ studyLogId }: { studyLogId: string }) {
  const { feedback, versions, loading, rate, refetch } = useFeedback(studyLogId);
  const { streaming, streamedFeedback, error, startStream } = useFeedbackStream(studyLogId);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedFeedback = selectedId
    ? (versions.find((v) => v.id === selectedId) ?? feedback)
    : feedback;

  const display: Partial<Record<FeedbackType, string | null>> =
    streaming && streamedFeedback ? streamedFeedback : selectedFeedback ?? {};

  const handleGenerate = () =>
    startStream(() => {
      setSelectedId(null);
      refetch();
    });

  const handleRate = (rating: number) => {
    if (!selectedFeedback) return;
    const next = selectedFeedback.rating === rating ? null : rating;
    rate(selectedFeedback.id, next);
  };

  if (loading) {
    return (
      <p className="py-8 text-center text-sm text-zinc-400">피드백 불러오는 중...</p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">AI 피드백</h3>
        <button
          onClick={handleGenerate}
          disabled={streaming}
          className="rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-1.5 text-xs font-medium text-white shadow-sm transition-all hover:from-indigo-500 hover:to-violet-500 hover:shadow-md disabled:opacity-50"
        >
          {streaming ? "생성 중..." : feedback ? "재생성" : "AI 피드백 받기"}
        </button>
      </div>

      {/* Version tabs */}
      {versions.length > 1 && !streaming && (
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {versions.map((v) => {
            const isActive = selectedId === v.id || (!selectedId && v.id === feedback?.id);
            return (
              <button
                key={v.id}
                onClick={() => setSelectedId(v.id)}
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                }`}
              >
                V{v.version} · {v.created_at.slice(5, 10)}
              </button>
            );
          })}
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
          오류: {error}
        </div>
      )}

      {streaming && !streamedFeedback && (
        <p className="py-6 text-center text-sm text-zinc-400">AI가 분석하고 있습니다...</p>
      )}

      {Object.keys(display).length > 0 ? (
        <>
          <div className="space-y-3">
            {FEEDBACK_TYPES.map((type) =>
              type === "todos" ? (
                <FeedbackTodos key={type} content={display[type]} />
              ) : (
                <FeedbackItem
                  key={type}
                  type={type}
                  label={FEEDBACK_LABELS[type]}
                  content={display[type]}
                />
              )
            )}
          </div>

          {selectedFeedback && !streaming && (
            <div className="flex items-center gap-3 border-t border-zinc-100 pt-4 dark:border-zinc-800">
              <span className="text-xs text-zinc-500">도움이 됐나요?</span>
              <button
                onClick={() => handleRate(1)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  selectedFeedback.rating === 1
                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
                }`}
              >
                도움됐어요
              </button>
              <button
                onClick={() => handleRate(-1)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  selectedFeedback.rating === -1
                    ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
                }`}
              >
                별로예요
              </button>
            </div>
          )}
        </>
      ) : (
        !streaming && (
          <div className="rounded-xl border border-dashed border-zinc-200 p-8 text-center dark:border-zinc-700">
            <p className="text-sm text-zinc-500">아직 피드백이 없습니다.</p>
            <p className="mt-1 text-xs text-zinc-400">
              AI 피드백 받기를 눌러 분석을 시작하세요.
            </p>
          </div>
        )
      )}
    </div>
  );
}
