import { useAuth, useChannel } from "../../../context/context";
import { uploadFile, downloadUrl } from "../../../api/services/fileService";
import { useState } from "react";

export default function Files() {
  const { user } = useAuth();
  const { files, chanID, refFile, setRefFile } = useChannel();
  const [isUploading, setIsUploading] = useState(false);

  const getFileIcon = (filename) => {
    const extension = filename.split(".").pop()?.toLowerCase();
    const iconClass = "w-4 h-4 text-gray-600";

    const icons = {
      pdf: (
        <svg
          className={iconClass}
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
      mp4: (
        <svg
          className={iconClass}
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
      zip: (
        <svg
          className={iconClass}
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
      default: (
        <svg
          className={iconClass}
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
    };

    if (["pdf", "doc", "docx", "txt"].includes(extension)) return icons.pdf;
    if (["mp4", "avi", "mov", "wmv"].includes(extension)) return icons.mp4;
    if (["zip", "rar", "7z"].includes(extension)) return icons.zip;
    return icons.default;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const handleDownload = async (fileId, filename) => {
    try {
      const signedUrl = await downloadUrl(fileId, user?.id, 3600);

      const link = document.createElement("a");
      link.href = signedUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      alert("Download failed.");
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await uploadFile(file, user.id, chanID, false);
      setRefFile(!refFile);
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-medium text-gray-900 dark:text-white">
              Channel Files
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {files?.length || 0} files in this channel
            </p>
          </div>

          {/* Upload Button */}
          <label className="flex items-center space-x-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer">
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
            <input
              type="file"
              className="hidden"
              onChange={handleUpload}
              disabled={isUploading}
            />
          </label>
        </div>
      </div>

      {/* Files List */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto bg-white dark:bg-gray-800 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-600">
          <div className="p-4">
            {isUploading && (
              <div className="mb-4 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
                <div className="flex items-center space-x-3">
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
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    Uploading file...
                  </div>
                </div>
              </div>
            )}

            {files && files.length > 0 ? (
              <div className="space-y-2">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center space-x-3 p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                  >
                    {/* File Icon */}
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                      {getFileIcon(file.filename)}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm text-gray-900 dark:text-white truncate">
                          {file.filename}
                        </h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                          {formatFileSize(file.size)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Uploaded by{" "}
                        {file.owner_id === user?.id ? "you" : "user"}
                      </div>
                    </div>

                    {/* Download Button */}
                    <button
                      onClick={() => handleDownload(file.id, file.filename)}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded"
                      title="Download"
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
                  </div>
                ))}
              </div>
            ) : (
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
                <p className="text-sm">No files uploaded yet</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Upload the first file to this channel
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
