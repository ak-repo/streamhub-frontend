import api, { handleError, handleSuccess } from "../api";

export const listFiles = async () => {
  try {
    const res = await api.get(`/admin/files`);
    handleSuccess(res?.message);
    return res?.data;
  } catch (err) {
    handleError(err);
  }
};

export const deleteFile = async (filesId) => {
  try {
    const res = await api.delete(`/admin/files/${filesId}`, {
      data: { filesId },
    });
    handleSuccess(res?.message);
    return res?.data;
  } catch (err) {
    handleError(err);
  }
};
