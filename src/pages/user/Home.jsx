import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/context";
import {
  createChannel,
  joinChannel,
  listChannels,
} from "../../api/services/channelService";
import { searchUsers } from "../../api/services/userService";

// Define items per page constant
const ITEMS_PER_PAGE = 6; // Set a standard limit for pagination

// ==========================================
// NEW COMPONENT: PAGINATION CONTROLS
// ==========================================
const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pageNumbers = [];
  // Logic for displaying a few pages: current, previous, next, first, last
  const maxPagesToShow = 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      {/* First Page */}
      {currentPage > 1 && (
        <button
          onClick={() => onPageChange(1)}
          className="p-2 text-sm font-medium text-gray-500 hover:text-sky-600 dark:text-gray-400 dark:hover:text-sky-400 transition"
          aria-label="First page"
        >
          &lt;&lt;
        </button>
      )}

      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>

      {/* Page Numbers */}
      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 flex items-center justify-center text-sm font-bold rounded-full transition-colors ${
            page === currentPage
              ? "bg-sky-600 text-white shadow-md"
              : "bg-transparent text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>

      {/* Last Page */}
      {currentPage < totalPages && (
        <button
          onClick={() => onPageChange(totalPages)}
          className="p-2 text-sm font-medium text-gray-500 hover:text-sky-600 dark:text-gray-400 dark:hover:text-sky-400 transition"
          aria-label="Last page"
        >
          &gt;&gt;
        </button>
      )}
    </div>
  );
};

