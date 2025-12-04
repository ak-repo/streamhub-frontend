import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/context";
import { profileUpdate, changePassword } from "../../api/services/authService";
import toast from "react-hot-toast";

// import { getUserStats } from "../../api/admin_services/users"; // You'll need to create this API

const AdminProfile = () => {
  const { user, setUser } = useAuth();
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
  });

  useEffect(() => {
    if (user) {
      fetchUserStats();
      setEditForm({
        username: user.username || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      setLoading(true);
      // This API should return stats like channels created, files uploaded, etc.
      // const stats = await getUserStats(user.id);
      setUserStats("");
    } catch (err) {
      console.error("Error fetching user stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      const data = await profileUpdate(editForm.email, editForm.username);
      setIsEditing(false);
      if (data?.user) {
        setUser(data?.user);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  const getRoleBadge = (role) => {
    const roleLower = role?.toLowerCase();
    switch (roleLower) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "superadmin":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "moderator":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">
            Admin Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            Manage your account and settings
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {user?.role && (
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full ${getRoleBadge(
                user.role
              )}`}
            >
              {user.role.toUpperCase()}
            </span>
          )}
          <button
            onClick={handleEditToggle}
            className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-full transition duration-200"
            title={isEditing ? "Cancel Edit" : "Edit Profile"}
          >
            {isEditing ? (
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {user ? (
        <div className="space-y-6 sm:space-y-8">
          {/* Profile Card */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="relative">
                  <div className="bg-blue-600 dark:bg-blue-500 p-3 sm:p-4 rounded-full">
                    <svg
                      className="h-12 w-12 sm:h-16 sm:w-16 text-white"
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
                  {user?.isActive && (
                    <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                  )}
                </div>
                <div>
                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Username
                        </label>
                        <input
                          type="text"
                          name="username"
                          value={editForm.username}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={editForm.email}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">
                        {user.username}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                        {user.email}
                      </p>
                      {user.createdAt && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Member since {formatDate(user.createdAt)}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
              {isEditing && (
                <button
                  onClick={handleSaveProfile}
                  className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg transition duration-200"
                >
                  Save Changes
                </button>
              )}
            </div>
          </div>

          {/* User Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Account Information */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-5">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-4">
                <div className="bg-gray-100 dark:bg-gray-700 p-1.5 sm:p-2 rounded-lg">
                  <svg
                    className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                  Account Information
                </h3>
              </div>
              <div className="space-y-3 pl-8 sm:pl-11">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    User ID
                  </p>
                  <p className="text-sm text-gray-800 dark:text-gray-200 font-mono truncate">
                    {user.id}
                  </p>
                </div>
                {user.role && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Role
                    </p>
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      {user.role}
                    </p>
                  </div>
                )}
                {user.status && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Status
                    </p>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          user.status === "active"
                            ? "bg-green-500"
                            : "bg-gray-400"
                        }`}
                      ></div>
                      <p className="text-sm text-gray-800 dark:text-gray-200 capitalize">
                        {user.status}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Session Information */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-5">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-4">
                <div className="bg-blue-100 dark:bg-blue-900 p-1.5 sm:p-2 rounded-lg">
                  <svg
                    className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                  Session Information
                </h3>
              </div>
              <div className="space-y-3 pl-8 sm:pl-11">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Last Login
                  </p>
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    {user.lastLogin ? formatDate(user.lastLogin) : "Never"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Current Session
                  </p>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      Active Now
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Account Created
                  </p>
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    {user.createdAt ? formatDate(user.createdAt) : "Unknown"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="border-t dark:border-gray-700 pt-4 sm:pt-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => setIsPasswordOpen(true)}
                className="flex items-center justify-center space-x-2 p-3 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition duration-200"
              >
                <svg
                  className="h-5 w-5 text-gray-600 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Change Password
                </span>
              </button>
              <button className="flex items-center justify-center space-x-2 p-3 border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-400 hover:bg-green-50 dark:hover:bg-gray-700 rounded-lg transition duration-200">
                <svg
                  className="h-5 w-5 text-gray-600 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Security Settings
                </span>
              </button>
              <button className="flex items-center justify-center space-x-2 p-3 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-gray-700 rounded-lg transition duration-200">
                <svg
                  className="h-5 w-5 text-gray-600 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Preferences
                </span>
              </button>
            </div>
          </div>

          {/* Recent Activity (Optional) */}
          <div className="border-t dark:border-gray-700 pt-4 sm:pt-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Recent Admin Activity
            </h3>
            <div className="space-y-3">
              {userStats?.recentActivities?.length > 0 ? (
                userStats.recentActivities
                  .slice(0, 3)
                  .map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-1.5 rounded ${
                            activity.type === "delete"
                              ? "bg-red-100 dark:bg-red-900"
                              : "bg-blue-100 dark:bg-blue-900"
                          }`}
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            {activity.type === "delete" ? (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            ) : (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            )}
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-800 dark:text-gray-200">
                            {activity.description}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          activity.type === "delete"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        }`}
                      >
                        {activity.type}
                      </span>
                    </div>
                  ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 dark:text-gray-400">
                    No recent activity
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 sm:py-12">
          <div className="h-16 w-16 sm:h-20 sm:w-20 text-gray-300 dark:text-gray-600 mx-auto mb-4">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
            Session Expired
          </h3>
          <p className="text-gray-500 dark:text-gray-500 text-sm sm:text-base">
            Please sign in to access admin features
          </p>
          <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200">
            Sign In
          </button>
        </div>
      )}
      {
        <ChangePasswordModal
          isOpen={isPasswordOpen}
          onClose={() => setIsPasswordOpen(false)}
        />
      }
    </div>
  );
};

export default AdminProfile;

// --- Component 2: Change Password Modal ---
const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [input, setInput] = useState({
    password: "",
    new_password: "",
    confirm_password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.confirm_password != input.new_password) {
      toast.error("confirm password not matching");
      return;
    }

    try {
      const data = await changePassword(input.password, input.new_password);
      console.log(data);
      onClose();
    } catch (e) {
      console.log(e);
    }
  };
  if (!isOpen) return null;

  return (
    // CHANGED: Removed 'bg-black bg-opacity-50', changed 'backdrop-blur-sm' to 'backdrop-blur-md'
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md transition-opacity">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6 border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">
            Change Password
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg
              className="w-6 h-6"
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

        <form className="space-y-4" onSubmit={(e) => handleSubmit(e)}>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Current Password
            </label>
            <input
              value={input?.password}
              onChange={(e) =>
                setInput((prev) => ({ ...prev, password: e.target.value }))
              }
              type="password"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              New Password
            </label>
            <input
              value={input?.new_password}
              onChange={(e) =>
                setInput((prev) => ({ ...prev, new_password: e.target.value }))
              }
              type="password"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirm New Password
            </label>
            <input
              value={input?.confirm_password}
              onChange={(e) =>
                setInput((prev) => ({
                  ...prev,
                  confirm_password: e.target.value,
                }))
              }
              type="password"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
