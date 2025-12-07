import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { listFiles, deleteFile } from "../../api/services/fileService";

function FilesManagement() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingFile, setDeletingFile] = useState(null);

  // Ref for modals
  const detailsModalRef = useRef(null);
  const deleteModalRef = useRef(null);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (showDetailsModal || showDeleteModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showDetailsModal, showDeleteModal]);

  // Handle escape key to close modals
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === "Escape") {
        if (showDetailsModal) {
          setShowDetailsModal(false);
        }
        if (showDeleteModal) {
          setShowDeleteModal(false);
          setDeletingFile(null);
        }
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [showDetailsModal, showDeleteModal]);

  // Fetch files on component mount
  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const data = await listFiles();
      setFiles(data?.files || []);
    } catch (err) {
      console.error("Error fetching files:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter files based on search term
  const filteredFiles = useMemo(
    () =>
      files.filter(
        (file) =>
          file.filename?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          file.channelName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          file.ownerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          file.mimeType?.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [files, searchTerm]
  );

  // Handle viewing file details
  const handleViewDetails = useCallback((file) => {
    setSelectedFile(file);
    setShowDetailsModal(true);
  }, []);

  // Handle deleting file
  const handleDeleteFile = useCallback((file) => {
    setDeletingFile(file);
    setShowDeleteModal(true);
  }, []);

  const handleConfirmDelete = async () => {
    if (!deletingFile) return;

    try {
      await deleteFile(deletingFile.id);
      // Update local state
      setFiles(files.filter((file) => file.id !== deletingFile.id));
      // Reset state
      setShowDeleteModal(false);
      setDeletingFile(null);
    } catch (err) {
      console.error("Error deleting file:", err);
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

  // Format file size
  const formatFileSize = useCallback((bytes) => {
    if (!bytes) return "0 Bytes";
    const numBytes = parseInt(bytes);
    if (numBytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(numBytes) / Math.log(k));
    return parseFloat((numBytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }, []);

  // Get file icon based on mime type
  const getFileIcon = useCallback((mimeType) => {
    const iconClass = "h-6 w-6";

    if (mimeType?.startsWith("image/")) {
      return (
        <svg
          className={`${iconClass} text-green-600`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      );
    } else if (mimeType?.startsWith("video/")) {
      return (
        <svg
          className={`${iconClass} text-purple-600`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      );
    } else if (mimeType?.startsWith("audio/")) {
      return (
        <svg
          className={`${iconClass} text-yellow-600`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
          />
        </svg>
      );
    } else if (mimeType === "application/pdf") {
      return (
        <svg
          className={`${iconClass} text-red-600`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      );
    } else if (mimeType?.includes("debian") || mimeType?.includes("package")) {
      return (
        <svg
          className={`${iconClass} text-blue-600`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
          />
        </svg>
      );
    } else {
      return (
        <svg
          className={`${iconClass} text-gray-600`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      );
    }
  }, []);

  // Get file type badge color
  const getFileTypeBadgeColor = useCallback((mimeType) => {
    if (mimeType?.startsWith("image/")) return "bg-green-100 text-green-800";
    if (mimeType?.startsWith("video/")) return "bg-purple-100 text-purple-800";
    if (mimeType?.startsWith("audio/")) return "bg-yellow-100 text-yellow-800";
    if (mimeType === "application/pdf") return "bg-red-100 text-red-800";
    if (mimeType?.includes("debian") || mimeType?.includes("package"))
      return "bg-blue-100 text-blue-800";
    return "bg-gray-100 text-gray-800";
  }, []);

  // Get file type display name
  const getFileTypeName = useCallback((mimeType) => {
    if (mimeType?.startsWith("image/")) return "Image";
    if (mimeType?.startsWith("video/")) return "Video";
    if (mimeType?.startsWith("audio/")) return "Audio";
    if (mimeType === "application/pdf") return "PDF";
    if (mimeType?.includes("debian") || mimeType?.includes("package"))
      return "Package";
    if (mimeType) return mimeType.split("/")[1]?.toUpperCase() || "File";
    return "Unknown";
  }, []);

  // Handle modal backdrop click
  const handleBackdropClick = useCallback((e, modalType) => {
    if (
      modalType === "details" &&
      detailsModalRef.current &&
      !detailsModalRef.current.contains(e.target)
    ) {
      setShowDetailsModal(false);
    }
    if (
      modalType === "delete" &&
      deleteModalRef.current &&
      !deleteModalRef.current.contains(e.target)
    ) {
      setShowDeleteModal(false);
      setDeletingFile(null);
    }
  }, []);

  // Calculate total storage used
  const totalStorageUsed = useMemo(
    () => files.reduce((total, file) => total + parseInt(file.size || 0), 0),
    [files]
  );

  // Get storage statistics
  const storageStats = useMemo(() => {
    const total = totalStorageUsed;
    const byType = files.reduce((acc, file) => {
      const type = getFileTypeName(file.mimeType);
      const size = parseInt(file.size || 0);
      acc[type] = (acc[type] || 0) + size;
      return acc;
    }, {});

    return { total, byType };
  }, [files, totalStorageUsed, getFileTypeName]);

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              File Management
            </h1>
            <div className="flex flex-wrap gap-2 mt-1">
              <p className="text-gray-600">
                <span className="font-semibold">{files.length}</span> Files
              </p>
              <span className="text-gray-300">•</span>
              <p className="text-gray-600">
                <span className="font-semibold">
                  {formatFileSize(totalStorageUsed)}
                </span>{" "}
                Storage Used
              </p>
            </div>
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
              placeholder="Search files, channels, or owners..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">Total Files</p>
                <p className="text-2xl font-bold text-blue-900">
                  {files.length}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">
                  Storage Used
                </p>
                <p className="text-2xl font-bold text-green-900">
                  {formatFileSize(totalStorageUsed)}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-800">
                  Largest File
                </p>
                <p className="text-lg font-bold text-purple-900">
                  {files.length > 0
                    ? formatFileSize(
                        Math.max(...files.map((f) => parseInt(f.size || 0)))
                      )
                    : "0 Bytes"}
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-full">
                <svg
                  className="h-6 w-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Loading files...</p>
          </div>
        ) : (
          <>
            {/* Files Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      File
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Channel
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Owner
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
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
                  {filteredFiles.length > 0 ? (
                    filteredFiles.map((file) => (
                      <tr key={file.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                {getFileIcon(file.mimeType)}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                {file.filename}
                              </div>
                              <div className="text-xs text-gray-500 font-mono">
                                {file.id.substring(0, 8)}...
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {file.channelName || "Unknown Channel"}
                          </div>
                          <div className="text-xs text-gray-500 font-mono">
                            {file.channelId.substring(0, 8)}...
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {file.ownerName || "Unknown Owner"}
                          </div>
                          <div className="text-xs text-gray-500 font-mono">
                            {file.ownerId.substring(0, 8)}...
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getFileTypeBadgeColor(
                              file.mimeType
                            )}`}
                          >
                            {getFileTypeName(file.mimeType)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatFileSize(parseInt(file.size || 0))}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatDate(file.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewDetails(file)}
                              className="text-blue-600 hover:text-blue-900 transition-colors"
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
                              onClick={() => handleDeleteFile(file)}
                              className="text-red-600 hover:text-red-900 transition-colors"
                              title="Delete File"
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
                      <td colSpan="7" className="px-6 py-12 text-center">
                        <div className="text-gray-500">
                          {searchTerm
                            ? "No files found matching your search."
                            : "No files found."}
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

      {/* File Details Modal */}
      {showDetailsModal && selectedFile && (
        <FileDetailsModal
          ref={detailsModalRef}
          setShowDetailsModal={setShowDetailsModal}
          selectedFile={selectedFile}
          formatDate={formatDate}
          formatFileSize={formatFileSize}
          getFileTypeName={getFileTypeName}
          getFileTypeBadgeColor={getFileTypeBadgeColor}
          handleBackdropClick={handleBackdropClick}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingFile && (
        <DeleteFileModal
          ref={deleteModalRef}
          setShowDeleteModal={setShowDeleteModal}
          deletingFile={deletingFile}
          setDeletingFile={setDeletingFile}
          handleConfirmDelete={handleConfirmDelete}
          formatFileSize={formatFileSize}
          handleBackdropClick={handleBackdropClick}
        />
      )}
    </>
  );
}

export default FilesManagement;

const FileDetailsModal = React.forwardRef(
  (
    {
      setShowDetailsModal,
      selectedFile,
      formatDate,
      formatFileSize,
      getFileTypeName,
      getFileTypeBadgeColor,
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
                File Details
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
              {/* File Info Card */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-white p-4 rounded-full shadow">
                    {selectedFile.mimeType?.startsWith("image/") ? (
                      <svg
                        className="h-16 w-16 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    ) : selectedFile.mimeType?.startsWith("video/") ? (
                      <svg
                        className="h-16 w-16 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-16 w-16 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-gray-800 truncate">
                      {selectedFile.filename}
                    </h3>
                    <div className="flex items-center flex-wrap gap-2 mt-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getFileTypeBadgeColor(
                          selectedFile.mimeType
                        )}`}
                      >
                        {getFileTypeName(selectedFile.mimeType)}
                      </span>
                      <span className="text-sm font-semibold text-gray-700">
                        {formatFileSize(parseInt(selectedFile.size || 0))}
                      </span>
                      <span className="text-sm text-gray-500">
                        • Uploaded {formatDate(selectedFile.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">
                      File Information
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500">File ID</p>
                        <p className="text-sm font-mono text-gray-800 bg-gray-50 p-2 rounded break-all">
                          {selectedFile.id}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">MIME Type</p>
                        <p className="text-sm text-gray-800 bg-gray-50 p-2 rounded">
                          {selectedFile.mimeType || "Unknown"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Storage Path</p>
                        <p className="text-sm text-gray-800 bg-gray-50 p-2 rounded break-all">
                          {selectedFile.storagePath}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">
                      Context Information
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500">Channel</p>
                        <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded">
                          <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                            <svg
                              className="h-3 w-3 text-blue-600"
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
                            <p className="text-sm font-medium text-gray-800">
                              {selectedFile.channelName || "Unknown Channel"}
                            </p>
                            <p className="text-xs text-gray-500 font-mono">
                              {selectedFile.channelId}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Owner</p>
                        <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded">
                          <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                            <svg
                              className="h-3 w-3 text-green-600"
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
                            <p className="text-sm font-medium text-gray-800">
                              {selectedFile.ownerName || "Unknown Owner"}
                            </p>
                            <p className="text-xs text-gray-500 font-mono">
                              {selectedFile.ownerId}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Created Date</p>
                        <div className="flex items-center text-gray-800 bg-gray-50 p-2 rounded">
                          <svg
                            className="h-4 w-4 mr-2 text-gray-400"
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
                          {formatDate(selectedFile.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* File Size Details */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  File Size Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">
                      {formatFileSize(parseInt(selectedFile.size || 0))}
                    </p>
                    <p className="text-xs text-gray-500">Formatted Size</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-semibold text-gray-800">
                      {parseInt(selectedFile.size || 0).toLocaleString()} bytes
                    </p>
                    <p className="text-xs text-gray-500">Bytes</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-medium text-gray-800">
                      {selectedFile.size}
                    </p>
                    <p className="text-xs text-gray-500">Raw Size</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
                <a
                  href={`/api/files/download/${selectedFile.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Download File
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

FileDetailsModal.displayName = "FileDetailsModal";

const DeleteFileModal = React.forwardRef(
  (
    {
      setShowDeleteModal,
      deletingFile,
      setDeletingFile,
      handleConfirmDelete,
      formatFileSize,
      handleBackdropClick,
    },
    ref
  ) => {
    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50"
        onClick={(e) => handleBackdropClick(e, "delete")}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
      >
        <div
          ref={ref}
          className="bg-white rounded-xl shadow-2xl max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <h2
                id="delete-modal-title"
                className="text-xl font-bold text-gray-800"
              >
                Delete File
              </h2>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingFile(null);
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
              {/* File Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                    <svg
                      className="h-6 w-6 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {deletingFile.filename}
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="text-sm text-gray-500">
                        {formatFileSize(parseInt(deletingFile.size || 0))}
                      </span>
                      <span className="text-gray-300">•</span>
                      <div className="text-xs bg-gray-200 px-2 py-1 rounded">
                        ID: {deletingFile.id.substring(0, 8)}...
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* File Context */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-blue-800 mb-2">
                  File Context
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-blue-700">Channel</p>
                    <p className="text-sm font-medium text-blue-900">
                      {deletingFile.channelName || "Unknown"}
                    </p>
                    <p className="text-xs text-blue-600 font-mono">
                      {deletingFile.channelId.substring(0, 12)}...
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-700">Owner</p>
                    <p className="text-sm font-medium text-blue-900">
                      {deletingFile.ownerName || "Unknown"}
                    </p>
                    <p className="text-xs text-blue-600 font-mono">
                      {deletingFile.ownerId.substring(0, 12)}...
                    </p>
                  </div>
                </div>
              </div>

              {/* Warning Message */}
              <div className="bg-red-50 text-red-800 p-4 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
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
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium mb-2">
                      This action cannot be undone. This will permanently:
                    </p>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Delete the file from storage</li>
                      <li>Remove all file references</li>
                      <li>
                        Free up{" "}
                        {formatFileSize(parseInt(deletingFile.size || 0))} space
                      </li>
                      <li>Break any links to this file</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  Delete Permanently
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletingFile(null);
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

DeleteFileModal.displayName = "DeleteFileModal";
