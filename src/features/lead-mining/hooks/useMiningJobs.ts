import { useState, useEffect, useCallback } from 'react';
import { getMiningJobs } from '../services/leadMining.api';
import type { MiningJob, PaginatedResult } from '../types';

export const useMiningJobs = (initialPage = 1, limit = 20) => {
  const [data, setData] = useState<PaginatedResult<MiningJob> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getMiningJobs(page, limit);
      setData(result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return { data, loading, error, page, setPage, refetch: fetchJobs };
};
