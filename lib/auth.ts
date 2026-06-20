import api from "./api";

export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  const res = await api.post("/auth/login", data);

  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(res.data.user));
    localStorage.setItem("accessToken", res.data.accessToken);
  }

  return res.data;
};

export const registerUser = async (data: {
  username: string;
  email: string;
  password: string;
  role: "talent" | "startup";
}) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};

export const logoutUser = async () => {
  const res = await api.post("/auth/logout");

  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
  }

  return res.data;
};

export const isAuthenticated = () => {
  if (typeof window === "undefined") return false;

  const user = localStorage.getItem("user");
  const token = localStorage.getItem("accessToken");

  return Boolean(user || token);
};

export const getUser = () => {
  if (typeof window === "undefined") return null;

  const user = localStorage.getItem("user");

  if (!user) return null;

  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
};

export const logout = () => {
  if (typeof window === "undefined") return;

  localStorage.removeItem("user");
  localStorage.removeItem("accessToken");
};