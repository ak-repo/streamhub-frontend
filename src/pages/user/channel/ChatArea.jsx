import { useState, useEffect, useRef } from "react";
import { useAuth, useChannel } from "../../../context/context";

const GATEWAY_WS = "ws://localhost:8080/api/v1/ws";

export default function ChatArea() {
  const { user } = useAuth();
  const { chanID, messages, setMessages, setRefMsg, refMsg, members } = useChannel();

  const [inputMessage, setInputMessage] = useState("");
  const [status, setStatus] = useState("disconnected");

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const safeMessages = Array.isArray(messages) ? messages : [];

  // Trigger message reload once at mount
  useEffect(() => {
    setRefMsg((prev) => !prev);
  }, [setRefMsg]);

  // Connect WebSocket
  useEffect(() => {
    if (!chanID || !user?.id) return;

    if (socketRef.current) {
      socketRef.current.close();
    }

    // 2. Debug log to check what User object looks like
    // console.log("Current User Context:", user);

    const ws = new WebSocket(`${GATEWAY_WS}?userId=${user.id}`);
    socketRef.current = ws;

    ws.onopen = () => {
      setStatus("connected");
      ws.send(
        JSON.stringify({
          type: "JOIN",
          channelId: chanID,
          userId: user.id,
        })
      );
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        setMessages((prev) => (Array.isArray(prev) ? [...prev, msg] : [msg]));
      } catch (err) {
        console.error("WS parse error:", err);
      }
    };

    ws.onerror = () => setStatus("error");
    ws.onclose = () => setStatus("disconnected");

    return () => {
      ws.close();
    };
  }, [chanID, user?.id, setMessages]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [safeMessages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || status !== "connected") return;

    const payload = {
      type: "MESSAGE",
      channelId: chanID,
      userId: user.id,
      // 3. Ensure we fallback to email or "User" if username is missing
      username: user.username || user.email || "User",
      content: inputMessage,
      timestamp_ms: Date.now(),
    };
    
    setRefMsg(!refMsg);
    socketRef.current?.send(JSON.stringify(payload));
    setInputMessage("");
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto bg-white dark:bg-gray-800 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-600">
          <div className="p-4 space-y-3">
            {safeMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500 py-12">
                <p className="text-sm">No messages yet</p>
              </div>
            ) : (
              safeMessages.map((msg, idx) => {
                const senderId = msg.senderId ?? msg.userId ?? msg.user_id;
                
                // 4. Fix Type Mismatch: Convert both to String before comparing
                const isMe = String(senderId) === String(user?.id);

                // 5. Robust Name Lookup: 
                // Try message -> Try member list -> Try ID -> Fallback
                let displayName = msg.username;
                
                if (!displayName) {
                   const senderMember = members.find(m => String(m.userId) === String(senderId));
                   displayName = senderMember?.username || senderMember?.user?.username || "Unknown";
                }

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
                          {displayName}
                        </div>
                      )}

                      <div className="text-sm break-words">{msg.content}</div>

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

      <div className="flex-shrink-0 p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
        <form onSubmit={sendMessage} className="flex items-end space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={status === "connected" ? "Type a message..." : "Connecting..."}
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
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
