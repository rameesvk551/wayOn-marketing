import React from 'react';
import type { SourceOption } from '../types';

const SOURCES: SourceOption[] = [
  { value: 'google_maps', label: 'Google Maps' },
  { value: 'directory', label: 'Yellow Pages Directory' },
];

interface SourceSelectorProps {
  selected: ('google_maps' | 'directory')[];
  onChange: (sources: ('google_maps' | 'directory')[]) => void;
}

export const SourceSelector: React.FC<SourceSelectorProps> = ({ selected, onChange }) => {
  const toggle = (value: 'google_maps' | 'directory') => {
    if (selected.includes(value)) {
      onChange(selected.filter((s) => s !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">Scraping Sources</label>
      <div className="flex flex-wrap gap-3">
        {SOURCES.map((source) => (
          <label key={source.value} className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={selected.includes(source.value)}
              onChange={() => toggle(source.value)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            {source.label}
          </label>
        ))}
      </div>
    </div>
  );
};
