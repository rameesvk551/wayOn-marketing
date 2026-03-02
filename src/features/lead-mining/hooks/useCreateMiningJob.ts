import { useState } from 'react';
import { createMiningJob } from '../services/leadMining.api';
import type { MiningJob, CreateJobPayload } from '../types';

export const useCreateMiningJob = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [job, setJob] = useState<MiningJob | null>(null);

  const create = async (payload: CreateJobPayload): Promise<MiningJob | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await createMiningJob(payload);
      setJob(result);
      return result;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create job';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error, job };
};
