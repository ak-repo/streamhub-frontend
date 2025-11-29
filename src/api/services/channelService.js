import api, { handleError } from "../api";

export const createChannel = async (name, userId) => {
  if (!name) return;
  try {
    const res = await api.post("/channels/create", {
      name: name,
      creator_id: userId,
    });
    // console.log("channel creation response:", res);
    const data = res?.data;
    if (data.channel_id) {
      alert(
        `Channel Created!\nID: ${data.channel_id}\n(Share this ID with others)`
      );
    }
  } catch (err) {
    handleError(err);
  }
};

export const listChannels = async (userId) => {
  try {
    const res = await api.get(`/channels/${userId}`);
    // console.log("channel listing response: ", res);
    return res?.data;
  } catch (err) {
    handleError(err);
  }
};

export const joinChannel = async (channel_id, user_id) => {
  try {
    const res = await api.post(`/channels/join`, {
      channel_id: channel_id,
      user_id: user_id,
    });
    // console.log("channel join response: ", res);
    return res?.data;
  } catch (err) {
    handleError(err);
  }
};

export const getChannel = async (channel_id) => {
  try {
    const res = await api.get(`/channels/channel/${channel_id}`);
    // console.log("single channel response: ", res);
    return res?.data;
  } catch (err) {
    handleError(err);
  }
};

export const getMembers = async (channel_id) => {
  try {
    const res = await api.get(`/channels/members/${channel_id}`);
    // console.log("channel members response: ", res);
    return res?.data;
  } catch (err) {
    handleError(err);
  }
};

export const getMsgHistory = async (channel_id) => {
  try {
    const res = await api.get(`/channels/${channel_id}/history`);
    // console.log("msg history response:  ", res);
    return res?.data;
  } catch (err) {
    handleError(err);
  }
};

export const leaveChannel = async (chanID, userID) => {
  try {
    const res = await api.post(`/channels/leave`, {
      channel_id: chanID,
      user_id: userID,
    });

    return res?.data;
  } catch (err) {
    handleError(err);
  }
};

export const deleteChannel = async (chanID, userID) => {
  try {
    const res = await api.delete("/channels/delete", {
      data: {
        channelId: chanID,
        userId: userID,
      },
    });

    return res?.data;
  } catch (err) {
    handleError(err);
  }
};
