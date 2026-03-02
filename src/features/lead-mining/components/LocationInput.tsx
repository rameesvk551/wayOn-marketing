import React from 'react';

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const LocationInput: React.FC<LocationInputProps> = ({
  value,
  onChange,
  placeholder = 'e.g. New York, NY',
}) => (
  <div className="flex flex-col gap-1">
    <label htmlFor="location" className="text-sm font-medium text-gray-700">
      Location
    </label>
    <input
      id="location"
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
    />
  </div>
);
