import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  // Generate a unique session ID once when app loads
  const [sessionId] = useState(() => {
    const existing = localStorage.getItem("rag_session_id");
    if (existing) return existing;

    const newId = crypto.randomUUID();
    localStorage.setItem("rag_session_id", newId);
    return newId;
  });

  // Whether a document has been uploaded for this session
  const [documentUploaded, setDocumentUploaded] = useState(false);

  //Name of uplaoded file
  const [fileName, setFileName] = useState("");

  //All messages in chat
  const [messages, setMessages] = useState([]);

  //Whether we are waiting for AI response
  const [isLoading, setIsLoading] = useState(false);

  //Add a new message to the chat
  const addMessage = (role, content, sources = []) => {
    setMessages((prev) => [...prev, { role, content, sources }]);
  };

  return (
    <AppContext.Provider
      value={{
        sessionId,
        documentUploaded,
        setDocumentUploaded,
        fileName,
        setFileName,
        messages,
        setMessages,
        isLoading,
        setIsLoading,
        addMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
