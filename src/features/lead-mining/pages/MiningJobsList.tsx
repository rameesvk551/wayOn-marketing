import React from 'react';
import { useMiningJobs } from '../hooks/useMiningJobs';
import { JobProgressCard } from '../components/JobProgressCard';
import type { MiningJob } from '../types';

interface MiningJobsListProps {
  onSelectJob?: (jobId: string) => void;
}

export const MiningJobsList: React.FC<MiningJobsListProps> = ({ onSelectJob }) => {
  const { data, loading, error, page, setPage, refetch } = useMiningJobs();

  if (loading && !data) {
    return <div className="py-8 text-center text-gray-500">Loading jobs...</div>;
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-600">
        {error}
        <button onClick={refetch} className="ml-2 underline">Retry</button>
      </div>
    );
  }

  const jobs = data?.data ?? [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Mining Jobs</h2>
        <button onClick={refetch} className="text-sm text-blue-600 hover:underline">
          Refresh
        </button>
      </div>

      {jobs.length === 0 ? (
        <p className="py-8 text-center text-gray-500">No mining jobs yet. Start one!</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job: MiningJob) => (
            <div
              key={job._id}
              onClick={() => onSelectJob?.(job._id)}
              className={onSelectJob ? 'cursor-pointer' : ''}
            >
              <JobProgressCard job={job} />
            </div>
          ))}
        </div>
      )}

      {data && data.pages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded border px-3 py-1 text-sm disabled:opacity-40"
          >
            Prev
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {data.pages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(data.pages, p + 1))}
            disabled={page === data.pages}
            className="rounded border px-3 py-1 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