// ==========================================
// NEW COMPONENT: USER PROFILE MODAL (Unchanged)
// ==========================================
const UserProfileModal = ({ user, isOpen, onClose }) => {
  if (!isOpen || !user) return null;

  // Helper to format date
  const joinDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 dark:border-gray-700 animate-in zoom-in-95 duration-200">
        {/* --- Header Background --- */}
        <div className="h-24 bg-gradient-to-r from-sky-300 via-sky-500 to-sky-700 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition"
          >
            <svg
              className="w-5 h-5"
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
        </div>

        {/* --- Profile Content --- */}
        <div className="px-6 pb-8 relative">
          {/* Avatar */}
          <div className="-mt-12 mb-4 flex justify-between items-end">
            <div className="w-24 h-24 rounded-2xl bg-white dark:bg-gray-800 p-1.5 shadow-lg">
              <div className="flex-shrink-0">
                {user?.avatarUrl ? (
                  <img
                    src={user?.avatarUrl}
                    alt="User Avatar"
                    className="h-12 w-12 sm:h-16 sm:w-16 rounded-full object-cover border-4 border-blue-600 dark:border-blue-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center text-3xl font-bold text-gray-600 dark:text-gray-300">
                    {user.username?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            {/* Role Badge */}
            <div
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-2 ${
                user.role === "admin"
                  ? "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300"
                  : "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300"
              }`}
            >
              {user.role || "Member"}
            </div>
          </div>

          {/* Name & Email */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              {user.username}
              {user.emailVerified && (
                <svg
                  className="w-5 h-5 text-sky-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              {user.email}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-3 mb-6">
            {/* User ID Box */}
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-600 flex items-center justify-between group hover:border-sky-300 transition-colors">
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold mb-0.5">
                  User ID
                </p>
                <p className="text-sm font-mono text-gray-700 dark:text-gray-200 truncate max-w-[200px]">
                  {user.id}
                </p>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(user.id);
                  toast.success("ID Copied!");
                }}
                className="p-2 text-gray-400 hover:text-sky-600 bg-white dark:bg-gray-600 rounded-lg shadow-sm transition"
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
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>

            {/* Joined Date */}
            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-600">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg mr-3">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold">
                  Joined Platform
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {joinDate}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 1. CHANNELS VIEW (UPDATED FOR PAGINATION)
// ==========================================
const ChannelsView = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  // State to hold the current page's channels
  const [channels, setChannels] = useState([]);
  // State to hold the total number of channels (for pagination)
  const [totalChannels, setTotalChannels] = useState(0);
  // State for current page
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalChannels / ITEMS_PER_PAGE);

  const [inputName, setInputName] = useState("");
  const [inputID, setInputID] = useState("");
  const [loading, setLoading] = useState(true);

  // Function to fetch channels with pagination
  const fetchChannels = async (page = currentPage) => {
    if (!user?.id) return;
    setLoading(true);
    try {
      // NOTE: listChannels should be updated to accept page and limit
      const limit = ITEMS_PER_PAGE;
      const offset = (page - 1) * limit;
      // Assume listChannels API is updated to support offset/limit (pagination)
      // If your API returns all channels, you would paginate in the client here.
      // For this solution, we assume the API is updated to fetch paginated data.
      const data = await listChannels(user.id, limit, offset);

      // Assume data structure is { channels: [], total: number }
      setChannels(data?.channels || []);
      setTotalChannels(data?.total || 0);
      setCurrentPage(page);
    } catch (err) {
      console.error("Failed to list channels:", err);
      toast.error("Failed to fetch channels");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannels(1); // Fetch the first page on component mount/user change
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCreate = async () => {
    if (!inputName.trim()) return toast.error("Enter channel name");
    try {
      await createChannel(inputName, user.id);
      // After creation, fetch the first page to show the new channel
      await fetchChannels(1);
      setInputName("");
      toast.success("Channel created!");
    } catch (err) {
      toast.error("Failed to create channel");
    }
  };

  const handleJoin = async () => {
    if (!inputID.trim()) return toast.error("Enter channel ID");
    try {
      await joinChannel(inputID, user.id);
      // After joining, fetch the first page to show the newly joined channel
      await fetchChannels(1);
      setInputID("");
      toast.success("Joined channel!");
    } catch (err) {
      toast.error("Failed to join channel");
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      fetchChannels(page);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Quick Actions (Unchanged) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl p-6 text-white shadow-lg transform transition hover:scale-[1.01]">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-white/20 rounded-lg mr-3">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold">Create Workspace</h3>
          </div>
          <p className="text-sky-100 text-sm mb-4">
            Start a new collaboration channel for your team.
          </p>
          <div className="flex gap-2">
            <input
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              placeholder="Channel Name"
              className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-sky-200 focus:outline-none focus:bg-white/20 transition"
            />
            <button
              onClick={handleCreate}
              className="px-5 py-2.5 bg-white text-sky-600 font-bold rounded-xl hover:bg-sky-50 transition shadow-sm"
            >
              Create
            </button>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg mr-3">
              <svg
                className="w-6 h-6 text-gray-600 dark:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Join Existing
            </h3>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
            Enter an invite ID to join a channel.
          </p>
          <div className="flex gap-2">
            <input
              value={inputID}
              onChange={(e) => setInputID(e.target.value)}
              placeholder="Channel ID..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 outline-none transition"
            />
            <button
              onClick={handleJoin}
              className="px-5 py-2.5 bg-gray-900 dark:bg-gray-700 text-white font-medium rounded-xl hover:bg-gray-800 dark:hover:bg-gray-600 transition"
            >
              Join
            </button>
          </div>
        </div>
      </div>

      {/* Channel List */}
      <div>
        <div className="flex items-center justify-between mb-6 px-1">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Your Channels
          </h2>
          <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full text-xs font-medium">
            {totalChannels} Active
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : channels.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {channels.map((ch) => (
                <div
                  key={ch.channelId}
                  onClick={() =>
                    !ch.isFrozen && navigate(`/channel/${ch.channelId}`)
                  }
                  className={`group relative bg-white dark:bg-gray-800 rounded-2xl p-5 border transition-all duration-300 overflow-hidden
                    ${
                      ch.isFrozen
                        ? "border-red-200 dark:border-red-900/30 cursor-not-allowed opacity-75"
                        : "border-gray-200 dark:border-gray-700 cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1"
                    }
                  `}
                >
                  {ch.isFrozen && (
                    <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-sm z-10">
                      Temporarily Banned
                    </div>
                  )}

                  {!ch.isFrozen && (
                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </div>
                  )}

                  <div className="flex items-center mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md ${
                        ch.isFrozen
                          ? "bg-gray-400 dark:bg-gray-600"
                          : "bg-gradient-to-tr from-gray-800 to-black dark:from-gray-700 dark:to-gray-600"
                      }`}
                    >
                      {ch.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="ml-4 min-w-0">
                      <h3
                        className={`text-lg font-bold truncate pr-4 ${
                          ch.isFrozen
                            ? "text-gray-500 dark:text-gray-400"
                            : "text-gray-900 dark:text-white"
                        }`}
                      >
                        {ch.name}
                      </h3>
                      <p className="text-xs text-gray-500 font-mono truncate">
                        #{ch.channelId.slice(0, 8)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex -space-x-2">
                      {[...Array(Math.min(3, ch.members?.length || 0))].map(
                        (_, i) => (
                          <div
                            key={i}
                            className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 border-2 border-white dark:border-gray-800"
                          />
                        )
                      )}
                      {(ch.members?.length || 0) > 3 && (
                        <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center text-[10px] text-gray-500 font-bold">
                          +{ch.members.length - 3}
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {ch.members?.length || 0} Members
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {/* PAGINATION CONTROLS */}
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700 text-center">
            <div className="w-16 h-16 bg-sky-50 dark:bg-sky-900/30 rounded-full flex items-center justify-center mb-4 text-sky-500">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              No channels yet
            </h3>
            <p className="text-gray-500 max-w-sm mt-2">
              Create your first workspace above to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 2. USER SEARCH VIEW (UPDATED FOR PAGINATION)
// ==========================================
const UserSearchView = () => {
  const [query, setQuery] = useState("");
  // State to hold all search results
  const [allResults, setAllResults] = useState([]);
  // State for current page
  const [currentPage, setCurrentPage] = useState(1);
  const [searching, setSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Client-side pagination logic
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedResults = allResults.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(allResults.length / ITEMS_PER_PAGE);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    setCurrentPage(1); // Reset to page 1 for a new search
    try {
      // NOTE: Assuming searchUsers API returns ALL matching results
      const data = await searchUsers(query);
      setAllResults(data?.users || []);
    } catch (error) {
      toast.error("Search failed");
      setAllResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      // NOTE: Add logic here to scroll back to the top of the list if necessary
      // window.scrollTo(0, 0);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* --- Search Header (Unchanged) --- */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Find Colleagues
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Search for people to add to your workspace
        </p>
      </div>

      {/* --- Search Input (Unchanged) --- */}
      <form onSubmit={handleSearch} className="relative mb-10 group">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400 group-focus-within:text-sky-500 transition-colors"
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
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by username or email..."
          className="block w-full pl-12 pr-32 py-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-sm text-lg"
        />
        <button
          type="submit"
          disabled={searching}
          className="absolute right-2 top-2 bottom-2 px-6 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
        >
          {searching ? "..." : "Search"}
        </button>
      </form>

      {/* --- Results List --- */}
      <div className="space-y-4">
        {searching ? (
          <div className="text-center text-gray-400 py-8">Searching...</div>
        ) : paginatedResults.length > 0 ? (
          <>
            {paginatedResults.map((u) => (
              <div
                key={u.id}
                className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900/30 rounded-full flex items-center justify-center text-sky-600 dark:text-sky-400 font-bold text-lg">
                  {u.username[0].toUpperCase()}
                </div>
                <div className="ml-4 flex-1">
                  <h4 className="text-base font-bold text-gray-900 dark:text-white">
                    {u.username}
                  </h4>
                  <p className="text-sm text-gray-500">{u.email}</p>
                </div>

                {/* New View Profile Button */}
                <button
                  onClick={() => setSelectedUser(u)}
                  className="mr-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 dark:text-gray-300 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  View
                </button>

                {/* Copy ID Button */}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(u.id);
                    toast.success("Copied!");
                  }}
                  className="px-4 py-2 text-sm font-medium text-sky-600 bg-sky-50 dark:bg-sky-900/20 rounded-lg hover:bg-sky-100 dark:hover:bg-sky-900/40 transition-colors"
                >
                  Copy ID
                </button>
              </div>
            ))}
            {/* PAGINATION CONTROLS */}
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          query && (
            <div className="text-center text-gray-400 py-8">No users found</div>
          )
        )}
      </div>

      {/* --- Profile Modal Injection (Unchanged) --- */}
      <UserProfileModal
        user={selectedUser}
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  );
};

// ==========================================
// 3. MAIN HOME (Unchanged)
// ==========================================
export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-center mb-10">
        <div className="bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl inline-flex shadow-inner">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
              activeTab === "dashboard"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
            }`}
          >
            My Channels
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
              activeTab === "users"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
            }`}
          >
            Find Users
          </button>
          <button
            onClick={() => setActiveTab("channels")}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
              activeTab === "channels"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
            }`}
          >
            Find channels
          </button>
        </div>
      </div>
      {/* Min-height is important to prevent content jump when switching views */}
      <div className="min-h-[600px]">
        {activeTab === "dashboard" && <ChannelsView />}
        {activeTab === "users" && <UserSearchView />}
        {activeTab === "channels" && <ChannelSearchView />}
      </div>
    </div>
  );
}

const ChannelSearchView = () => {
  const [query, setQuery] = useState("");
  // State to hold all search results
  const [allResults, setAllResults] = useState([]);
  // State for current page
  const [currentPage, setCurrentPage] = useState(1);
  const [searching, setSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Client-side pagination logic
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedResults = allResults.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(allResults.length / ITEMS_PER_PAGE);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    setCurrentPage(1); // Reset to page 1 for a new search
    try {
      // NOTE: Assuming searchUsers API returns ALL matching results
      const data = await searchUsers(query);
      setAllResults(data?.users || []);
    } catch (error) {
      toast.error("Search failed");
      setAllResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      // NOTE: Add logic here to scroll back to the top of the list if necessary
      // window.scrollTo(0, 0);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* --- Search Header (Unchanged) --- */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Find Colleagues
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Search for people to add to your workspace
        </p>
      </div>

      {/* --- Search Input (Unchanged) --- */}
      <form onSubmit={handleSearch} className="relative mb-10 group">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400 group-focus-within:text-sky-500 transition-colors"
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
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by username or email..."
          className="block w-full pl-12 pr-32 py-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-sm text-lg"
        />
        <button
          type="submit"
          disabled={searching}
          className="absolute right-2 top-2 bottom-2 px-6 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
        >
          {searching ? "..." : "Search"}
        </button>
      </form>

      {/* --- Results List --- */}
      <div className="space-y-4">
        {searching ? (
          <div className="text-center text-gray-400 py-8">Searching...</div>
        ) : paginatedResults.length > 0 ? (
          <>
            {paginatedResults.map((u) => (
              <div
                key={u.id}
                className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900/30 rounded-full flex items-center justify-center text-sky-600 dark:text-sky-400 font-bold text-lg">
                  {u.username[0].toUpperCase()}
                </div>
                <div className="ml-4 flex-1">
                  <h4 className="text-base font-bold text-gray-900 dark:text-white">
                    {u.username}
                  </h4>
                  <p className="text-sm text-gray-500">{u.email}</p>
                </div>

                {/* New View Profile Button */}
                <button
                  onClick={() => setSelectedUser(u)}
                  className="mr-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 dark:text-gray-300 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  View
                </button>

                {/* Copy ID Button */}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(u.id);
                    toast.success("Copied!");
                  }}
                  className="px-4 py-2 text-sm font-medium text-sky-600 bg-sky-50 dark:bg-sky-900/20 rounded-lg hover:bg-sky-100 dark:hover:bg-sky-900/40 transition-colors"
                >
                  Copy ID
                </button>
              </div>
            ))}
            {/* PAGINATION CONTROLS */}
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          query && (
            <div className="text-center text-gray-400 py-8">No users found</div>
          )
        )}
      </div>

      {/* --- Profile Modal Injection (Unchanged) --- */}
      <UserProfileModal
        user={selectedUser}
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  );
};
