import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  // Generate a unique session ID once when app loads
  const [sessionId] = useState(() => {
    const id = crypto.randomUUID();
    //debug
    // console.log("Session ID genereated: ", id);
    return id;
    //debug
  });

  // Whether a document has been uploaded for this session
  const [documentUploaded, setDocumentUploaded] = useState(false);

  //Name of uplaoded file
  const [fileName, setFileName] = useState("");

  //All messages in chat
  const [messages, setMessage] = useState([]);

  //Whether we are waiting for AI response
  const [isLoading, setIsLoading] = useState(false);

  //Add a new message to the chat
  const addMessage = (role, content, sources = []) => {
    setMessage((prev) => [...prev, { role, content, sources }]);
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
