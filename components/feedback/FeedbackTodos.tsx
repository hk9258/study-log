"use client";

import { useState } from "react";

interface Props {
  content: string | null | undefined;
}

export function FeedbackTodos({ content }: Props) {
  const items = (content ?? "")
    .split("\n")
    .map((line) => line.replace(/^-\s*/, "").trim())
    .filter(Boolean);

  const [checked, setChecked] = useState<Record<number, boolean>>({});

  if (items.length === 0) return null;

  const toggle = (i: number) =>
    setChecked((prev) => ({ ...prev, [i]: !prev[i] }));

  return (
    <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        실천 TODO
      </h4>
      <ul className="mt-3 space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <button
              onClick={() => toggle(i)}
              className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                checked[i]
                  ? "border-zinc-900 bg-zinc-900 dark:border-zinc-50 dark:bg-zinc-50"
                  : "border-zinc-300 bg-white dark:border-zinc-600 dark:bg-zinc-700"
              }`}
            >
              {checked[i] && (
                <svg
                  className="h-2.5 w-2.5 text-white dark:text-zinc-900"
                  fill="none"
                  viewBox="0 0 10 10"
                >
                  <path
                    d="M1.5 5l2.5 2.5 4.5-4.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
            <span
              className={`text-sm leading-relaxed transition-colors ${
                checked[i]
                  ? "text-zinc-400 line-through dark:text-zinc-500"
                  : "text-zinc-700 dark:text-zinc-300"
              }`}
            >
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
