import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  listChannels,
  freezeChannel,
  unfreezeChannel,
  deleteChannel,
} from "../../api/services/channelService";

function ChannelManagement() {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showFreezeModal, setShowFreezeModal] = useState(false);
  const [freezingChannel, setFreezingChannel] = useState(null);
  const [freezeReason, setFreezeReason] = useState("");

  // Ref for modals
  const detailsModalRef = useRef(null);
  const freezeModalRef = useRef(null);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (showDetailsModal || showFreezeModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showDetailsModal, showFreezeModal]);

  // Handle escape key to close modals
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === "Escape") {
        if (showDetailsModal) {
          setShowDetailsModal(false);
        }
        if (showFreezeModal) {
          setShowFreezeModal(false);
          setFreezingChannel(null);
          setFreezeReason("");
        }
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [showDetailsModal, showFreezeModal]);

  // Fetch channels on component mount
  useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    try {
      setLoading(true);
      const data = await listChannels();
      setChannels(data?.channels || []);
    } catch (err) {
      console.error("Error fetching channels:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter channels based on search term
  const filteredChannels = channels.filter(
    (channel) =>
      channel.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      channel.owner?.username
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      channel.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle viewing channel details
  const handleViewDetails = (channel) => {
    setSelectedChannel(channel);
    setShowDetailsModal(true);
  };

  // Handle freezing/unfreezing channel
  const handleFreezeChannel = async (channel) => {
    setFreezingChannel(channel);
    setShowFreezeModal(true);
  };

  const handleConfirmFreeze = async () => {
    if (!freezingChannel) return;

    try {
      if (freezingChannel?.isFrozen) {
        await unfreezeChannel(freezingChannel?.id);
      } else {
        await freezeChannel(freezingChannel.id, freezeReason);
      }

      // Update local state
      setChannels(
        channels.map((channel) =>
          channel.id === freezingChannel.id
            ? { ...channel, isFrozen: !channel.isFrozen }
            : channel
        )
      );

      // Reset state
      setShowFreezeModal(false);
      setFreezingChannel(null);
      setFreezeReason("");
    } catch (err) {
      console.error("Error updating channel freeze status:", err);
    }
  };

  // Handle deleting channel
  const handleDeleteChannel = async (channelId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this channel? This action cannot be undone."
      )
    ) {
      try {
        await deleteChannel(channelId);
        setChannels(channels.filter((channel) => channel.id !== channelId));
      } catch (err) {
        console.error("Error deleting channel:", err);
      }
    }
  };

  // Format date string
  const formatDate = useCallback((dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return dateString;
    }
  }, []);

  // Get status badge color
  const getStatusBadgeColor = useCallback((isFrozen) => {
    return isFrozen ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800";
  }, []);

  // Get privacy badge color
  const getPrivacyBadgeColor = useCallback((privacy) => {
    switch (privacy?.toLowerCase()) {
      case "false":
        return "bg-blue-100 text-blue-800";
      case "true":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }, []);

  // Get member count text
  const getMemberCountText = useCallback((members) => {
    const count = members?.length || 0;
    return `${count} member${count !== 1 ? "s" : ""}`;
  }, []);

  // Handle modal backdrop click
  const handleBackdropClick = (e, modalType) => {
    if (
      modalType === "details" &&
      detailsModalRef.current &&
      !detailsModalRef.current.contains(e.target)
    ) {
      setShowDetailsModal(false);
    }
    if (
      modalType === "freeze" &&
      freezeModalRef.current &&
      !freezeModalRef.current.contains(e.target)
    ) {
      setShowFreezeModal(false);
      setFreezingChannel(null);
      setFreezeReason("");
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Channel Management
            </h1>
            <p className="text-gray-600">Total Channels: {channels.length}</p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search channels..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Loading channels...</p>
          </div>
        ) : (
          <>
            {/* Channels Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Channel
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Owner
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredChannels.length > 0 ? (
                    filteredChannels.map((channel) => (
                      <tr key={channel.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                <svg
                                  className="h-6 w-6 text-indigo-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                  />
                                </svg>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {channel.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {getMemberCountText(channel.members)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {channel?.ownerName || "Unknown"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {channel?.createdBy || ""}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(
                              channel.isFrozen
                            )}`}
                          >
                            {channel.isFrozen ? "Frozen" : "Active"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(channel.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewDetails(channel)}
                              className="text-blue-600 hover:text-blue-900"
                              title="View Details"
                            >
                              <svg
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleFreezeChannel(channel)}
                              className={
                                channel.isFrozen
                                  ? "text-green-600 hover:text-green-900"
                                  : "text-yellow-600 hover:text-yellow-900"
                              }
                              title={
                                channel.isFrozen
                                  ? "Unfreeze Channel"
                                  : "Freeze Channel"
                              }
                            >
                              {channel.isFrozen ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 10V3L4 14h7v7l9-11h-7z"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M20 12H4"
                                  />
                                </svg>
                              )}
                            </button>
                            <button
                              onClick={() => handleDeleteChannel(channel.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete Channel"
                            >
                              <svg
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <div className="text-gray-500">
                          {searchTerm
                            ? "No channels found matching your search."
                            : "No channels found."}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Channel Details Modal */}
      {showDetailsModal && selectedChannel && (
        <DetailedChannel
          ref={detailsModalRef}
          setShowDetailsModal={setShowDetailsModal}
          selectedChannel={selectedChannel}
          formatDate={formatDate}
          getPrivacyBadgeColor={getPrivacyBadgeColor}
          getMemberCountText={getMemberCountText}
          handleBackdropClick={handleBackdropClick}
        />
      )}

      {/* Freeze/Unfreeze Modal */}
      {showFreezeModal && freezingChannel && (
        <FreezeChannelModal
          ref={freezeModalRef}
          setShowFreezeModal={setShowFreezeModal}
          freezingChannel={freezingChannel}
          freezeReason={freezeReason}
          setFreezeReason={setFreezeReason}
          handleConfirmFreeze={handleConfirmFreeze}
          handleBackdropClick={handleBackdropClick}
        />
      )}
    </>
  );
}

export default ChannelManagement;

const DetailedChannel = React.forwardRef(
  (
    {
      setShowDetailsModal,
      selectedChannel,
      formatDate,
      getPrivacyBadgeColor,
      getMemberCountText,
      handleBackdropClick,
    },
    ref
  ) => {
    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50"
        onClick={(e) => handleBackdropClick(e, "details")}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div
          ref={ref}
          className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 id="modal-title" className="text-2xl font-bold text-gray-800">
                Channel Details
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close modal"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Channel Info Card */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-indigo-600 p-4 rounded-full">
                    <svg
                      className="h-16 w-16 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      {selectedChannel.name}
                    </h3>
                    <p className="text-gray-600">
                      {selectedChannel.description || "No description"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      Channel ID
                    </h4>
                    <p className="text-gray-800 font-mono text-sm">
                      {selectedChannel.id}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      Privacy
                    </h4>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getPrivacyBadgeColor(
                        selectedChannel.privacy
                      )}`}
                    >
                      {selectedChannel.privacy || "Unknown"}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      Status
                    </h4>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedChannel.isFrozen
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {selectedChannel.isFrozen ? "Frozen" : "Active"}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      Owner
                    </h4>
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg
                          className="h-4 w-4 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedChannel.owner?.username || "Unknown"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {selectedChannel.owner?.email || ""}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      Created Date
                    </h4>
                    <div className="flex items-center text-gray-800">
                      <svg
                        className="h-5 w-5 mr-2 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {formatDate(selectedChannel.createdAt)}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      Members
                    </h4>
                    <p className="text-gray-800">
                      {getMemberCountText(selectedChannel.members)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Members List */}
              {selectedChannel.members &&
                selectedChannel.members.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-3">
                      Channel Members
                    </h4>
                    <div className="border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              User
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Role
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Joined
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedChannel.members
                            .slice(0, 10)
                            .map((member) => (
                              <tr key={member.id}>
                                <td className="px-4 py-2">
                                  <div className="text-sm font-medium text-gray-900">
                                    {member.username}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {member.email}
                                  </div>
                                </td>
                                <td className="px-4 py-2">
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                    {member.role || "Member"}
                                  </span>
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-500">
                                  {formatDate(member.joinedAt)}
                                </td>
                              </tr>
                            ))}
                          {selectedChannel.members.length > 10 && (
                            <tr>
                              <td
                                colSpan="3"
                                className="px-4 py-2 text-center text-sm text-gray-500"
                              >
                                + {selectedChannel.members.length - 10} more
                                members
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

DetailedChannel.displayName = "DetailedChannel";

const FreezeChannelModal = React.forwardRef(
  (
    {
      setShowFreezeModal,
      freezingChannel,
      freezeReason,
      setFreezeReason,
      handleConfirmFreeze,
      handleBackdropClick,
      setFreezingChannel,
    },
    ref
  ) => {
    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50"
        onClick={(e) => handleBackdropClick(e, "freeze")}
        role="dialog"
        aria-modal="true"
        aria-labelledby="freeze-modal-title"
      >
        <div
          ref={ref}
          className="bg-white rounded-xl shadow-2xl max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <h2
                id="freeze-modal-title"
                className="text-xl font-bold text-gray-800"
              >
                {freezingChannel.isFrozen ? "Unfreeze" : "Freeze"} Channel
              </h2>
              <button
                onClick={() => {
                  setShowFreezeModal(false);
                  setFreezingChannel(null);
                  setFreezeReason("");
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close modal"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Channel Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <svg
                      className="h-6 w-6 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {freezingChannel.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Owner: {freezingChannel.owner?.username}
                    </p>
                  </div>
                </div>
              </div>

              {/* Freeze Reason (only when freezing) */}
              {!freezingChannel.isFrozen && (
                <div>
                  <label
                    htmlFor="freeze-reason"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Freeze Reason
                  </label>
                  <textarea
                    id="freeze-reason"
                    value={freezeReason}
                    onChange={(e) => setFreezeReason(e.target.value)}
                    placeholder="Enter reason for freezing this channel..."
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    This reason will be visible to the channel owner.
                  </p>
                </div>
              )}

              {/* Warning Message */}
              <div
                className={`p-4 rounded-lg ${
                  freezingChannel.isFrozen
                    ? "bg-green-50 text-green-800"
                    : "bg-red-50 text-red-800"
                }`}
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    {freezingChannel.isFrozen ? (
                      <svg
                        className="h-5 w-5 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">
                      {freezingChannel.isFrozen
                        ? "Unfreezing will allow all members to access this channel again."
                        : "Freezing will prevent all members from accessing this channel."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  onClick={handleConfirmFreeze}
                  className={`px-4 py-2 text-white rounded-lg font-medium transition-colors ${
                    freezingChannel.isFrozen
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {freezingChannel.isFrozen
                    ? "Unfreeze Channel"
                    : "Freeze Channel"}
                </button>
                <button
                  onClick={() => {
                    setShowFreezeModal(false);
                    setFreezingChannel(null);
                    setFreezeReason("");
                  }}
                  className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

FreezeChannelModal.displayName = "FreezeChannelModal";
