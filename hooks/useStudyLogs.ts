"use client";

import { useCallback, useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import type { StudyLog, StudyLogInput } from "@/types";

export function useStudyLogs() {
  const [logs, setLogs] = useState<StudyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<{ data: StudyLog[] }>("/api/study-logs");
      setLogs(res.data);
      setError(null);
    } catch {
      setError("학습 기록을 불러올 수 없습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const createLog = async (input: StudyLogInput) => {
    const res = await apiClient.post<{ data: StudyLog }>("/api/study-logs", input);
    setLogs((prev) => [res.data, ...prev]);
    return res.data;
  };

  const updateLog = async (id: string, input: Partial<StudyLogInput>) => {
    const res = await apiClient.patch<{ data: StudyLog }>(
      `/api/study-logs/${id}`,
      input
    );
    setLogs((prev) => prev.map((l) => (l.id === id ? res.data : l)));
    return res.data;
  };

  const deleteLog = async (id: string) => {
    await apiClient.delete(`/api/study-logs/${id}`);
    setLogs((prev) => prev.filter((l) => l.id !== id));
  };

  return { logs, loading, error, createLog, updateLog, deleteLog, refresh: fetchLogs };
}
