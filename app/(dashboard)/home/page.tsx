"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useStudyLogs } from "@/hooks/useStudyLogs";
import { StudyLogCard } from "@/components/study-log/StudyLogCard";
import { formatDuration } from "@/lib/utils";
import type { Statistics } from "@/types";

export default function HomePage() {
  const { user } = useAuth();
  const { logs, loading } = useStudyLogs();
  const [stats, setStats] = useState<Statistics | null>(null);

  useEffect(() => {
    fetch("/api/statistics")
      .then((r) => r.json())
      .then((r) => setStats(r.data));
  }, []);

  const displayName = user?.name ?? user?.email?.split("@")[0];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          안녕하세요, {displayName}님
        </h1>
        <p className="mt-1 text-zinc-500">오늘도 꾸준히 성장하고 있어요!</p>
      </div>

      {stats && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="총 학습 기록" value={`${stats.total_logs}개`} accent="indigo" />
          <StatCard label="총 학습 시간" value={formatDuration(stats.total_minutes)} accent="violet" />
          <StatCard label="이번 주 기록" value={`${stats.weekly_logs}개`} />
          <StatCard label="이번 달 학습" value={formatDuration(stats.monthly_minutes)} />
        </div>
      )}

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">
            최근 학습 기록
          </h2>
          <Link
            href="/logs"
            className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50"
          >
            전체 보기
          </Link>
        </div>

        {loading ? (
          <p className="text-sm text-zinc-400">불러오는 중...</p>
        ) : logs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-200 p-8 text-center dark:border-zinc-700">
            <p className="text-sm text-zinc-500">아직 학습 기록이 없습니다.</p>
            <Link
              href="/logs/new"
              className="mt-3 inline-block rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900"
            >
              첫 기록 작성하기
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.slice(0, 3).map((log) => (
              <StudyLogCard key={log.id} log={log} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: "indigo" | "violet" }) {
  const gradients = {
    indigo: "bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-100 dark:from-indigo-950/30 dark:to-blue-950/30 dark:border-indigo-900/30",
    violet: "bg-gradient-to-br from-violet-50 to-purple-50 border-violet-100 dark:from-violet-950/30 dark:to-purple-950/30 dark:border-violet-900/30",
  };
  const textColors = {
    indigo: "text-indigo-700 dark:text-indigo-300",
    violet: "text-violet-700 dark:text-violet-300",
  };

  return (
    <div className={`rounded-xl border p-4 ${accent ? gradients[accent] : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"}`}>
      <p className="text-xs text-zinc-500">{label}</p>
      <p className={`mt-1 text-xl font-semibold ${accent ? textColors[accent] : "text-zinc-900 dark:text-zinc-50"}`}>
        {value}
      </p>
    </div>
  );
}
