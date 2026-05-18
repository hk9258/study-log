"use client";

import Link from "next/link";
import { useStudyLogs } from "@/hooks/useStudyLogs";
import { StudyLogList } from "@/components/study-log/StudyLogList";

export default function LogsPage() {
  const { logs, loading } = useStudyLogs();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          학습 기록
        </h1>
        <Link
          href="/logs/new"
          className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          새 기록 작성
        </Link>
      </div>
      {loading ? (
        <p className="text-sm text-zinc-400">불러오는 중...</p>
      ) : (
        <StudyLogList logs={logs} />
      )}
    </div>
  );
}
