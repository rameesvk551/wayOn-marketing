import React from 'react';
import type { Lead } from '../types';

interface LeadsTableProps {
  leads: Lead[];
  loading?: boolean;
}

export const LeadsTable: React.FC<LeadsTableProps> = ({ leads, loading = false }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-500">
        Loading leads...
      </div>
    );
  }

  if (!leads.length) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-500">
        No leads found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
        <thead className="bg-gray-50">
          <tr>
            {['Name', 'Phone', 'Email', 'Website', 'Address', 'Source'].map((col) => (
              <th
                key={col}
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {leads.map((lead) => (
            <tr key={lead._id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-800">{lead.name || '—'}</td>
              <td className="px-4 py-3 text-gray-600">{lead.phones.join(', ') || '—'}</td>
              <td className="px-4 py-3 text-gray-600">{lead.emails.join(', ') || '—'}</td>
              <td className="px-4 py-3">
                {lead.website ? (
                  <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {lead.website.replace(/^https?:\/\//, '').slice(0, 30)}
                  </a>
                ) : '—'}
              </td>
              <td className="px-4 py-3 text-gray-600">{lead.address || '—'}</td>
              <td className="px-4 py-3">
                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                  {lead.source}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
