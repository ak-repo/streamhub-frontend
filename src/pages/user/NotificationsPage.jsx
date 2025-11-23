import React, { useState } from 'react';
import Header from '../../components/Header';


export default function NotificationsPage() {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className={`min-h-screen pb-32 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-8">Notifications</h2>
        <div className="space-y-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-100'} p-6 rounded border-l-4 border-blue-500`}>
            <p className="font-semibold text-lg">New Message</p>
            <p className="opacity-70 mt-2">User A sent you a message</p>
            <p className="text-sm opacity-50 mt-2">2 minutes ago</p>
          </div>
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-100'} p-6 rounded border-l-4 border-green-500`}>
            <p className="font-semibold text-lg">File Uploaded</p>
            <p className="opacity-70 mt-2">File2.pdf has been successfully uploaded</p>
            <p className="text-sm opacity-50 mt-2">1 hour ago</p>
          </div>
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-100'} p-6 rounded border-l-4 border-purple-500`}>
            <p className="font-semibold text-lg">User Activity</p>
            <p className="opacity-70 mt-2">User B liked your shared document</p>
            <p className="text-sm opacity-50 mt-2">3 hours ago</p>
          </div>
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-100'} p-6 rounded border-l-4 border-yellow-500`}>
            <p className="font-semibold text-lg">System Update</p>
            <p className="opacity-70 mt-2">New features are now available</p>
            <p className="text-sm opacity-50 mt-2">5 hours ago</p>
          </div>
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-100'} p-6 rounded border-l-4 border-red-500`}>
            <p className="font-semibold text-lg">Invitation</p>
            <p className="opacity-70 mt-2">User C invited you to join a group</p>
            <p className="text-sm opacity-50 mt-2">1 day ago</p>
          </div>
        </div>
      </div>
    </div>
  );
}