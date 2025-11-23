// src/pages/ChatPage.jsx - Telegram Web Style

import React, { useState, useRef, useEffect } from "react";
import { Send, Search, MoreVertical, Paperclip, Smile } from "lucide-react";
import Header from "../../components/Header";

export default function ChatPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [selectedChat, setSelectedChat] = useState(0);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState({
    0: [
      {
        id: 1,
        sender: "User A",
        text: "Hey! How are you?",
        time: "10:30",
        isOwn: false,
        avatar: "A",
        color: "bg-blue-500",
      },
      {
        id: 2,
        sender: "You",
        text: "I'm good! How about you?",
        time: "10:31",
        isOwn: true,
        avatar: "JD",
        color: "bg-green-500",
      },
      {
        id: 3,
        sender: "User A",
        text: "Doing great! Just finished the project.",
        time: "10:32",
        isOwn: false,
        avatar: "A",
        color: "bg-blue-500",
      },
    ],
    1: [
      {
        id: 1,
        sender: "User B",
        text: "The project is ready",
        time: "09:15",
        isOwn: false,
        avatar: "B",
        color: "bg-green-500",
      },
      {
        id: 2,
        sender: "You",
        text: "Great! Let me review it",
        time: "09:16",
        isOwn: true,
        avatar: "JD",
        color: "bg-green-500",
      },
    ],
    2: [
      {
        id: 1,
        sender: "User C",
        text: "Thanks for the update",
        time: "08:45",
        isOwn: false,
        avatar: "C",
        color: "bg-purple-500",
      },
      {
        id: 2,
        sender: "You",
        text: "You're welcome! Let me know if you need anything",
        time: "08:46",
        isOwn: true,
        avatar: "JD",
        color: "bg-green-500",
      },
    ],
  });
  const messagesEndRef = useRef(null);

  const chats = [
    {
      id: 0,
      name: "User A",
      lastMsg: "I'm good! How about you?",
      avatar: "A",
      color: "bg-blue-500",
      unread: 0,
    },
    {
      id: 1,
      name: "User B",
      lastMsg: "The project is ready",
      avatar: "B",
      color: "bg-green-500",
      unread: 1,
    },
    {
      id: 2,
      name: "User C",
      lastMsg: "Thanks for the update",
      avatar: "C",
      color: "bg-purple-500",
      unread: 0,
    },
    {
      id: 3,
      name: "John Smith",
      lastMsg: "See you tomorrow!",
      avatar: "JS",
      color: "bg-orange-500",
      unread: 0,
    },
    {
      id: 4,
      name: "Sarah Johnson",
      lastMsg: "Thanks for your help",
      avatar: "SJ",
      color: "bg-pink-500",
      unread: 2,
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim() === "") return;

    const newMessage = {
      id: (messages[selectedChat]?.length || 0) + 1,
      sender: "You",
      text: message,
      time: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isOwn: true,
      avatar: "JD",
      color: "bg-green-500",
    };

    setMessages({
      ...messages,
      [selectedChat]: [...(messages[selectedChat] || []), newMessage],
    });
    setMessage("");
  };

  return (
    <div
      className={`min-h-screen flex pr-20 pl-20 flex-col ${
        darkMode ? "bg-gray-900" : "bg-white"
      }`}
    >
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Chat List */}
        <div
          className={`w-80 ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-gray-50 border-gray-200"
          } border-r flex flex-col`}
        >
          {/* Search Bar */}
          <div className="p-4 border-b border-gray-700">
            <div
              className={`flex items-center gap-2 ${
                darkMode ? "bg-gray-700" : "bg-gray-200"
              } rounded-full px-4 py-2`}
            >
              <Search size={18} className="opacity-50" />
              <input
                type="text"
                placeholder="Search chats..."
                className={`flex-1 outline-none text-sm ${
                  darkMode
                    ? "bg-gray-700 text-white"
                    : "bg-gray-200 text-gray-900"
                } placeholder-gray-500`}
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className={`p-3 border-b cursor-pointer transition-colors ${
                  selectedChat === chat.id
                    ? darkMode
                      ? "bg-gray-700"
                      : "bg-gray-200"
                    : darkMode
                    ? "hover:bg-gray-700"
                    : "hover:bg-gray-100"
                } ${darkMode ? "border-gray-700" : "border-gray-200"}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full ${chat.color} flex items-center justify-center text-white font-semibold flex-shrink-0`}
                  >
                    {chat.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-sm">{chat.name}</p>
                      {chat.unread > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-xs ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      } truncate`}
                    >
                      {chat.lastMsg}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Chat Window */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div
            className={`${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-gray-50 border-gray-200"
            } border-b p-4 flex justify-between items-center`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full ${chats[selectedChat]?.color} flex items-center justify-center text-white font-semibold`}
              >
                {chats[selectedChat]?.avatar}
              </div>
              <div>
                <p className="font-semibold">{chats[selectedChat]?.name}</p>
                <p
                  className={`text-xs ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Online
                </p>
              </div>
            </div>
            <button
              className={`p-2 rounded-lg ${
                darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
              }`}
            >
              <MoreVertical size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div
            className={`flex-1 overflow-y-auto p-4 space-y-4 ${
              darkMode ? "bg-gray-900" : "bg-white"
            }`}
          >
            {messages[selectedChat]?.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.isOwn ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex gap-2 max-w-xs ${
                    msg.isOwn ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full ${msg.color} flex items-center justify-center text-white text-xs font-semibold flex-shrink-0`}
                  >
                    {msg.avatar}
                  </div>
                  <div>
                    <div
                      className={`px-4 py-2 rounded-lg ${
                        msg.isOwn
                          ? darkMode
                            ? "bg-blue-600 text-white"
                            : "bg-blue-500 text-white"
                          : darkMode
                          ? "bg-gray-700 text-white"
                          : "bg-gray-200 text-gray-900"
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                    </div>
                    <p
                      className={`text-xs ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      } mt-1 ${msg.isOwn ? "text-right" : "text-left"}`}
                    >
                      {msg.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div
            className={`${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-gray-50 border-gray-200"
            } border-t p-10`}
          >
            <div className="flex items-end gap-3">
              <button
                className={`p-2 rounded-lg ${
                  darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
                }`}
              >
                <Paperclip size={20} className="opacity-70" />
              </button>
              <div
                className={`flex-1 ${
                  darkMode ? "bg-gray-700" : "bg-gray-200"
                } rounded-lg px-4 py-2 flex items-center gap-2`}
              >
                <input
                  type="text"
                  placeholder="Aa"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className={`flex-1 outline-none ${
                    darkMode
                      ? "bg-gray-700 text-white"
                      : "bg-gray-200 text-gray-900"
                  } placeholder-gray-500`}
                />
                <button className="opacity-70 hover:opacity-100">
                  <Smile size={20} />
                </button>
              </div>
              <button
                onClick={handleSendMessage}
                className={`p-2 rounded-lg ${
                  darkMode
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white`}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Padding for bottom nav */}
      <div className="h-24"></div>
    </div>
  );
}
