// src/services/authService.js
import api, { handleError, handleSuccess } from "../api";

// -------------------------------
// Public Auth APIs
// -------------------------------
export const loginService = async (email, password) => {
  try {
    const res = await api.post("/auth/login", {
      email: email,
      password: password,
    });
    handleSuccess(res?.message);
    return res?.data;
  } catch (error) {
    handleError(error);
  }
};

export const registerService = async (data) => {
  try {
    const res = await api.post("/auth/register", data);
    handleSuccess(res?.message);
    return res?.data;
  } catch (error) {
    handleError(error);
  }
};

export const generateLinkService = async (data) => {
  console.log("Sending data:", data);
  try {
    const res = await api.post(
      "/auth/verify-gen",
      { email: data },
      {
        headers: {
          "Content-Type": "application/json", // ensure server parses JSON
        },
      }
    );
    if (res?.success) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error generating link:", error);
    handleError(error); // custom error handler
  }
};
export const verifyLinkService = async (email, token) => {
  try {
    const res = await api.get(
      `/auth/verify-link?email=${email}&token=${token}`
    );
    handleSuccess(res?.message)
    return res?.data;
  } catch (error) {
    handleError(error);
    return error;
  }
};

// -------------------------------
// Authenticated APIs
// -------------------------------
export const changePasswordService = async (data) => {
  try {
    const res = await api.post("/auth/password-change", data);
    return res?.data;
  } catch (error) {
    handleError(error);
  }
};

export const sendOtpService = async (data) => {
  try {
    const res = await api.post("/auth/send-otp", data);
    return res?.data;
  } catch (error) {
    handleError(error);
  }
};

export const verifyOtpService = async (data) => {
  try {
    const res = await api.post("/auth/verify-otp", data);
    return res?.data;
  } catch (error) {
    handleError(error);
  }
};

export const getMeService = async () => {
  try {
    const res = await api.get("/auth/me");
    return res?.data;
  } catch (error) {
    handleError(error);
  }
};
