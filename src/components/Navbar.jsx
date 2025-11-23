import React, { useState } from "react";
import { FileText, MessageSquare, Bell, User } from "lucide-react";

export default function BottomNavigation() {
  const [activePath, setActivePath] = useState("/files");

  const navItems = [
    { path: "/files", icon: FileText, label: "Files" },
    { path: "/chat", icon: MessageSquare, label: "Chat" },
    { path: "/notifications", icon: Bell, label: "Notifications" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-t border-slate-700 shadow-2xl">
      <div className="flex justify-center gap-2 px-6 py-4">
        {navItems.map(({ path, icon: Icon, label }) => (
          <button
            key={path}
            onClick={() => setActivePath(path)}
            className={`flex flex-col items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${
              activePath === path
                ? "bg-white text-slate-900 shadow-lg scale-105"
                : "text-white hover:bg-slate-700 hover:shadow-md"
            }`}
          >
            <Icon size={24} strokeWidth={2} />
            <span className="text-xs font-bold tracking-wide">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
