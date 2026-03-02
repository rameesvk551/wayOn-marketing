export interface Lead {
  _id: string;
  name: string | null;
  phones: string[];
  emails: string[];
  website: string | null;
  address: string | null;
  source: 'google_maps' | 'directory' | 'manual';
  location: string;
  keyword: string;
  jobId: string;
  createdAt: string;
}

export interface MiningJob {
  _id: string;
  keyword: string;
  location: string;
  sources: ('google_maps' | 'directory')[];
  status: 'pending' | 'running' | 'completed' | 'failed';
  totalTasks: number;
  completedTasks: number;
  progress: number;
  leadsCount: number;
  errorMessage?: string;
  createdAt: string;
  finishedAt?: string;
}

export interface JobProgress {
  jobId: string;
  status: MiningJob['status'];
  progress: number;
  completedTasks: number;
  totalTasks: number;
  leadsCount: number;
  finishedAt?: string;
}

export interface CreateJobPayload {
  keyword: string;
  location: string;
  sources: ('google_maps' | 'directory')[];
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export type ExportFormat = 'csv' | 'excel';

export type SourceOption = {
  value: 'google_maps' | 'directory';
  label: string;
};
