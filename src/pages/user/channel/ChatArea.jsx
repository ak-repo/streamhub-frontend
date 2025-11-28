import { useState, useEffect, useRef } from "react";
import { useAuth, useChannel } from "../../../context/context";

const GATEWAY_WS = "ws://localhost:8080/api/v1/ws";

export default function ChatArea() {
  const { user } = useAuth(); // user: {id, username, email...}
  const { chanID, messages, setMessages } = useChannel(); // selected channel id

  const [inputMessage, setInputMessage] = useState("");
  const [status, setStatus] = useState("disconnected");

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Reset messages on channel change
  useEffect(() => {
    setMessages([]);
  }, [chanID]);

  // Connect WebSocket when channel changes
  useEffect(() => {
    if (!chanID || !user?.id) return;

    // Close existing connection
    if (socketRef.current) {
      socketRef.current.close();
    }

    const ws = new WebSocket(`${GATEWAY_WS}?user_id=${user.id}`);
    socketRef.current = ws;

    ws.onopen = () => {
      setStatus("connected");

      // JOIN channel
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
        setMessages((prev) => [...prev, msg]);
      } catch (err) {
        console.error("WS parse error:", err);
      }
    };

    ws.onerror = () => setStatus("error");
    ws.onclose = () => setStatus("disconnected");

    return () => ws.close();
  }, [chanID, user?.id]);

  // Auto-scroll to bottom when new messages come
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
    <div className="flex flex-col h-full bg-gray-50">
      {/* MESSAGES */}
      <main className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages &&
          messages.map((msg, idx) => {
            const isMe = msg.user_id === user?.id;

            return (
              <div
                key={idx}
                className={`flex items-start ${
                  isMe ? "justify-end" : "justify-start"
                }`}
              >
                {/* OTHER USERS (LEFT) */}
                {!isMe && (
                  <div className="flex flex-col max-w-[70%]">
                    <p className="text-xs font-semibold text-gray-600 mb-1 pl-1">
                      {msg.username || msg.user_id}
                    </p>

                    <div className="bg-white border rounded-lg p-3 shadow-sm">
                      <p className="text-gray-800 break-words">{msg.content}</p>

                      <span className="text-[10px] text-gray-400 mt-1 block">
                        {msg.timestamp_ms
                          ? new Date(msg.timestamp_ms).toLocaleTimeString()
                          : "Just now"}
                      </span>
                    </div>
                  </div>
                )}

                {/* MY MESSAGES (RIGHT) */}
                {isMe && (
                  <div className="max-w-[70%]">
                    <div className="bg-blue-600 text-white rounded-lg p-3 shadow-sm">
                      <p className="break-words">{msg.content}</p>

                      <span className="text-[10px] text-blue-200 mt-1 block text-right">
                        {msg.timestamp_ms
                          ? new Date(msg.timestamp_ms).toLocaleTimeString()
                          : "Just now"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

        <div ref={messagesEndRef} />
      </main>

      {/* INPUT */}
      <footer className="bg-white p-4 border-t">
        <form onSubmit={sendMessage} className="max-w-4xl mx-auto flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={
              status === "connected" ? "Type a message..." : "Connecting..."
            }
            className="flex-1 border rounded-full px-4 py-2 
                       focus:outline-none focus:border-blue-500 
                       focus:ring-1 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={status !== "connected"}
            className="bg-blue-600 text-white px-4 py-2 rounded-full 
                       hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            Send
          </button>
        </form>
      </footer>
    </div>
  );
}
