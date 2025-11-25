import { useState, useRef } from "react";

import {
  uploadUrlService,
  downloadUrlService,
  loadFileService,
} from "../../api/services/fileService";
import { useAuth } from "../../context/context";
function UploadsPage() {
  const { user } = useAuth();
  const [uploads, setUploads] = useState();

  const [filter, setFilter] = useState("all");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  // Replace with actual owner ID from your auth context

  const filteredUploads = uploads.filter(
    (upload) => filter === "all" || upload.type === filter
  );

  const getFileType = (fileName) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    const imageTypes = ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"];
    const videoTypes = ["mp4", "avi", "mov", "wmv", "flv", "webm"];
    const documentTypes = [
      "pdf",
      "doc",
      "docx",
      "txt",
      "ppt",
      "pptx",
      "xls",
      "xlsx",
    ];
    const archiveTypes = ["zip", "rar", "7z", "tar", "gz"];
    const designTypes = ["fig", "sketch", "xd", "ai", "psd"];

    if (imageTypes.includes(extension)) return "image";
    if (videoTypes.includes(extension)) return "video";
    if (documentTypes.includes(extension)) return "document";
    if (archiveTypes.includes(extension)) return "archive";
    if (designTypes.includes(extension)) return "design";
    return "document";
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const fileType = getFileType(file.name);
    const fileSize = formatFileSize(file.size);

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            // Stop at 90% until API call completes
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Call the upload service
      await uploadUrlService(file, user?.id);

      // Complete the progress
      setUploadProgress(100);

      // Add the new file to uploads
      const newFile = {
        id: uploads.length + 1,
        name: file.name,
        type: fileType,
        size: fileSize,
        date: new Date().toISOString().split("T")[0],
      };

      setUploads((prev) => [...prev, newFile]);

      // Load updated files list
      await loadFiles();
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      // Reset file input
      event.target.value = "";
    }
  };

  const handleDownload = async (fileId, fileName) => {
    try {
      await downloadUrlService(fileId, user.id);
      // Note: The download service should return a URL that can be used to download the file
      // You might need to open the URL in a new window or use a different approach based on your API
    } catch (error) {
      console.error("Download failed:", error);
      alert("Download failed. Please try again.");
    }
  };

  const loadFiles = async () => {
    try {
      await loadFileService(user.id);
      // Note: You'll need to update this to properly set the files from the API response
      // The service should return the files list which you can set with setUploads()
    } catch (error) {
      console.error("Failed to load files:", error);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const getFileIcon = (type) => {
    const icons = {
      document: (
        <svg
          className="w-4 h-4 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      design: (
        <svg
          className="w-4 h-4 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
          />
        </svg>
      ),
      video: (
        <svg
          className="w-4 h-4 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      ),
      archive: (
        <svg
          className="w-4 h-4 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
          />
        </svg>
      ),
      image: (
        <svg
          className="w-4 h-4 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    };
    return icons[type] || icons.document;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const totalSize = uploads.reduce((total, upload) => {
    const size = parseFloat(upload.size);
    return total + size;
  }, 0);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-medium text-gray-900 dark:text-white">
              My Files
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {uploads.length} files • {totalSize.toFixed(1)} MB used
            </p>
          </div>

          {/* Upload Button */}
          <button
            onClick={handleUploadClick}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition-colors"
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
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <span>Upload</span>
          </button>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileUpload}
          multiple
        />

        {/* Filter Tabs */}
        <div className="flex space-x-1 mt-4">
          {[
            { key: "all", label: "All" },
            { key: "document", label: "Documents" },
            { key: "image", label: "Images" },
            { key: "video", label: "Videos" },
            { key: "archive", label: "Archives" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1.5 rounded text-sm transition-colors ${
                filter === key
                  ? "bg-gray-900 text-white"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Files List */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto bg-white dark:bg-gray-800 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-600">
          <div className="p-4">
            {/* Upload Progress */}
            {isUploading && (
              <div className="mb-4 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-gray-600 dark:text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Uploading file...
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {uploadProgress}% complete
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div
                    className="bg-gray-600 dark:bg-gray-400 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {filteredUploads.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400 dark:text-gray-500">
                <svg
                  className="w-12 h-12 mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                  />
                </svg>
                <p className="text-sm">No files found</p>
                <button
                  onClick={handleUploadClick}
                  className="mt-3 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Upload Your First File
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredUploads.map((upload) => (
                  <div
                    key={upload.id}
                    className="flex items-center space-x-3 p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                  >
                    {/* File Icon */}
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                      {getFileIcon(upload.type)}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm text-gray-900 dark:text-white truncate">
                          {upload.name}
                        </h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                          {upload.size}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                        <span className="capitalize">{upload.type}</span>
                        <span>•</span>
                        <span>{formatDate(upload.date)}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleDownload(upload.id, upload.name)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded"
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
                            d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z"
                          />
                        </svg>
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded">
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Storage Summary */}
      <div className="flex-shrink-0 p-4 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Storage</span>
          <span className="text-gray-900 dark:text-white font-medium">
            {totalSize.toFixed(1)} MB / 100 MB
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-2">
          <div
            className="bg-gray-600 dark:bg-gray-400 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${(totalSize / 100) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default UploadsPage;
