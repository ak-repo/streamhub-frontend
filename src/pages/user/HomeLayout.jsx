import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { useAuth } from "../../context/context";
import {
  createChannel,
  joinChannel,
  listChannels,
} from "../../api/services/channelService";
import { useNavigate } from "react-router-dom";

function HomeLayout() {
  const [channels, setChannel] = useState([]);
  const { user } = useAuth();
  const [inputID, setInputID] = useState("");
  const [inputName, setInputName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.id) return;

    const listAll = async () => {
      try {
        const data = await listChannels(user.id);
        setChannel(data?.channels || []);
      } catch (err) {
        alert("Failed to list channels");
      }
    };

    listAll();
  }, [user?.id, inputID, inputName]);

  const handleCreate = async () => {
    if (!user?.id) return;
    if (!inputName.trim()) return alert("Enter channel name");

    try {
      await createChannel(inputName, user.id);
      const data = await listChannels(user.id);
      setChannel(data?.channels || []);
      setInputName("");
    } catch (err) {
      alert("Failed to create channel");
    }
  };

  const handleJoin = async () => {
    if (!inputID.trim()) return alert("Enter channel ID");
    if (!user?.id) return;

    try {
      await joinChannel(inputID, user.id);
      setInputID("");
    } catch (err) {
      alert("Failed to join channel");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Channels
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your collaboration spaces and join new ones
          </p>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Create Channel */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Create New Channel
              </label>
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  placeholder="Enter channel name"
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200"
                />
                <button
                  onClick={handleCreate}
                  className="px-6 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors duration-200"
                >
                  Create
                </button>
              </div>
            </div>

            {/* Join Channel */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Join Existing Channel
              </label>
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={inputID}
                  onChange={(e) => setInputID(e.target.value)}
                  placeholder="Enter channel ID"
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200"
                />
                <button
                  onClick={handleJoin}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors duration-200"
                >
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Channels Grid */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Your Channels ({channels.length})
            </h2>
          </div>

          {channels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {channels.map((ch) => (
                <div
                  key={ch.channel_id}
                  onClick={() => navigate(`/channel/${ch.channel_id}`)}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-200 cursor-pointer group"
                >
                  {/* Channel Icon */}
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-900 to-gray-700 rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-200">
                    <span className="text-white font-semibold text-lg">
                      {ch.name.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  {/* Channel Info */}
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 truncate">
                    {ch.name}
                  </h3>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <svg
                        className="w-4 h-4 mr-2"
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
                      {ch.members.length} members
                    </div>

                    <div className="flex items-center text-xs text-gray-400 dark:text-gray-500">
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      ID: {ch.channel_id.slice(0, 8)}...
                    </div>
                  </div>

                  {/* View Button */}
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <button className="w-full py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 flex items-center justify-center group-hover:bg-gray-50 dark:group-hover:bg-gray-700 rounded-lg">
                      Open Channel
                      <svg
                        className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No channels yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-md mx-auto">
                Create your first channel to start collaborating with your team
                members.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomeLayout;
