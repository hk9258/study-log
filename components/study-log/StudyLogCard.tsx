import Link from "next/link";
import { formatDate, formatDuration } from "@/lib/utils";
import type { StudyLog } from "@/types";

export function StudyLogCard({ log }: { log: StudyLog }) {
  return (
    <Link href={`/logs/${log.id}`}>
      <div className="rounded-xl border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-zinc-900 dark:text-zinc-50">
              {log.title}
            </h3>
            {log.is_public && (
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
                공개
              </span>
            )}
          </div>
          <span className="shrink-0 text-xs text-zinc-400">
            {formatDate(log.study_date)}
          </span>
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-zinc-500">{log.content}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {log.duration_minutes > 0 && (
            <span className="text-xs text-zinc-400">
              {formatDuration(log.duration_minutes)}
            </span>
          )}
          {log.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
