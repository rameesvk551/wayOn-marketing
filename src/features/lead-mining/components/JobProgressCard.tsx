import React from 'react';
import type { MiningJob } from '../types';

interface JobProgressCardProps {
  job: MiningJob;
}

const STATUS_COLORS: Record<MiningJob['status'], string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  running: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
};

export const JobProgressCard: React.FC<JobProgressCardProps> = ({ job }) => (
  <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
    <div className="flex items-start justify-between">
      <div>
        <h3 className="font-semibold text-gray-800">{job.keyword}</h3>
        <p className="text-sm text-gray-500">{job.location}</p>
      </div>
      <span className={`rounded-full px-2 py-1 text-xs font-medium ${STATUS_COLORS[job.status]}`}>
        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
      </span>
    </div>

    <div className="mt-3">
      <div className="mb-1 flex justify-between text-xs text-gray-500">
        <span>Progress</span>
        <span>{job.progress}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-200">
        <div
          className="h-2 rounded-full bg-blue-600 transition-all duration-300"
          style={{ width: `${job.progress}%` }}
        />
      </div>
    </div>

    <div className="mt-3 flex gap-4 text-sm text-gray-600">
      <span>Leads: <strong>{job.leadsCount}</strong></span>
      <span>Sources: <strong>{job.sources.join(', ')}</strong></span>
    </div>

    {job.errorMessage && (
      <p className="mt-2 text-xs text-red-600">{job.errorMessage}</p>
    )}
  </div>
);
