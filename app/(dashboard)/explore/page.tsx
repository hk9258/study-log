"use client";

import { useCallback, useState } from "react";
import { StudyLogCard } from "@/components/study-log/StudyLogCard";
import type { StudyLog } from "@/types";

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [results, setResults] = useState<StudyLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const search = useCallback(async () => {
    setLoading(true);
    setSearched(true);
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      if (tagInput.trim()) params.set("tags", tagInput.trim());
      const res = await fetch(`/api/explore?${params}`);
      const json = await res.json();
      setResults(json.data ?? []);
    } finally {
      setLoading(false);
    }
  }, [query, tagInput]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") search();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">탐색</h1>
        <p className="mt-1 text-zinc-500">학습 기록을 검색하고 탐색해보세요.</p>
      </div>

      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="제목 또는 내용 검색..."
            className="flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
          <button
            onClick={search}
            disabled={loading}
            className="rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {loading ? "검색 중..." : "검색"}
          </button>
        </div>
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="태그 필터 (쉼표로 구분, 예: React, TypeScript)"
          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
      </div>

      {loading && (
        <p className="text-center text-sm text-zinc-400">검색 중...</p>
      )}

      {!loading && searched && results.length === 0 && (
        <div className="rounded-xl border border-dashed border-zinc-200 p-8 text-center dark:border-zinc-700">
          <p className="text-sm text-zinc-500">검색 결과가 없습니다.</p>
          <p className="mt-1 text-xs text-zinc-400">다른 키워드나 태그로 시도해보세요.</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-zinc-500">{results.length}개의 기록을 찾았습니다.</p>
          {results.map((log) => (
            <StudyLogCard key={log.id} log={log} />
          ))}
        </div>
      )}

      {!searched && (
        <div className="rounded-xl border border-dashed border-zinc-200 p-8 text-center dark:border-zinc-700">
          <p className="text-sm text-zinc-500">검색어를 입력하거나 태그를 지정해 탐색해보세요.</p>
          <p className="mt-1 text-xs text-zinc-400">검색어 없이 검색하면 전체 기록을 볼 수 있습니다.</p>
        </div>
      )}
    </div>
  );
}
