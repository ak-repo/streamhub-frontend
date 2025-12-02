import api, { handleError, handleSuccess } from "../api";

export const listChannels = async () => {
  try {
    const res = await api.get(`/admin/channels`);
    handleSuccess(res?.message);
    console.log("list resp: ", res?.data);
    return res?.data;
  } catch (err) {
    handleError(err);
  }
};

export const freezeChannel = async (channelId, reason) => {
  try {
    const res = await api.post("/admin/channels/freeze", {
      channelId: channelId,
      reason: reason,
    });
    handleSuccess(res?.message);
    return res?.data;
  } catch (err) {
    handleError(err);
  }
};

export const unfreezeChannel = async (channelId) => {
  try {
    const res = await api.post("/admin/channels/freeze", {
      channelId: channelId,
    });
    handleSuccess(res?.message);
    return res?.data;
  } catch (err) {
    handleError(err);
  }
};

export const deleteChannel = async (channelId) => {
  try {
    const res = await api.delete("/admin/channels/delete", {
      data: { channelId },
    });

    handleSuccess(res?.data?.message);
    return res?.data;
  } catch (err) {
    handleError(err);
  }
};
