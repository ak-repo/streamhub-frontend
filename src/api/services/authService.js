// src/services/authService.js
import api from "../api";

// -------------------------------
// Centralized Error Handler
// -------------------------------
const handleError = (error) => {
  const message =
    error?.response?.data?.message || error?.message || "Something went wrong";

  console.error("API Error:", message);
  throw new Error(message);
};

// -------------------------------
// Public Auth APIs
// -------------------------------
export const loginService = async (data) => {
  try {
    const res = await api.post("/auth/login", data);
    return res;
  } catch (error) {
    handleError(error);
  }
};

export const registerService = async (data) => {
  try {
    const res = await api.post("/auth/register", data);
    return res;
  } catch (error) {
    handleError(error);
  }
};

export const generateLinkService = async (data) => {
  console.log("Sending data:", data);
  try {
    const res = await api.post(
      "/verify-gen",
      { email: data },
      {
        headers: {
          "Content-Type": "application/json", // ensure server parses JSON
        },
      }
    );
    return res;
  } catch (error) {
    console.error("Error generating link:", error);
    handleError(error); // custom error handler
  }
};
export const verifyLinkService = async (email, token) => {
  try {
    const res = await api.get(`/auth/verify-link?email=${email}&token=${token}`);

    return res;
  } catch (error) {
    handleError(error);
  }
};

// -------------------------------
// Authenticated APIs
// -------------------------------
export const changePasswordService = async (data) => {
  try {
    const res = await api.post("/auth/password-change", data);
    return res;
  } catch (error) {
    handleError(error);
  }
};

export const sendOtpService = async (data) => {
  try {
    const res = await api.post("/auth/send-otp", data);
    return res;
  } catch (error) {
    handleError(error);
  }
};

export const verifyOtpService = async (data) => {
  try {
    const res = await api.post("/auth/verify-otp", data);
    return res;
  } catch (error) {
    handleError(error);
  }
};

export const getMeService = async () => {
  try {
    const res = await api.get("/auth/me");
    return res.data;
  } catch (error) {
    handleError(error);
  }
};
