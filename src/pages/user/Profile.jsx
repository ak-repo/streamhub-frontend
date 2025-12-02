import React from "react";
import { useAuth } from "../../context/context";

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">
          Your Profile
        </h1>
        <button className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-full transition duration-200">
          <svg
            className="h-5 w-5 sm:h-6 sm:w-6"
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
        </button>
      </div>

      {user ? (
        <div className="space-y-6 sm:space-y-8">
          {/* Profile Card */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800">
            <div className="flex items-center space-x-3 sm:space-x-4">
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
              <div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">
                  {user.username}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                  Active Member
                </p>
              </div>
            </div>
          </div>

          {/* User Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Email Card */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-5 hover:border-blue-300 dark:hover:border-blue-400 hover:shadow-sm dark:hover:shadow-gray-800 transition duration-200">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
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
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                  Email Address
                </h3>
              </div>
              <p className="text-gray-800 dark:text-gray-200 text-base sm:text-lg pl-8 sm:pl-11 truncate">
                {user.email}
              </p>
            </div>

            {/* User ID Card */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-5 hover:border-blue-300 dark:hover:border-blue-400 hover:shadow-sm dark:hover:shadow-gray-800 transition duration-200">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                <div className="bg-green-100 dark:bg-green-900 p-1.5 sm:p-2 rounded-lg">
                  <svg
                    className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                  User ID
                </h3>
              </div>
              <p className="text-gray-800 dark:text-gray-200 text-base sm:text-lg pl-8 sm:pl-11 font-mono truncate">
                {user.id}
              </p>
            </div>
          </div>

          {/* Stats Section (Optional - can be removed for compactness) */}
          <div className="border-t dark:border-gray-700 pt-4 sm:pt-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 sm:mb-4">
              Account Overview
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="text-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                  0
                </p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Channels
                </p>
              </div>
              <div className="text-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                  0
                </p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Joined
                </p>
              </div>
              <div className="text-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-xl sm:text-2xl font-bold text-purple-600 dark:text-purple-400">
                  Today
                </p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Active Since
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4 sm:pt-6">
            <button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-2.5 sm:py-3 px-4 rounded-lg transition duration-200 flex-1">
              Edit Profile
            </button>
            <button className="border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300 font-medium py-2.5 sm:py-3 px-4 rounded-lg transition duration-200 flex-1">
              Change Password
            </button>
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
            No User Data
          </h3>
          <p className="text-gray-500 dark:text-gray-500 text-sm sm:text-base">
            Please sign in to view your profile
          </p>
        </div>
      )}
    </div>
  );
};

export default Profile;