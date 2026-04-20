import { useApp } from "./context/AppContext";
import FileUpload from "./components/FileUpload";
import ChatWindow from "./components/ChatWindow";
import InputBar from "./components/InputBar";
import Header from "./components/Header";

function App() {
  const { documentUploaded } = useApp();

  return (
    <div className="h-screen bg-gray-950 flex flex-col">
      {documentUploaded ? (
        // Chat Window
        <>
          <Header />
          <ChatWindow />
          <InputBar />
        </>
      ) : (
        // Upload Screen
        <FileUpload />
      )}
    </div>
  );
}

export default App;
