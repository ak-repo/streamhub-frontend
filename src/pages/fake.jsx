import React, { useState, useEffect, useRef } from "react";
import { Send, Plus, LogIn, MessageSquare, User } from "lucide-react";
import axios from "axios";

// CONFIG
const GATEWAY_HTTP = "http://localhost:8080/api/v1";
const GATEWAY_WS = "ws://localhost:8080/api/v1/ws";

export default function App() {
  // State: 'login' | 'lobby' | 'chat'
  const [view, setView] = useState("login");

  // User State
  const [userId, setUserId] = useState("");

  // Channel State
  const [channelId, setChannelId] = useState("");
  const [channelName, setChannelName] = useState("");

  // Messaging State
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [status, setStatus] = useState("disconnected"); // disconnected, connected, error

  // WebSocket Reference
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // --- 1. ACTIONS ---

  const handleLogin = (e) => {
    e.preventDefault();
    if (userId.trim()) setView("lobby");
  };

  const createChannel = async () => {
    const name = prompt("Enter new channel name:");
    if (!name) return;

    try {
      // const res = await fetch(, {
      //   method: "POST",
      //   body: JSON.stringify({ name, creator_id: userId }),
      // });
      const res = await axios.post(`${GATEWAY_HTTP}/channels/create`, {
        name: name,
        creator_id: userId,
      });
      console.log(res);
      const data = res?.data;
      if (data.channel_id) {
        alert(
          `Channel Created!\nID: ${data.channel_id}\n(Share this ID with others)`
        );
        joinChannel(data.channel_id);
      }
    } catch (err) {
      alert("Failed to create channel");
      console.error(err);
    }
  };

  const joinChannel = async (idToJoin) => {
    const id = idToJoin || prompt("Enter Channel ID:");
    if (!id) return;

    try {
      // 1. Add Member via HTTP (Database)
      // await fetch(`${GATEWAY_HTTP}/channels/join`, {
      //   method: "POST",
      //   body: JSON.stringify({ channel_id: id, user_id: userId }),
      // });
      await axios.post(`${GATEWAY_HTTP}/channels/join`, {
        channel_id: id,
        user_id: userId,
      });

      // 2. Connect via WebSocket (Real-time)
      setChannelId(id);
      setView("chat");
      connectWebSocket(id);
    } catch (err) {
      console.error("Join failed", err);
      // If fetch fails, it might mean we are already a member, so try connecting anyway
      setChannelId(id);
      setView("chat");
      connectWebSocket(id);
    }
  };

  const connectWebSocket = (chId) => {
    if (socketRef.current) {
      socketRef.current.close();
    }

    // Append user_id to URL as per Gateway requirement
    const ws = new WebSocket(`${GATEWAY_WS}?user_id=${userId}`);

    ws.onopen = () => {
      setStatus("connected");
      console.log("WS Connected");

      // Send JOIN frame to subscribe to Redis
      ws.send(
        JSON.stringify({
          type: "JOIN",
          channel_id: chId,
          user_id: userId,
        })
      );
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        // Append new message to list
        setMessages((prev) => [...prev, msg]);
      } catch (e) {
        console.error("Failed to parse WS message", e);
      }
    };

    ws.onclose = () => setStatus("disconnected");
    ws.onerror = () => setStatus("error");

    socketRef.current = ws;
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || status !== "connected") return;

    const payload = {
      type: "MESSAGE",
      channel_id: channelId,
      user_id: userId,
      content: inputMessage,
    };

    socketRef.current.send(JSON.stringify(payload));
    setInputMessage("");
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- 2. VIEWS ---

  if (view === "login") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <div className="flex justify-center mb-4">
            <User className="w-12 h-12 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            StreamHub Login
          </h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              placeholder="Enter User ID (e.g. alice)"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition"
            >
              Start Chatting
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (view === "lobby") {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-bold mb-2">Welcome, {userId}</h2>
            <p className="text-gray-500 mb-6">
              Join a channel to start messaging
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={createChannel}
                className="flex items-center justify-center gap-2 p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition group"
              >
                <Plus className="w-8 h-8 text-gray-400 group-hover:text-blue-500" />
                <span className="font-medium text-gray-600 group-hover:text-blue-600">
                  Create New Channel
                </span>
              </button>

              <button
                onClick={() => joinChannel()}
                className="flex items-center justify-center gap-2 p-6 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition group"
              >
                <LogOutIconRotated className="w-8 h-8 text-gray-400 group-hover:text-green-500" />
                <span className="font-medium text-gray-600 group-hover:text-green-600">
                  Join Existing Channel
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Chat View
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div
            className={`w-3 h-3 rounded-full ${
              status === "connected" ? "bg-green-500" : "bg-red-500"
            }`}
          ></div>
          <div>
            <h1 className="font-bold text-gray-800">Channel: {channelId}</h1>
            <p className="text-xs text-gray-500">Logged in as: {userId}</p>
          </div>
        </div>
        <button
          onClick={() => {
            socketRef.current?.close();
            setMessages([]);
            setView("lobby");
          }}
          className="text-sm text-red-500 hover:text-red-700 font-medium"
        >
          Leave Channel
        </button>
      </header>

      {/* Messages Area */}
      <main className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, idx) => {
          const isMe = msg.sender_id === userId;
          return (
            <div
              key={idx}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  isMe
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-800 shadow-sm"
                }`}
              >
                {!isMe && (
                  <p className="text-xs font-bold mb-1 opacity-75">
                    {msg.sender_id}
                  </p>
                )}
                <p className="break-words">{msg.content}</p>
                <p
                  className={`text-[10px] mt-1 ${
                    isMe ? "text-blue-200" : "text-gray-400"
                  }`}
                >
                  {msg.timestamp_ms
                    ? new Date(msg.timestamp_ms).toLocaleTimeString()
                    : "Just now"}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <footer className="bg-white p-4 border-t">
        <form onSubmit={sendMessage} className="max-w-4xl mx-auto flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={status !== "connected"}
            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </footer>
    </div>
  );
}

// Simple Icon Component for "Join" visual
const LogOutIconRotated = ({ className }) => (
  <LogIn className={`transform rotate-180 ${className}`} />
);