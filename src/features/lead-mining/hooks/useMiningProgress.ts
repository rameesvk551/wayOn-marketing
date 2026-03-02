import { useState, useEffect, useRef } from 'react';
import { getJobProgress } from '../services/leadMining.api';
import type { JobProgress } from '../types';

export const useMiningProgress = (jobId: string | null, pollInterval = 3000) => {
  const [progress, setProgress] = useState<JobProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!jobId) return;

    const poll = async () => {
      try {
        const data = await getJobProgress(jobId);
        setProgress(data);
        if (data.status === 'completed' || data.status === 'failed') {
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to fetch progress');
      }
    };

    poll();
    intervalRef.current = setInterval(poll, pollInterval);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [jobId, pollInterval]);

  return { progress, error };
};
