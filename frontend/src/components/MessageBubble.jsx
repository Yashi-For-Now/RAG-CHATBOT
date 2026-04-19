import SourceCitation from "./SourceCitation";

export default function MessageBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : " justify-start"} mb-4`}>
      <div className={`max-w-[75%] ${isUser ? "order-2" : "order-1"}`}>
        {/* {Role Label} */}
        <p
          className={`text-xs mb-1 ${
            isUser ? "text-right text-gray-500" : "text-gray-500"
          }`}
        >
          {isUser ? "You" : "AI"}
        </p>
        {/* {Message Bubble} */}
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? "bg-blue-600 text-white rounded-tr-sm"
              : "bg-gray-800 text-gray-100 rounded-tl-sm"
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>

        {/* {Source - only for AI messages} */}
        {!isUser && <SourceCitation sources={message.sources} />}
      </div>
    </div>
  );
}
