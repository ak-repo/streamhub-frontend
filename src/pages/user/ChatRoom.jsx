import { useEffect, useState } from "react";
import Welcome from "../../components/Welcome";
import { useAction,  } from "../../context/context";

export default function ChatRoom() {
  const [message, setMessage] = useState("");
  const {
    selectedChat,
    messages,
    setMessages,
    messagesEndRef,
    profileMenuRef,
    setShowProfileMenu,
    handleFileUpload,
    isUploading,
    fileInputRef,
    uploadProgress,
  } = useAction();

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      text: message,
      me: true,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");

    // Simulate reply after 1 second
    setTimeout(() => {
      const replies = [
        "Got it, thanks!",
        "I'll review it and get back to you.",
        "Perfect, that's exactly what I needed.",
        "Thanks for the quick response!",
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];

      const replyMessage = {
        id: messages.length + 2,
        text: randomReply,
        me: false,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, replyMessage]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // If no chat selected, show only Welcome component
  if (!selectedChat) {
    return <Welcome />;
  }

  // Only show chat interface when a chat is selected
  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      {/* Chat Header - Minimal */}
      <div className="flex-shrink-0 p-3 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center font-medium text-gray-700 dark:text-gray-300">
                {selectedChat.name.charAt(0)}
              </div>
              {selectedChat.online && (
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-500 border border-white dark:border-gray-800 rounded-full"></div>
              )}
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white text-sm">
                {selectedChat.name}
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    selectedChat.online ? "bg-green-500" : "bg-gray-400"
                  }`}
                ></div>
                <span>{selectedChat.online ? "Online" : "Offline"}</span>
              </div>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center space-x-1">
            <button className="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
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
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </button>
            <button className="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area - White Background */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto bg-white dark:bg-gray-800 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-600">
          <div className="p-3 space-y-2 min-h-full">
            {messages.length === 0 ? (
              // Empty chat state
              <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500 py-8">
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
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Start a conversation
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
                  Send your first message to {selectedChat.name}
                </p>
              </div>
            ) : (
              // Messages list
              <>
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.me ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs px-3 py-2 rounded-lg ${
                        m.me
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      } ${
                        m.isFile
                          ? "border border-dashed border-gray-300 dark:border-gray-600"
                          : ""
                      }`}
                    >
                      <div className={`text-sm ${m.isFile ? "font-mono" : ""}`}>
                        {m.text}
                      </div>
                      <div
                        className={`text-xs mt-1 ${
                          m.me
                            ? "text-gray-400"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {m.timestamp}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Upload Progress */}
                {isUploading && (
                  <div className="flex justify-end">
                    <div className="max-w-xs px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-1.5">
                        Uploading... {uploadProgress}%
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1">
                        <div
                          className="bg-gray-600 dark:bg-gray-400 h-1 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Input Area - Minimal */}
      <div className="flex-shrink-0 p-3 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-end space-x-2">
          {/* Upload Button */}
          <label className="flex-shrink-0 p-2 rounded-md bg-sky-400 dark:bg-sky-400 cursor-pointer hover:bg-gray-200 dark:hover:bg-sky-500 transition-colors">
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
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>

          {/* Message Input */}
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message ${selectedChat.name}...`}
              rows="1"
              className="w-full p-2 pr-10 rounded-lg text-white bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 resize-none transition-all duration-200 text-sm max-h-24 scrollbar-thin"
            />
          </div>

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className={`flex-shrink-0 p-2 rounded-lg text-sm transition-colors ${
              message.trim()
                ? "bg-gray-900 text-white hover:bg-gray-800"
                : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
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
        </div>
      </div>
    </div>
  );
}
