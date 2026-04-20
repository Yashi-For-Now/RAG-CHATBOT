import { useState } from "react";
import { useApp } from "../context/AppContext";
import { sendMessage } from "../services/api";

export default function InputBar() {
  const { sessionId, isLoading, setIsLoading, addMessage } = useApp();
  const [input, setInput] = useState("");

  const handleSend = async () => {
    const question = input.trim();
    if (!question || isLoading) return;

    // console.log("Sending with session ID:", sessionId);
    //Add user message immediately
    addMessage("user", question);
    setInput("");
    setIsLoading(true);

    try {
      //debug
      // console.log("Sending message with session ID: ", sessionId);
      //debug
      const data = await sendMessage(question, sessionId);
      //debug
      // console.log("Chat response: ", data);
      //debug
      addMessage("ai", data.answer, data.sources);
    } catch (err) {
      addMessage("ai", "Sorry, something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    //Send on Enter, new line on Shift+Enter

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gray-800 bg-gray-950 p-4">
      <div className="max-w-3x1 mx-auto flex gap-3 items-end">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about your document <3"
          rows={1}
          className="flex-1 bg-gray-800 text-white placeholder-gray-500 rounded-x1 px-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700"
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-x1 px-5 py-3 text-sm font-medium transition-colors"
        >
          {isLoading ? "..." : "Send"}
        </button>
      </div>
      <p className="text-center text-gray-700 text-xs mt-2">
        Please Enter to send, Shift+Enter for new line.
      </p>
    </div>
  );
}
