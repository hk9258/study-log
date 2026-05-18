"use client";

import { useEffect, useState } from "react";
import { formatDuration } from "@/lib/utils";
import type { ProfileData } from "@/types";

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((r) => setProfile(r.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="py-12 text-center text-sm text-zinc-400">불러오는 중...</p>;
  }

  if (!profile) return null;

  const { user, stats } = profile;
  const displayName = user.name ?? user.email?.split("@")[0];

  return (
    <div className="space-y-8">
      {/* Profile header */}
      <div className="flex items-center gap-4">
        {user.avatar_url ? (
          <img src={user.avatar_url} alt="" className="h-16 w-16 rounded-full" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-700">
            <span className="text-2xl font-semibold text-zinc-500">
              {displayName?.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            {displayName}
          </h1>
          <p className="text-sm text-zinc-500">{user.email}</p>
        </div>
      </div>

      {/* Stats grid */}
      <div>
        <h2 className="mb-3 font-semibold text-zinc-900 dark:text-zinc-50">학습 통계</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <StatCard label="총 학습 기록" value={`${stats.total_logs}개`} />
          <StatCard label="총 학습 시간" value={formatDuration(stats.total_minutes)} />
          <StatCard label="이번 주 기록" value={`${stats.weekly_logs}개`} />
          <StatCard label="이번 달 학습" value={formatDuration(stats.monthly_minutes)} />
          <StatCard
            label="연속 학습"
            value={`${stats.streak}일`}
            highlight={stats.streak > 0}
          />
        </div>
      </div>

      {/* Top tags */}
      {stats.top_tags.length > 0 && (
        <div>
          <h2 className="mb-3 font-semibold text-zinc-900 dark:text-zinc-50">자주 사용한 태그</h2>
          <div className="flex flex-wrap gap-2">
            {stats.top_tags.map(({ tag, count }) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              >
                <span className="text-zinc-700 dark:text-zinc-300">{tag}</span>
                <span className="text-xs text-zinc-400">{count}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Monthly breakdown */}
      {stats.monthly_breakdown.length > 0 && (
        <div>
          <h2 className="mb-3 font-semibold text-zinc-900 dark:text-zinc-50">월별 학습 현황</h2>
          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            {stats.monthly_breakdown.map(({ month, count, minutes }, i) => {
              const [year, m] = month.split("-");
              return (
                <div
                  key={month}
                  className={`flex items-center justify-between px-4 py-3 ${
                    i < stats.monthly_breakdown.length - 1
                      ? "border-b border-zinc-100 dark:border-zinc-800"
                      : ""
                  }`}
                >
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {year}년 {parseInt(m)}월
                  </span>
                  <div className="flex items-center gap-4 text-sm text-zinc-500">
                    <span>{count}개</span>
                    <span className="w-20 text-right">{formatDuration(minutes)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        highlight
          ? "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30"
          : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
      }`}
    >
      <p className="text-xs text-zinc-500">{label}</p>
      <p
        className={`mt-1 text-xl font-semibold ${
          highlight
            ? "text-amber-600 dark:text-amber-400"
            : "text-zinc-900 dark:text-zinc-50"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
