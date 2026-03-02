import React, { useState } from 'react';
import { CreateMiningJob } from './CreateMiningJob';
import { MiningJobsList } from './MiningJobsList';
import { MiningResults } from './MiningResults';
import { useMiningProgress } from '../hooks/useMiningProgress';
import type { MiningJob } from '../types';

export const LeadMiningDashboard: React.FC = () => {
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { progress } = useMiningProgress(activeJobId);

  const handleJobCreated = (job: MiningJob) => {
    setActiveJobId(job._id);
    setShowCreateForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lead Mining</h1>
            <p className="text-sm text-gray-500">Mine leads from Google Maps and business directories</p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            {showCreateForm ? 'Cancel' : '+ New Mining Job'}
          </button>
        </div>

        {/* Active Job Progress Banner */}
        {activeJobId && progress && (
          <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-800">
                Active Job: {progress.status} — {progress.progress}% complete
                ({progress.leadsCount} leads found)
              </span>
              <button onClick={() => setActiveJobId(null)} className="text-blue-600 hover:underline text-sm">
                Dismiss
              </button>
            </div>
            <div className="mt-2 h-1.5 w-full rounded-full bg-blue-200">
              <div
                className="h-1.5 rounded-full bg-blue-600 transition-all duration-300"
                style={{ width: `${progress.progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left column */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {showCreateForm && (
              <CreateMiningJob onJobCreated={handleJobCreated} />
            )}
            <MiningJobsList onSelectJob={setActiveJobId} />
          </div>

          {/* Right column - Results */}
          <div className="lg:col-span-2">
            {activeJobId ? (
              <MiningResults jobId={activeJobId} />
            ) : (
              <div className="flex items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-24 text-center text-gray-400">
                <div>
                  <p className="text-lg font-medium">Select a job to view results</p>
                  <p className="mt-1 text-sm">Or start a new mining job</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
