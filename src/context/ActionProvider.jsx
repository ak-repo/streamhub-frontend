import React, { useState, useRef } from "react";
import { ActionContext } from "./context";
import { useNavigate } from "react-router-dom";

export default function ActionProvider({ children }) {
  // --------------------------
  // Chat State
  // --------------------------
  const [selectedChat, setSelectedChat] = useState(null);
  const messagesEndRef = useRef(null);
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

  // --------------------------
  // File Upload State
  // --------------------------
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // others
  const navigate = useNavigate();

  // File upload simulation
  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
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

  return (
    <ActionContext.Provider
      value={{
        // Chat
        selectedChat,
        setSelectedChat,
        messages,
        setMessages,
        messagesEndRef,
        profileMenuRef,
        chats,

        // File Upload
        uploadProgress,
        fileInputRef,
        isUploading,
        handleFileUpload,

        // UI
        showProfileMenu,
        setShowProfileMenu,

        //other
        navigate,
      }}
    >
      {children}
    </ActionContext.Provider>
  );
}
