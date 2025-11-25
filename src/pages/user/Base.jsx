import { useState, useRef, useEffect } from "react";

export default function App() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const profileMenuRef = useRef(null);

  const chats = [
    {
      id: 1,
      name: "John Doe",
      last: "Hey, send the file…",
      online: true,
      unread: 2,
    },
    {
      id: 2,
      name: "Support Team",
      last: "Upload completed",
      online: false,
      unread: 0,
    },
    {
      id: 3,
      name: "Sarah Wilson",
      last: "Meeting at 3 PM",
      online: true,
      unread: 1,
    },
    {
      id: 4,
      name: "Design Team",
      last: "Figma file updated",
      online: true,
      unread: 0,
    },
  ];

  const [messages, setMessages] = useState([
    { id: 1, text: "Hey, how's it going?", me: false, timestamp: "10:30 AM" },
    {
      id: 2,
      text: "Can you send me the document we discussed yesterday?",
      me: false,
      timestamp: "10:31 AM",
    },
    {
      id: 3,
      text: "Sure! I'll upload it right away.",
      me: true,
      timestamp: "10:32 AM",
    },
    {
      id: 4,
      text: "Send the document when you're ready",
      me: false,
      timestamp: "10:33 AM",
    },
  ]);

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

  // Simulate file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);

          const newMessage = {
            id: messages.length + 1,
            text: `File: ${file.name}`,
            me: true,
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            isFile: true,
          };

          setMessages((prev) => [...prev, newMessage]);
          return 0;
        }
        return prev + 10;
      });
    }, 100);
  };

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

  return (
    <div className="w-screen h-screen flex bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* ---------- SIDEBAR ---------- */}
      <div className="w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col bg-white dark:bg-gray-800 transition-colors duration-200">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center">
                <span className="text-white dark:text-gray-900 font-semibold text-sm">
                  S
                </span>
              </div>
              <div>
                <div className="text-xl font-semibold text-gray-900 dark:text-white">
                  StreamHub
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Messaging
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <input
              placeholder="Search conversations..."
              className="w-full p-2.5 pl-9 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-all duration-200 text-sm"
            />
            <div className="absolute left-2.5 top-2.5 text-gray-400">
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
            </div>
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer transition-colors duration-200 ${
                selectedChat?.id === chat.id
                  ? "bg-gray-100 dark:bg-gray-700"
                  : "hover:bg-gray-50 dark:hover:bg-gray-750"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div
                    className={`w-10 h-10 rounded-lg bg-gray-300 dark:bg-gray-600 flex items-center justify-center font-medium text-gray-700 dark:text-gray-300 text-sm ${
                      selectedChat?.id === chat.id ? "ring-2 ring-gray-400" : ""
                    }`}
                  >
                    {chat.name.charAt(0)}
                  </div>
                  {chat.online && (
                    <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-green-500 border border-white dark:border-gray-800 rounded-full"></div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div
                      className={`font-medium text-sm truncate ${
                        selectedChat?.id === chat.id
                          ? "text-gray-900 dark:text-white"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {chat.name}
                    </div>
                    {chat.unread > 0 && (
                      <div
                        className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedChat?.id === chat.id
                            ? "bg-gray-600 text-white"
                            : "bg-gray-500 text-white"
                        }`}
                      >
                        {chat.unread}
                      </div>
                    )}
                  </div>
                  <div
                    className={`text-xs truncate ${
                      selectedChat?.id === chat.id
                        ? "text-gray-600 dark:text-gray-400"
                        : "text-gray-500 dark:text-gray-500"
                    }`}
                  >
                    {chat.last}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cloud Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-750">
          <div className="font-medium text-sm mb-3 text-gray-700 dark:text-gray-300">
            Cloud Storage
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full p-2.5 rounded-lg bg-gray-900 dark:bg-gray-600 text-white text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-500 transition-colors duration-200 flex items-center justify-center space-x-2"
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
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <span>Upload File</span>
          </button>

          <button className="w-full p-2.5 mt-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-white dark:hover:bg-gray-700 transition-colors duration-200">
            View All Files
          </button>
        </div>
      </div>

      {/* ---------- CHAT WINDOW ---------- */}
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-800">
        {/* If no chat selected */}
        {!selectedChat && (
          <div className="flex items-center justify-center flex-1">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-500 dark:text-gray-400"
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
              <div className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-1">
                Welcome to StreamHub
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-500">
                Select a chat to start messaging
              </div>
            </div>
          </div>
        )}

        {/* Chat area */}
        {selectedChat && (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-gray-300 dark:bg-gray-600 flex items-center justify-center font-medium text-gray-700 dark:text-gray-300">
                  {selectedChat.name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {selectedChat.name}
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        selectedChat.online ? "bg-green-500" : "bg-gray-400"
                      }`}
                    ></div>
                    <span>{selectedChat.online ? "Online" : "Offline"}</span>
                  </div>
                </div>
              </div>

              {/* Profile Icon */}
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  <svg
                    className="w-4 h-4 text-gray-600 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </button>

                {/* Profile Dropdown Menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 top-10 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-10">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        John Doe
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        john@example.com
                      </div>
                    </div>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      Profile Settings
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      Notification Settings
                    </button>
                    <div className="border-t border-gray-100 dark:border-gray-700 mt-1">
                      <button className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.me ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg transition-colors duration-200 ${
                      m.me
                        ? "bg-gray-900 text-white"
                        : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
                    } ${
                      m.isFile
                        ? "border-2 border-dashed border-gray-300 dark:border-gray-600"
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
                  <div className="max-w-xs px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1.5">
                      Uploading file... {uploadProgress}%
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div
                        className="bg-gray-600 dark:bg-gray-400 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-end space-x-2">
                {/* Upload Button */}
                <label className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200">
                  <svg
                    className="w-4 h-4 text-gray-600 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                  </svg>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>

                <div className="flex-1 relative">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Write a message…"
                    rows="1"
                    className="w-full p-2.5 pr-10 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 resize-none transition-all duration-200 text-sm max-h-32"
                  />
                </div>

                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className={`p-2.5 rounded-lg font-medium text-sm transition-colors duration-200 ${
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
          </>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileUpload}
      />
    </div>
  );
}
