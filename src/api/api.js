import axios from "axios";

const BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 45000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Something went wrong. Please try again.";

    return Promise.reject(new Error(message));
  }
);

export const sendMessage = (payload) => api.post("/messages/send", payload);

export const getMessages = (params) => api.get("/messages", { params });

export const getMessageById = (id) => api.get(`/messages/${id}`);

export default api;