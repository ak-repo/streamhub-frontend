import api, { handleError, handleSuccess } from "../api";

export const listUsers = async () => {
  try {
    const res = await api.get(`/admin/users`);
    handleSuccess(res?.message);
    return res?.data;
  } catch (err) {
    handleError(err);
  }
};

export const banUser = async (userId, reason) => {
  console.log("banninf: ", userId, "reason:",reason);
  try {
    const res = await api.post("/admin/users/ban", {
      userId: userId,
      reason: reason,
    });
    handleSuccess(res?.message);
    return res?.data;
  } catch (err) {
    handleError(err);
  }
};

export const unbanUser = async (userId, reason) => {
  try {
    const res = await api.post("/admin/users/unban", {
      userId: userId,
      reason: reason,
    });
    handleSuccess(res?.message);
    return res?.data;
  } catch (err) {
    handleError(err);
  }
};

export const updateUserRole = async (userId, role) => {
  try {
    const res = await api.post("/admin/users/change-role", {
      userId: userId,
      role: role,
    });
    handleSuccess(res?.message);
    return res?.data;
  } catch (err) {
    handleError(err);
  }
};

export const deleteUser = async (userId, reason) => {
  try {
    console.log(userId);
  } catch (err) {
    handleError(err);
  }
};
