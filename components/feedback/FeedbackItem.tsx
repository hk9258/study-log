import type { FeedbackType } from "@/types";

const TYPE_CONFIG: Partial<Record<FeedbackType, { border: string; bg: string }>> = {
  summary:      { border: "border-l-blue-400",    bg: "bg-blue-50 dark:bg-blue-950/20" },
  strengths:    { border: "border-l-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/20" },
  improvements: { border: "border-l-amber-400",   bg: "bg-amber-50 dark:bg-amber-950/20" },
  next_steps:   { border: "border-l-violet-400",  bg: "bg-violet-50 dark:bg-violet-950/20" },
};

interface Props {
  label: string;
  content: string | null | undefined;
  type?: FeedbackType;
}

export function FeedbackItem({ label, content, type }: Props) {
  if (!content) return null;
  const config = type ? TYPE_CONFIG[type] : null;

  return (
    <div
      className={`rounded-xl border-l-4 p-4 ${
        config
          ? `${config.bg} ${config.border}`
          : "border-l-zinc-200 bg-zinc-50 dark:border-l-zinc-600 dark:bg-zinc-800"
      }`}
    >
      <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {label}
      </h4>
      <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
        {content}
      </p>
    </div>
  );
}
