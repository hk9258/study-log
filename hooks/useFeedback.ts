"use client";

import { useCallback, useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import type { Feedback } from "@/types";

export function useFeedback(studyLogId: string) {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [versions, setVersions] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchFeedback = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<{ data: Feedback | null; versions: Feedback[] }>(
        `/api/feedbacks?study_log_id=${studyLogId}`
      );
      setFeedback(res.data);
      setVersions(res.versions);
    } finally {
      setLoading(false);
    }
  }, [studyLogId]);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  const generate = async () => {
    setGenerating(true);
    try {
      const res = await apiClient.post<{ data: Feedback }>("/api/feedbacks", {
        study_log_id: studyLogId,
      });
      setFeedback(res.data);
      setVersions((prev) => [res.data, ...prev]);
    } finally {
      setGenerating(false);
    }
  };

  const rate = async (id: string, rating: number | null) => {
    const res = await apiClient.patch<{ data: Feedback }>(`/api/feedbacks/${id}`, { rating });
    setFeedback((prev) => (prev?.id === id ? res.data : prev));
    setVersions((prev) => prev.map((v) => (v.id === id ? res.data : v)));
  };

  return { feedback, versions, loading, generating, generate, setFeedback, setVersions, rate, refetch: fetchFeedback };
}
