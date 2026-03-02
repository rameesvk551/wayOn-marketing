import { useState, useEffect, useCallback } from 'react';
import { getMiningResults } from '../services/leadMining.api';
import type { Lead, PaginatedResult } from '../types';

export const useLeads = (jobId: string | null, initialPage = 1, limit = 50) => {
  const [data, setData] = useState<PaginatedResult<Lead> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);

  const fetchLeads = useCallback(async () => {
    if (!jobId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getMiningResults(jobId, page, limit);
      setData(result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  }, [jobId, page, limit]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  return { data, loading, error, page, setPage, refetch: fetchLeads };
};
