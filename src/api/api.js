import axios from "axios";

const api = axios.create({
  baseURL: " http://127.0.0.1:8080/api/v1/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, //  for cookies
});

// token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// for accessing data
api.interceptors.response.use(
  (response) => {
    if (response.data) {
      response = response.data;
    }
    return response;
  },
  (error) => Promise.reject(error)
);
