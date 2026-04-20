import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { getHistory } from "../services/api";

export default function HistorySidebar({ onClose }) {
  const { sessionId } = useApp();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  //fetch history when sidebar opens
  useEffect(() => {
    // console.log("Fetching history for session ID:", sessionId);
    const fetchHistory = async () => {
      try {
        const data = await getHistory(sessionId);
        setHistory(data);
      } catch (err) {
        if (err.response?.status === 404) {
          setHistory([]); //no history yet
        } else {
          setError("Failed to load history.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [sessionId]);

  return (
    //Overlay: clicking outside closes sidebar
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end"
      onClick={onClose}
    >
      {/* Side Panel: stop click from closing when clicking inside */}
      <div
        className="bg-gray-900 w-full max-w-md h-full flex flex-col border-l border-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sidebar Header  */}
        <div className="flex items-center justify-between px-5 pt-4 border-b border-gray-800">
          <h2 className="text-white font-semibold text-lg"> Chat History</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-xl"
          >
            ❌
          </button>
        </div>

        {/* Sidebar Content  */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {loading && (
            <p className="text-gray-500 text-sm text-center mt-10">
              Loading History...
            </p>
          )}
          {error && (
            <p className="text-red-400 text-sm text-center mt-10">{error}</p>
          )}

          {!loading && !error && history.length === 0 && (
            <p className="text-gray-500 text-sm text-center mt-10">
              No history yet. Start asking questions!
            </p>
          )}

          {!loading &&
            !error &&
            history.map((item) => (
              <div
                key={item.id}
                className="mb-5 pb-5 border-b border-gray-800 last:border-0"
              >
                {/* timestamp */}
                <p className="text-gray-600 text-xs mb-2">
                  {new Date(item.timestamp).toLocaleString()}
                </p>

                {/* question */}
                <div className="ng-gray-800 rounded-xl px-4 py-3 mb-2">
                  <p className="text-xs text-blue-400 mb-1">You</p>
                  <p className="text-white text-sm">{item.question}</p>
                </div>

                {/* answer */}
                <div className="bg-gray-850 rounded-xl px-4 py-3 border border-gray-700">
                  <p className="text-xs text-green-400 mb-1">AI</p>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            ))}
        </div>
        {/* footer  */}
        <div className="px-5 py-3 border-t border-gray-800">
          <p className="text-gray-600 text-xs text-center">
            {history.length} conversation{history.length !== 1 ? "s" : ""} in
            this session.
          </p>
        </div>
      </div>
    </div>
  );
}
