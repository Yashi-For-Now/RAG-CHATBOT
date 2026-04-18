import { useState } from "react";

export default function SourceCitation({ sources }) {
  const [expanded, setExpanded] = useState(false);

  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-2">
      <button
        on
        onClick={() => setExpanded(!expanded)}
        className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
      >
        {expanded ? "▲ Hide sources" : `▼ Show ${sources.length} source(s)`}
      </button>
      {expanded && (
        <div className="mt-2 space-y-2">
          {sources.map((source, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg p-3 border border-gray-700"
            >
              <p className="text-xs text-blue-400 mb-1">Page {source.page}</p>
              <p className="text-xs text-gray-400 leading-relaxed">
                {source.content}....
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
