import React, { useState } from 'react';
import { KeywordInput } from '../components/KeywordInput';
import { LocationInput } from '../components/LocationInput';
import { SourceSelector } from '../components/SourceSelector';
import { useCreateMiningJob } from '../hooks/useCreateMiningJob';
import type { MiningJob } from '../types';

interface CreateMiningJobProps {
  onJobCreated?: (job: MiningJob) => void;
}

export const CreateMiningJob: React.FC<CreateMiningJobProps> = ({ onJobCreated }) => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [sources, setSources] = useState<('google_maps' | 'directory')[]>(['google_maps']);
  const { create, loading, error } = useCreateMiningJob();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim() || !location.trim() || !sources.length) return;
    const job = await create({ keyword, location, sources });
    if (job && onJobCreated) onJobCreated(job);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-bold text-gray-800">Start New Mining Job</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <KeywordInput value={keyword} onChange={setKeyword} />
        <LocationInput value={location} onChange={setLocation} />
        <SourceSelector selected={sources} onChange={setSources} />

        {error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || !keyword.trim() || !location.trim() || !sources.length}
          className="mt-2 rounded-md bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Starting...' : 'Start Mining'}
        </button>
      </form>
    </div>
  );
};
