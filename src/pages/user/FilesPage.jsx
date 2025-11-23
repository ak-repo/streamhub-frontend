import React, { useState } from "react";
import { FileText } from "lucide-react";
import Header from '../../components/Header';


export default function FilesPage() {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div
      className={`min-h-screen pb-32 p-30 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      <div className="p-8">
        <h2 className="text-3xl font-bold mb-8">Recent Files</h2>
        <div className="grid grid-cols-3 gap-6 mb-16">
          <div
            className={`${
              darkMode ? "bg-gray-800" : "bg-gray-100"
            } p-8 rounded cursor-pointer hover:opacity-80 transition text-center`}
          >
            <FileText size={40} className="mx-auto mb-4" />
            <p className="text-lg">File1.mp4</p>
          </div>
          <div
            className={`${
              darkMode ? "bg-gray-800" : "bg-gray-100"
            } p-8 rounded cursor-pointer hover:opacity-80 transition text-center`}
          >
            <FileText size={40} className="mx-auto mb-4" />
            <p className="text-lg">File2.pdf</p>
          </div>
          <div
            className={`${
              darkMode ? "bg-gray-800" : "bg-gray-100"
            } p-8 rounded cursor-pointer hover:opacity-80 transition text-center`}
          >
            <FileText size={40} className="mx-auto mb-4" />
            <p className="text-lg">File3.jpg</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-8">Recent Activity</h2>
        <div className="space-y-4">
          <div
            className={`${
              darkMode ? "bg-gray-800" : "bg-gray-200"
            } p-6 rounded text-lg`}
          >
            User A uploaded File1.mp4
          </div>
          <div
            className={`${
              darkMode ? "bg-gray-800" : "bg-gray-200"
            } p-6 rounded text-lg`}
          >
            User B sent a message to User C
          </div>
          <div
            className={`${
              darkMode ? "bg-gray-800" : "bg-gray-200"
            } p-6 rounded text-lg`}
          >
            User C shared a document with the team
          </div>
        </div>
      </div>
    </div>
  );
}
