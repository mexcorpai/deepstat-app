import React from 'react';
import type { GroundingAttribution } from '../types';

interface AttributionProps {
  sources: GroundingAttribution[];
}

const Attribution = ({ sources }: AttributionProps) => {
  if (sources.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
      <h4 className="text-md font-semibold text-gray-300 mb-3">Analysis Sources</h4>
      <ul className="space-y-2">
        {sources.map((source, index) => (
          <li key={index}>
            <a
              href={source.uri}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 hover:text-sky-300 text-sm truncate block transition-colors"
              title={source.uri}
            >
              {source.title || source.uri}
            </a>
          </li>
        ))}
      </ul>
      <p className="text-xs text-gray-500 mt-3">
        Powered by Google Search for up-to-date information.
      </p>
    </div>
  );
};

export default Attribution;
