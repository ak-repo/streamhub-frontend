import { useState } from "react";
import { useAction } from "../context/context";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const { chats, setSelectedChat, selectedChat } = useAction();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const filteredChats = chats.filter(
    (chat) =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.last.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleChat = (chat) => {
    setSelectedChat(chat);
    navigate("/hub");
  };

  return (
    <div className="w-80 h-full flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      {/* Search */}
      <div className="p-3 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
        <div className="relative">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-full p-2 pl-8 rounded-md bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-all duration-200 text-sm"
          />
          <div className="absolute left-2 top-2 text-gray-400">
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

          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Header */}
      <div className="px-3 pt-3 pb-1 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Chats
          </h3>
          <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">
            {filteredChats.length}
          </span>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-600">
          {filteredChats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500 px-3 py-8">
              <svg
                className="w-8 h-8 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.88-6.09-2.33"
                />
              </svg>
              <p className="text-sm text-center">
                {searchQuery ? "No results found" : "No conversations"}
              </p>
            </div>
          ) : (
            <div className="pb-1">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => handleChat(chat)} // ✅ Clicking works now
                  className={`p-3 border-b border-gray-50 dark:border-gray-700 cursor-pointer transition-colors duration-150 ${
                    selectedChat?.id === chat.id
                      ? "bg-gray-100 dark:bg-gray-700"
                      : "hover:bg-gray-50 dark:hover:bg-gray-750"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {/* Avatar */}
                    <div className="relative">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium ${
                          selectedChat?.id === chat.id
                            ? "bg-gray-800 text-white"
                            : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {chat.name.charAt(0)}
                      </div>

                      {chat.online && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 border border-white dark:border-gray-800 rounded-full"></div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <div
                          className={`text-sm truncate ${
                            selectedChat?.id === chat.id
                              ? "text-gray-900 dark:text-white font-medium"
                              : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {chat.name}
                        </div>

                        {chat.unread > 0 && (
                          <div
                            className={`px-1.5 py-0.5 rounded text-xs font-medium min-w-5 text-center ${
                              selectedChat?.id === chat.id
                                ? "bg-gray-800 text-white"
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
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
