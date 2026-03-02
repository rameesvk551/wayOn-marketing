import React from 'react';
import { useLeads } from '../hooks/useLeads';
import { LeadsTable } from '../components/LeadsTable';
import { ExportLeadsButton } from '../components/ExportLeadsButton';

interface MiningResultsProps {
  jobId: string;
}

export const MiningResults: React.FC<MiningResultsProps> = ({ jobId }) => {
  const { data, loading, error, page, setPage, refetch } = useLeads(jobId);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">
          Mining Results
          {data && <span className="ml-2 text-sm font-normal text-gray-500">({data.total} leads)</span>}
        </h2>
        <div className="flex items-center gap-3">
          <button onClick={refetch} className="text-sm text-blue-600 hover:underline">
            Refresh
          </button>
          <ExportLeadsButton jobId={jobId} disabled={!data?.total} />
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      <LeadsTable leads={data?.data ?? []} loading={loading} />

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
