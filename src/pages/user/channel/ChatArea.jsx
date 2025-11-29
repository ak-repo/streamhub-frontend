import { useState, useEffect, useRef } from "react";
import { useAuth, useChannel } from "../../../context/context";

const GATEWAY_WS = "ws://localhost:8080/api/v1/ws";

export default function ChatArea() {
  const { user } = useAuth();
  const { chanID, messages, setMessages,  setRefMsg } = useChannel();

  const [inputMessage, setInputMessage] = useState("");
  const [status, setStatus] = useState("disconnected");

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Trigger message reload once at mount
  useEffect(() => {
    setRefMsg((prev) => !prev);
  }, []);

  // Connect WebSocket on channel change
  useEffect(() => {
    if (!chanID || !user?.id) return;

    // Close old connection
    if (socketRef.current) {
      socketRef.current.close();
    }

    const ws = new WebSocket(`${GATEWAY_WS}?user_id=${user.id}`);
    socketRef.current = ws;

    ws.onopen = () => {
      setStatus("connected");

      ws.send(
        JSON.stringify({
          type: "JOIN",
          channel_id: chanID,
          user_id: user.id,
        })
      );
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        // Guarantee array update
        setMessages((prev) => (Array.isArray(prev) ? [...prev, msg] : [msg]));
      } catch (err) {
        console.error("WS parse error:", err);
      }
    };

    ws.onerror = () => setStatus("error");
    ws.onclose = () => setStatus("disconnected");

    return () => ws.close();
  }, [chanID, user?.id]);

  // Auto-scroll when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || status !== "connected") return;

    const payload = {
      type: "MESSAGE",
      channel_id: chanID,
      user_id: user.id,
      username: user.username,
      content: inputMessage,
      timestamp_ms: Date.now(),
    };

    socketRef.current?.send(JSON.stringify(payload));
    setInputMessage("");
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto bg-white dark:bg-gray-800 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-600">
          <div className="p-4 space-y-3">
            {/* Empty state */}
            {Array.isArray(messages) && messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500 py-12">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <p className="text-sm">No messages yet</p>
                <p className="text-xs mt-1">Start a conversation</p>
              </div>
            ) : (
              Array.isArray(messages) &&
              messages.map((msg, idx) => {
                const isMe = msg?.sender_id === user?.id;

                return (
                  <div
                    key={idx}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                        isMe
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {!isMe && (
                        <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          {msg.username || msg.user_id}
                        </div>
                      )}

                      {/* Message */}
                      <div className="text-sm break-words">{msg.content}</div>

                      {/* Timestamp */}
                      <div
                        className={`text-xs mt-1 ${
                          isMe
                            ? "text-gray-400 text-right"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {msg.timestamp_ms
                          ? new Date(msg.timestamp_ms).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Now"}
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="flex-shrink-0 p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
        <form onSubmit={sendMessage} className="flex items-end space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={
              status === "connected" ? "Type a message..." : "Connecting..."
            }
            className="flex-1 p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none focus:ring-1 focus:ring-gray-400 text-sm"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim() || status !== "connected"}
            className={`p-3 rounded-lg text-sm font-medium transition-colors ${
              inputMessage.trim() && status === "connected"
                ? "bg-gray-900 text-white hover:bg-gray-800"
                : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </form>

        {/* Status */}
        <div className="flex items-center justify-center mt-2">
          <div
            className={`w-2 h-2 rounded-full mr-2 ${
              status === "connected"
                ? "bg-green-500 animate-pulse"
                : status === "error"
                ? "bg-red-500"
                : "bg-gray-400"
            }`}
          ></div>
          <span className="text-xs text-gray-500 capitalize">{status}</span>
        </div>
      </div>
    </div>
  );
}
