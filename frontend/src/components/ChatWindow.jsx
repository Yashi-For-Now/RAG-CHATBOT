import { useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import MessageBubble from "./MessageBubble";

export default function ChatWindow() {
  const { messages, isLoading, fileName } = useApp();
  const bottomRef = useRef(null);

  // Autoscroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="max-w-3x1 mx-auto">
        {/* Document Indicator  */}
        <div className="text-center mb-6">
          <span className="bg-gray-800 text-green-400 text-xs px-4 py-2 rounded-full border border-gray-700">
            ✅ {fileName} - Ready to chat
          </span>
        </div>
        {/* Empty state  */}
        {messages.length === 0 && (
          <div className="text-center mt-20">
            <p className="text-gray-500 text-lg">
              Ask anything about your document.
            </p>
            <p className="text-gray-700 text-sm mt-2">
              Your questions and answers will appear here.
            </p>
          </div>
        )}
        {/* Messages  */}
        {messages.map((message, index) => (
          <MessageBubble key={index} message={message} />
        ))}

        {/* Loading Indicator  */}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-800 rounded-2x1 rounded-tl-sm px-4 py-3">
              <div className="flex gap-1 items-center">
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        )}
        {/* Invisible div to scroll to */}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
