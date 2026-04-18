import { useState } from "react";
import { useApp } from "../context/AppContext";
import { uploadPDF } from "../services/api";

export default function FileUplaod() {
  const { sessionId, setDocumentUplaoded, setFilename } = useApp();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;
    if (!file.name.endsWith(".pdf")) {
      setError("Only PDF files are accepted.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      await uploadPDF(file, sessionId);
      setFilename(file.name);
      setDocumentUplaoded(true);
    } catch (err) {
      setError("Uplaod failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleChange = (e) => {
    handleFile(e.target.files[0]);
  };
  return (
    <div className="flex flex-col items-center justify-center mon-h-screen bg-gray-950 p-6">
      <div className="w-full max-w-lg">
        {/* {Header} */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">RAG CHATBOT</h1>
          <p className="text-gray-400 text-lg">
            Upload a PDF and chat with it using AI
          </p>
        </div>

        {/* {Upload Area} */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          className={`border-2 border-dashed rounded-2x1 p-12 text-center transition-all duration-200 cursor-pointer 
          ${
            dragOver
              ? "border-blue-400 bg-blue-950"
              : "border-gray-700 bg-gray-900 hover:border-gray-500"
          }`}
          onClick={() => document.getElementById("fileInput").click()}
        >
          {/* {Upload Icon} */}
          <div className=" text-5x1 mb-4">📃</div>
          {uploading ? (
            <div className="text-blue-400 text-lg font-medium">
              Uplaoding and processing....
            </div>
          ) : (
            <>
              <p className="text-white text-lg font-medium mb-2">
                Drop your PDF here
              </p>
              <p className="text-gray-500 text-sm">or click browse files</p>
            </>
          )}
          <input
            id="fileInput"
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleChange}
          />
        </div>
        {/* {Error Message} */}
        {error && (
          <p className="text-red-400 text-sm text-center mt-4">{error}</p>
        )}
        <p className="text-gray-600 text-xs text-center mt-6"></p>
      </div>
    </div>
  );
}
