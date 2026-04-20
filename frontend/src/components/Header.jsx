import { useState } from "react";
import { useApp } from "../context/AppContext";
import { deleteSession } from "../services/api";
import HistorySidebar from "./HistorySidebar";

export default function Header() {
  const { fileName, sessionId, setDocumentUploaded, setFileName, setMessages } =
    useApp();
  const [showHistory, setShowHistory] = useState(false);
  const [clearing, setClearing] = useState(false);

  const handleClearSession = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to start over? This will delete all chat history and the uploaded document."
    );

    if (!confirmed) return;

    setClearing(true);
    try {
      await deleteSession(sessionId);
    } catch (err) {
      //session might not exist yet
    } finally {
      //reset UI regardless
      localStorage.removeItem("rag_session_id");
      setMessages([]);
      setFileName("");
      setDocumentUploaded(false);
      setClearing(false);
    }
  };

  return (
    <>
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        {/* Left-App name  */}
        <div className="flex items-center gap-3">
          <span className="text-white font-semibold text-lg">RAG Chatbot</span>
          <span className="text-gray-600 text-xs hidden sm:block">|</span>
          <span className="text-green-400 text-xs hodden sm:block truncate max-w-48">
            📃 {fileName}
          </span>
        </div>
        {/* Right-Action buttons  */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHistory(true)}
            className="text-gray-400 hover:text-white text-sm px-3 py-1.5 rounded-lg hover: bg-gray-800 transition-colors"
          >
            History
          </button>
          <button
            onClick={handleClearSession}
            disabled={clearing}
            className="text-red-499 hover:text-red-300 text-sm px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {clearing ? "Clearing...." : "Clear"}
          </button>
        </div>
      </div>
      {/* History Sidebar  */}
      {showHistory && <HistorySidebar onClose={() => setShowHistory(false)} />}
    </>
  );
}
