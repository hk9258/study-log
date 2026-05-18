"use client";

import { useState } from "react";
import type { StudyLog, StudyLogInput } from "@/types";

interface Props {
  initial?: StudyLog;
  onSubmit: (input: StudyLogInput) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function StudyLogForm({ initial, onSubmit, onCancel, loading }: Props) {
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState<StudyLogInput>({
    title: initial?.title ?? "",
    content: initial?.content ?? "",
    study_date: initial?.study_date ?? today,
    duration_minutes: initial?.duration_minutes ?? 0,
    tags: initial?.tags ?? [],
    is_public: initial?.is_public ?? false,
  });
  const [tagInput, setTagInput] = useState("");

  const set = <K extends keyof StudyLogInput>(key: K, value: StudyLogInput[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) set("tags", [...form.tags, tag]);
    setTagInput("");
  };

  const removeTag = (tag: string) =>
    set("tags", form.tags.filter((t) => t !== tag));

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit(form); }}
      className="space-y-5"
    >
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          제목
        </label>
        <input
          required
          type="text"
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="오늘의 학습 주제"
          className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          학습 내용
        </label>
        <textarea
          required
          rows={6}
          value={form.content}
          onChange={(e) => set("content", e.target.value)}
          placeholder="오늘 무엇을 배웠나요? 어떤 점이 어려웠나요?"
          className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            학습 날짜
          </label>
          <input
            required
            type="date"
            value={form.study_date}
            onChange={(e) => set("study_date", e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            학습 시간 (분)
          </label>
          <input
            type="number"
            min={0}
            value={form.duration_minutes}
            onChange={(e) => set("duration_minutes", Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          태그
        </label>
        <div className="mt-1 flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
            placeholder="React, TypeScript..."
            className="flex-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          />
          <button
            type="button"
            onClick={addTag}
            className="rounded-lg border border-zinc-200 px-3 py-2 text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            추가
          </button>
        </div>
        {form.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {form.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-1 text-xs dark:bg-zinc-800"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-zinc-400 hover:text-zinc-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-2">
        <label className="flex cursor-pointer items-center gap-2.5">
          <div
            onClick={() => set("is_public", !form.is_public)}
            className={`relative h-5 w-9 rounded-full transition-colors ${
              form.is_public ? "bg-zinc-900 dark:bg-zinc-50" : "bg-zinc-200 dark:bg-zinc-700"
            }`}
          >
            <span
              className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform dark:bg-zinc-900 ${
                form.is_public ? "translate-x-4" : "translate-x-0.5"
              }`}
            />
          </div>
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            {form.is_public ? "공개" : "비공개"}
          </span>
        </label>
        <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full px-5 py-2.5 text-sm text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {loading ? "저장 중..." : initial ? "수정하기" : "저장하기"}
        </button>
        </div>
      </div>
    </form>
  );
}
