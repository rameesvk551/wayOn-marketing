import React, { useState } from 'react';
import { exportLeads } from '../services/leadMining.api';
import type { ExportFormat } from '../types';

interface ExportLeadsButtonProps {
  jobId: string;
  disabled?: boolean;
}

export const ExportLeadsButton: React.FC<ExportLeadsButtonProps> = ({
  jobId,
  disabled = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async (format: ExportFormat) => {
    setLoading(true);
    setError(null);
    try {
      await exportLeads(jobId, format);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleExport('csv')}
        disabled={disabled || loading}
        className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? 'Exporting...' : 'Export CSV'}
      </button>
      <button
        onClick={() => handleExport('excel')}
        disabled={disabled || loading}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Exporting...' : 'Export Excel'}
      </button>
      {error && <span className="text-sm text-red-600">{error}</span>}
    </div>
  );
};
