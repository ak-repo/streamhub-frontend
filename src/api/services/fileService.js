import api from "../api";
import axios from "axios";

/**
 * Upload a file using presigned URL
 */
export const uploadFile = async (file, userId, channelId, isPublic) => {
  try {
    if (!file) {
      alert("Select a file first!");
      return null;
    }

    console.log("chann id:", channelId);

    // 1. Request presigned upload URL
    const { data } = await api.post(`/files/upload-url`, {
      ownerId: userId,
      filename: file.name,
      size: file.size,
      mimeType: file.type,
      isPublic: isPublic,
      channelId: channelId,
    });

    const uploadUrl = data?.upload_url;
    const fileId = data?.file_id;
    console.log("file id ", fileId);

    // 2. Upload directly to S3 / MinIO
    // await axios.put(uploadUrl, file, {
    //   headers: {
    //     "Content-Type": file.type,
    //   },
    // });

    // 3. Confirm upload
    const res = await api.post(`/files/confirm`, {
      fileId: fileId,
    });

    console.log("file upload confirm res: ", res);
    return fileId;
  } catch (err) {
    console.error("Upload failed:", err);
    throw err;
  }
};

/**
 * List files for a channel
 */
export const listFilesByChannel = async (userId, channelId) => {
  try {
    const res = await api.get(`/files`, {
      params: {
        channelId: channelId, // <-- camelCase
        requesterId: userId, // <-- camelCase
      },
    });

    return res.data;
  } catch (err) {
    console.error("Failed to load files:", err);
    throw err;
  }
};

/**
 * Get a temporary download URL
 */
// FileID        string `json:"fileId"`
// 	ExpireSeconds int64  `json:"expireSeconds"`
// 	RequesterID   string `json:"requesterId"`
export const downloadUrl = async (fileId, userId, seconds) => {
  try {
    const res = await api.get(
      `/files/download-url?fileId=${fileId}&requesterId=${userId}&expireSeconds=${seconds}`
    );
    console.log("res for download:", res);

    const url = res.data?.download_url;
    if (!url) throw new Error("No download URL returned");

    return url;
  } catch (err) {
    console.error("Failed to get download URL:", err);
    throw err;
  }
};
