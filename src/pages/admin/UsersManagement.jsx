import React, { useEffect, useState } from "react";
// Import all necessary functions from the consolidated API file
import {
  listUsers,
  updateUserRole,
  banUser,
  unbanUser, // Added unbanUser
  deleteUser,
} from "../../api/admin_services/users";

// Utility function to format date string
const formatDate = (dateString) => {
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
};

// Utility function to get role badge color
const getRoleBadgeColor = (role) => {
  switch (role) {
    case "super-admin":
      return "bg-red-100 text-red-800";
    case "admin":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  // Added banReason state for more complete ban/unban API calls
  const [editForm, setEditForm] = useState({
    role: "",
    isBanned: false,
    banReason: "", // Added state for ban reason
  });

  /**
   * Fetches users from the API.
   */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        // listUsers now returns an object with a 'users' array, as per common API practices
        const data = await listUsers();
        setUsers(data?.users || []);
      } catch (err) {
        console.error("Error fetching users:", err);
        // Optionally show a toast notification here
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle viewing user details
  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  // Handle editing user
  const handleEditUser = (user) => {
    setEditingUser(user);
    setEditForm({
      role: user.role || "user",
      isBanned: user.isBanned || false,
      banReason: user.banReason || "", // Initialize banReason
    });
    setShowEditModal(true);
  };

  /**
   * Handles saving edited user data and making API calls for role/ban changes.
   */
  const handleSaveEdit = async () => {
    if (!editingUser) return;

    try {
      setLoading(true);
      const updates = {}; // Collect updates to apply to the local state

      // 1. Handle Role Update
      if (editingUser.role !== editForm.role) {
        await updateUserRole(editingUser.id, editForm.role);
        updates.role = editForm.role;
      }

      // 2. Handle Ban Status Update
      if (editingUser.isBanned !== editForm.isBanned) {
        if (editForm.isBanned) {
          // Ban the user
          await banUser(editingUser.id, editForm.banReason);
        } else {
          // Unban the user
          await unbanUser(editingUser.id);
        }
        updates.isBanned = editForm.isBanned;
        updates.banReason = editForm.isBanned ? editForm.banReason : "";
      }

      // Update local state (Optimistic Update)
      setUsers(
        users.map((user) =>
          user.id === editingUser.id ? { ...user, ...updates } : user
        )
      );

      setShowEditModal(false);
      setEditingUser(null);
    } catch (err) {
      console.error("Error updating user:", err);
      // NOTE: For a real-world app, you'd likely want to re-fetch users or roll back the local state on failure
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting user
  const handleDeleteUser = async (userId, username) => {
    if (
      window.confirm(`Are you sure you want to delete the user "${username}"?`)
    ) {
      try {
        setLoading(true);
        await deleteUser(userId);
        // Update local state immediately after successful deletion
        setUsers(users.filter((user) => user.id !== userId));
      } catch (err) {
        console.error("Error deleting user:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Users Management</h1>
          <p className="text-gray-600">Total Users: {users.length}</p>
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
            placeholder="Search users..."
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
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      ) : (
        <>
          {/* Users Table */}
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <svg
                                className="h-6 w-6 text-blue-600"
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
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.username}
                            </div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(
                            user.role
                          )}`}
                        >
                          {user.role || "user"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {user.emailVerified ? (
                            <>
                              <svg
                                className="h-5 w-5 text-green-500 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <span className="text-green-600">Verified</span>
                            </>
                          ) : (
                            <>
                              <svg
                                className="h-5 w-5 text-red-500 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <span className="text-red-600">Unverified</span>
                            </>
                          )}
                          {user.isBanned && (
                            <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                              Banned
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewDetails(user)}
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
                            onClick={() => handleEditUser(user)}
                            className="text-green-600 hover:text-green-900"
                            title="Edit User"
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
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id, user.username)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete User"
                            disabled={user.role === "super-admin"}
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
                          ? "No users found matching your search."
                          : "No users found."}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* User Details Modal */}
      {showDetailsModal && selectedUser && (
        <DetailedUser
          setShowDetailsModal={setShowDetailsModal}
          selectedUser={selectedUser}
          handleEditUser={handleEditUser}
        />
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <EditUser
          setShowEditModal={setShowEditModal}
          handleSaveEdit={handleSaveEdit}
          setEditForm={setEditForm}
          editingUser={editingUser}
          editForm={editForm}
        />
      )}
    </div>
  );
}

export default UsersManagement;

// --- Modal Components ---

// NOTE: In a production app, these would be in separate files (e.g., DetailedUser.jsx, EditUser.jsx)

/**
 * Detailed User View Modal
 */
const DetailedUser = ({
  setShowDetailsModal,
  selectedUser,
  handleEditUser,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-800">User Details</h2>
            <button
              onClick={() => setShowDetailsModal(false)}
              className="text-gray-400 hover:text-gray-600"
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
            {/* User Info Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-600 p-4 rounded-full">
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {selectedUser.username}
                  </h3>
                  <p className="text-gray-600">{selectedUser.email}</p>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">
                    User ID
                  </h4>
                  <p className="text-gray-800 font-mono text-sm">
                    {selectedUser.id}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">
                    Email Status
                  </h4>
                  <div className="flex items-center">
                    {selectedUser.emailVerified ? (
                      <>
                        <svg
                          className="h-5 w-5 text-green-500 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-green-600">Verified</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="h-5 w-5 text-red-500 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-red-600">Unverified</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">
                    Account Status
                  </h4>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedUser.isBanned
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {selectedUser.isBanned ? "Banned" : "Active"}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(
                        selectedUser.role
                      )}`}
                    >
                      {selectedUser.role || "user"}
                    </span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">
                    Joined Date
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
                    {formatDate(selectedUser.createdAt)}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            {selectedUser.lastLogin && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Last Login
                </h4>
                <p className="text-gray-800">
                  {formatDate(selectedUser.lastLogin)}
                </p>
              </div>
            )}
            {selectedUser.isBanned && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Ban Reason
                </h4>
                <p className="text-red-800 font-semibold">
                  {selectedUser.banReason || "Not specified."}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  handleEditUser(selectedUser);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
              >
                Edit User
              </button>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 border border-gray-300 hover:border-gray-400 text-gray-700 rounded-lg font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Edit User Modal
 */
const EditUser = ({
  setShowEditModal,
  setEditForm,
  editingUser,
  editForm,
  handleSaveEdit,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              Edit User: {editingUser.username}
            </h2>
            <button
              onClick={() => setShowEditModal(false)}
              className="text-gray-400 hover:text-gray-600"
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
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User Role
              </label>
              <select
                value={editForm.role}
                onChange={(e) =>
                  setEditForm({ ...editForm, role: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={editingUser.role === "super-admin"} // Prevent editing super-admin role
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="super-admin">Super Admin</option>
              </select>
            </div>

            {/* Ban Status */}
            <div>
              <label className="flex items-center space-x-3 mb-2">
                <input
                  type="checkbox"
                  checked={editForm.isBanned}
                  onChange={(e) =>
                    setEditForm({ ...editForm, isBanned: e.target.checked })
                  }
                  className="h-5 w-5 rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Ban User Account
                </span>
                <svg
                  className="h-5 w-5 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </label>
              <p className="text-sm text-gray-500 mt-1 mb-4">
                Banned users cannot log in or access their account.
              </p>

              {/* Ban Reason Input (Visible only if user is being banned) */}
              {editForm.isBanned && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ban Reason (Required)
                  </label>
                  <textarea
                    value={editForm.banReason}
                    onChange={(e) =>
                      setEditForm({ ...editForm, banReason: e.target.value })
                    }
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Enter the reason for banning this user..."
                  />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium disabled:opacity-50"
                disabled={editForm.isBanned && !editForm.banReason} // Disable save if banning without a reason
              >
                Save Changes
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-gray-300 hover:border-gray-400 text-gray-700 rounded-lg font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};