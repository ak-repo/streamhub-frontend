import api from "../api";
import axios from "axios";

/**
 * Upload a file using presigned URL
 */
export const uploadUrlService = async (file, ownerId) => {
  try {
    if (!file) {
      alert("Select a file first!");
      return null;
    }

    // STEP 1: Request presigned upload URL
    const res = await api.post(`/files/upload-url`, {
      owner_id: ownerId,
      filename: file.name,
      size: file.size,
      mime: file.type,
      is_public: false,
    });

    const uploadURL = res?.data?.upload_url;
    const fileId = res?.data?.file_id;

    console.log("Presigned URL:", uploadURL);
    console.log("File ID:", fileId);

    // STEP 2: Upload file directly to MinIO/S3 using axios
    await axios.put(uploadURL, file, {
      headers: {
        "Content-Type": file.type,
      },
    });

    // STEP 3: Confirm upload to backend
    await api.post(`/files/confirm`, {
      owner_id: ownerId,
      file_id: fileId,
    });

    console.log("Upload complete");

    return fileId; // return file id for chat usage
  } catch (err) {
    console.error("Upload failed:", err);
    throw err;
  }
};

/**
 * Load all files for an owner
 */
export const loadFileService = async (ownerId) => {
  try {
    const res = await api.get(`/files/${ownerId}`);
    console.log("Files:", res.data.files);
    return res.data.files;
  } catch (err) {
    console.error("Failed to load files:", err);
    throw err;
  }
};

/**
 * Get a temporary download URL
 */
export const downloadUrlService = async (fileId, ownerId) => {
  try {
    const res = await api.get(
      `/download-url?file_id=${fileId}&owner_id=${ownerId}&expiry=300`
    );

    console.log("Download URL:", res.data.download_url);
    return res.data.download_url;
  } catch (err) {
    console.error("Failed to get download URL:", err);
    throw err;
  }
};
