import React from 'react';

interface KeywordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const KeywordInput: React.FC<KeywordInputProps> = ({
  value,
  onChange,
  placeholder = 'e.g. restaurants, plumbers, dentists',
}) => (
  <div className="flex flex-col gap-1">
    <label htmlFor="keyword" className="text-sm font-medium text-gray-700">
      Keyword
    </label>
    <input
      id="keyword"
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
    />
  </div>
);
