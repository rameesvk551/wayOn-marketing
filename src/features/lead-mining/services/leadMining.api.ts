import type {
  Lead,
  MiningJob,
  JobProgress,
  CreateJobPayload,
  PaginatedResult,
  ExportFormat,
} from '../types';

const API_BASE = import.meta.env.PUBLIC_API_URL || 'http://localhost:5000/api';

const handleResponse = async <T>(res: Response): Promise<T> => {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || 'Request failed');
  }
  const json = await res.json();
  return json.data as T;
};

export const createMiningJob = async (payload: CreateJobPayload): Promise<MiningJob> => {
  const res = await fetch(`${API_BASE}/lead-mining/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<MiningJob>(res);
};

export const getMiningJobs = async (page = 1, limit = 20): Promise<PaginatedResult<MiningJob>> => {
  const res = await fetch(`${API_BASE}/lead-mining/jobs?page=${page}&limit=${limit}`);
  return handleResponse<PaginatedResult<MiningJob>>(res);
};

export const getMiningJob = async (jobId: string): Promise<MiningJob> => {
  const res = await fetch(`${API_BASE}/lead-mining/jobs/${jobId}`);
  return handleResponse<MiningJob>(res);
};

export const getJobProgress = async (jobId: string): Promise<JobProgress> => {
  const res = await fetch(`${API_BASE}/lead-mining/jobs/${jobId}/progress`);
  return handleResponse<JobProgress>(res);
};

export const getMiningResults = async (
  jobId: string,
  page = 1,
  limit = 50
): Promise<PaginatedResult<Lead>> => {
  const res = await fetch(
    `${API_BASE}/lead-mining/jobs/${jobId}/results?page=${page}&limit=${limit}`
  );
  return handleResponse<PaginatedResult<Lead>>(res);
};

export const exportLeads = async (jobId: string, format: ExportFormat = 'csv'): Promise<void> => {
  const res = await fetch(`${API_BASE}/lead-mining/export`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jobId, format }),
  });
  if (!res.ok) throw new Error('Export failed');
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `leads-${jobId}.${format === 'excel' ? 'xlsx' : 'csv'}`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};
