import api, { handleError, handleSuccess } from "../api";

export const createChannel = async (name, userId) => {
  if (!name) return;
  try {
    const res = await api.post("/channels/create", {
      name: name,
      creatorId: userId, // changed from creator_id
    });
    handleSuccess(res?.message);
    return res?.data;
  } catch (err) {
    handleError(err);
  }
};

export const listChannels = async () => {
  try {
    const res = await api.get(`/channels/`);
    return res?.data;
  } catch (err) {
    handleError(err);
  }
};

export const joinChannel = async (channelId, userId) => {
  try {
    const res = await api.post(`/channels/join`, {
      channelId: channelId, // changed from channel_id
      userId: userId, // changed from user_id
    });
    return res?.data;
  } catch (err) {
    handleError(err);
  }
};

export const getChannel = async (channelId) => {
  try {
    const res = await api.get(`/channels/channel/${channelId}`);
    return res?.data;
  } catch (err) {
    handleError(err);
  }
};

export const getMembers = async (channelId) => {
  try {
    const res = await api.get(`/channels/members/${channelId}`);
    return res?.data;
  } catch (err) {
    handleError(err);
  }
};

export const getMsgHistory = async (channelId) => {
  console.log(channelId, "id");
  try {
    const res = await api.get(`/channels/${channelId}/history`);
    return res?.data;
  } catch (err) {
    handleError(err);
  }
};

export const leaveChannel = async (channelId, userId) => {
  try {
    const res = await api.post(`/channels/leave`, {
      channelId: channelId,
      userId: userId,
    });
    return res?.data;
  } catch (err) {
    handleError(err);
  }
};

export const deleteChannel = async (channelId, userId) => {
  try {
    const res = await api.delete(
      `/channels/delete?requesterId=${userId}&channelId=${channelId}`
    );
    handleSuccess(res?.message);
    return res?.data;
  } catch (err) {
    handleError(err);
  }
};

export const searchChannels = async () => {
  console.log("clicked channel");
};

export const sendJoin = async (userId, channelId) => {
  try {
    const res = await api.post("/channels/sendjoin", { channelId, userId });
    handleSuccess(res?.message);
    return res?.data;
  } catch (err) {
    handleError(err);
  }
};
export const sendInvite = async (channelId, userId) => {
  try {
    const res = await api.post("/channels/sendinvite", { channelId, userId });
    handleSuccess(res?.message);
    return res?.data;
  } catch (err) {
    handleError(err);
  }
};

export const userInvites = async () => {
  try {
    const res = await api.get("/channels/invites");
    handleSuccess(res?.message);
    return res?.data;
  } catch (err) {
    handleError(err);
  }
};

export const channelJoins = async (channelId) => {
  try {
    const res = await api.get(`/channels/joins/${channelId}`);
    handleSuccess(res?.message);
    return res?.data;
  } catch (err) {
    handleError(err);
  }
};

export const updateRequstStatus = async (reqId, status) => {
  try {
    const res = await api.post("/channels/updatereq", { reqId, status });
    handleSuccess(res?.message);
    return res?.data;
  } catch (err) {
    handleError(err);
  }
};

// admin-specified services

// export const listChannels = async () => {
//   try {
//     const res = await api.get(`/admin/channels`);
//     handleSuccess(res?.message);
//     return res?.data;
//   } catch (err) {
//     handleError(err);
//   }
// };

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
    console.log(channelId);
    const res = await api.post("/admin/channels/unfreeze", {
      channelId: channelId,
    });
    handleSuccess(res?.message);
    return res?.data;
  } catch (err) {
    handleError(err);
  }
};

// export const deleteChannel = async (channelId) => {
//   try {
//     const res = await api.delete(`/admin/channels/${channelId}`);

//     handleSuccess(res?.data?.message);
//     return res?.data;
//   } catch (err) {
//     handleError(err);
//   }
// };
