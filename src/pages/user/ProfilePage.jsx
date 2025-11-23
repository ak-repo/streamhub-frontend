import React, { useState } from "react";
import Header from "../../components/Header";

export default function ProfilePage() {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div
      className={`min-h-screen  pr-20 pl-20  pb-32 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      <div className="p-8">
        <h2 className="text-3xl font-bold mb-12">Profile</h2>

        <div
          className={`${
            darkMode ? "bg-gray-800" : "bg-gray-100"
          } p-8 rounded-lg mb-8`}
        >
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-3xl font-bold">
              JD
            </div>
            <div>
              <p className="text-2xl font-bold">John Doe</p>
              <p className="opacity-70">john@example.com</p>
              <p className="opacity-70">Member since January 2024</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div
            className={`${
              darkMode ? "bg-gray-800" : "bg-gray-100"
            } p-6 rounded-lg`}
          >
            <p className="text-sm opacity-70 mb-2">Files Uploaded</p>
            <p className="text-3xl font-bold">45</p>
          </div>
          <div
            className={`${
              darkMode ? "bg-gray-800" : "bg-gray-100"
            } p-6 rounded-lg`}
          >
            <p className="text-sm opacity-70 mb-2">Total Followers</p>
            <p className="text-3xl font-bold">128</p>
          </div>
        </div>

        <h3 className="text-2xl font-bold mb-6">Account Settings</h3>
        <div className="space-y-4">
          <div
            className={`${
              darkMode ? "bg-gray-800" : "bg-gray-100"
            } p-6 rounded-lg flex justify-between items-center`}
          >
            <p>Email Notifications</p>
            <div className="w-12 h-6 bg-blue-500 rounded-full"></div>
          </div>
          <div
            className={`${
              darkMode ? "bg-gray-800" : "bg-gray-100"
            } p-6 rounded-lg flex justify-between items-center`}
          >
            <p>Two-Factor Authentication</p>
            <div className="w-12 h-6 bg-gray-400 rounded-full"></div>
          </div>
          <div
            className={`${
              darkMode ? "bg-gray-800" : "bg-gray-100"
            } p-6 rounded-lg flex justify-between items-center`}
          >
            <p>Privacy Mode</p>
            <div className="w-12 h-6 bg-blue-500 rounded-full"></div>
          </div>
        </div>

        <button className="w-full mt-12 bg-red-500 text-white p-3 rounded-lg font-semibold hover:bg-red-600 transition">
          Logout
        </button>
      </div>
    </div>
  );
}
