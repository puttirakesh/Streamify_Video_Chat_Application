// lib/api.js
import { axiosInstance } from "./axios";

// Auth endpoints
export const signup = async (signupData) => {
  const response = await axiosInstance.post("/auth/signup", signupData);
  return response.data;
};

export const login = async (loginData) => {
  const response = await axiosInstance.post("/auth/login", loginData);
  return response.data;
};

export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (error) {
    console.log("Error in getAuthUser:", error);
    return null;
  }
};

export const completeOnboarding = async (userData) => {
  const response = await axiosInstance.post("/auth/onboarding", userData);
  return response.data;
};

// User endpoints
export const getUserFriends = async () => {
  try {
    const response = await axiosInstance.get("/users/friends");
    return response.data;
  } catch (error) {
    console.error("Error fetching friends:", error);
    return [];
  }
};

export const getRecommendedUsers = async () => {
  try {
    const response = await axiosInstance.get("/users/suggested");
    return response.data;
  } catch (error) {
    console.error("Error fetching recommended users:", error);
    return [];
  }
};

export const getOutgoingFriendReqs = async () => {
  try {
    const response = await axiosInstance.get("/users/outgoing-friend-requests");
    return response.data;
  } catch (error) {
    console.error("Error fetching outgoing requests:", error);
    return [];
  }
};

export const sendFriendRequest = async (userId) => {
  try {
    const response = await axiosInstance.post(`/users/friend-request`, { userId });
    return response.data;
  } catch (error) {
    console.error("Error sending friend request:", error);
    throw error.response?.data || error;
  }
};

export const getFriendRequests = async () => {
  try {
    const response = await axiosInstance.get("/users/friend-requests");
    return response.data;
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    return { incomingReqs: [], acceptedReqs: [] };
  }
};

export const acceptFriendRequest = async (requestId) => {
  try {
    const response = await axiosInstance.put(`/users/friend-requests/${requestId}/accept`);
    return response.data;
  } catch (error) {
    console.error("Error accepting friend request:", error);
    throw error.response?.data || error;
  }
};

export const rejectFriendRequest = async (requestId) => {
  try {
    const response = await axiosInstance.put(`/users/friend-requests/${requestId}/reject`);
    return response.data;
  } catch (error) {
    console.error("Error rejecting friend request:", error);
    throw error.response?.data || error;
  }
};

export const getStreamToken = async () => {
  try {
    const response = await axiosInstance.get("/chat/token");
    return response.data;
  } catch (error) {
    console.error("Error getting stream token:", error);
    throw error.response?.data || error;
  }
};