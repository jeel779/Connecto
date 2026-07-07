import { axiosInstance } from "../lib/axios";

export const loginUser = async (email, password) => {
  const res = await axiosInstance.post("/user/login", { email, password });
  if (res.status !== 200) {
    throw new Error("Failed to login");
  }
  return res.data;
};

export const signupUser = async (username, email, password) => {
  const res = await axiosInstance.post("/user/signup", { username, email, password });
  if (res.status !== 200) {
    throw new Error("Unable to Signup");
  }
  return res.data;
};

export const checkAuthStatus = async () => {
  const res = await axiosInstance.get("/user/profile");
  if (res.status !== 200) {
    throw new Error("Unable to authenticate");
  }
  return res.data;
};

export const logoutUser = async () => {
  const res = await axiosInstance.post("/user/logout");
  if (res.status !== 200) {
    throw new Error("Unable to logout");
  }
  return res.data;
};

export const followAndUnfollowUser = async (userId) => {
  const res = await axiosInstance.post(`/user/follow/${userId}`);
  if (res.status !== 200) {
    throw new Error("Unable to follow/unfollow user");
  }
  return res.data;
};

export const getSuggestedUsers = async () => {
  const res = await axiosInstance.get("/user/suggested");
  if (res.status !== 200) {
    throw new Error("Unable to get suggested users");
  }
  return res.data;
};

export const getUserProfile = async (username) => {
  const res = await axiosInstance.get(`/user/profile/${username}`);
  if (res.status !== 200) {
    throw new Error("Unable to get user profile");
  }
  return res.data;
};

export const updateProfile = async (userData) => {
  const res = await axiosInstance.patch("/user/update", userData);
  if (res.status !== 200) {
    throw new Error("Unable to update profile");
  }
  return res.data;
};

export const updateProfileImage = async (formData) => {
  const res = await axiosInstance.patch("/user/update-profile-image", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  if (res.status !== 200) {
    throw new Error("Unable to update profile image");
  }
  return res.data;
};

export const updateCoverImage = async (formData) => {
  const res = await axiosInstance.patch("/user/update-cover-image", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  if (res.status !== 200) {
    throw new Error("Unable to update cover image");
  }
  return res.data;
};

export const getAllPosts = async () => {
  const res = await axiosInstance.get("/posts/all");
  if (res.status !== 200) {
    throw new Error("Unable to fetch posts");
  }
  return res.data;
};

export const getFollowingPosts = async () => {
  const res = await axiosInstance.get("/posts/following");
  if (res.status !== 200) {
    throw new Error("Unable to fetch following posts");
  }
  return res.data;
};

export const getLikedPosts = async () => {
  const res = await axiosInstance.get("/posts/liked");
  if (res.status !== 200) {
    throw new Error("Unable to fetch liked posts");
  }
  return res.data;
};

export const createPost = async (formData) => {
  const res = await axiosInstance.post("/posts/create", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  if (res.status !== 200) {
    throw new Error("Unable to create post");
  }
  return res.data;
};

export const deletePost = async (postId) => {
  const res = await axiosInstance.delete(`/posts/${postId}`);
  if (res.status !== 200) {
    throw new Error("Unable to delete post");
  }
  return res.data;
};

export const commentOnPost = async (postId, text) => {
  const res = await axiosInstance.post(`/posts/comment/${postId}`, { text });
  if (res.status !== 200) {
    throw new Error("Unable to comment on post");
  }
  return res.data;
};

export const likeUnlikePost = async (postId) => {
  const res = await axiosInstance.patch(`/posts/like/${postId}`);
  if (res.status !== 200) {
    throw new Error("Unable to like/unlike post");
  }
  return res.data;
};

export const getNotifications = async () => {
  const res = await axiosInstance.get("/notifications");
  if (res.status !== 200) {
    throw new Error("Unable to fetch notifications");
  }
  return res.data;
};

export const clearNotifications = async () => {
  const res = await axiosInstance.delete("/notifications");
  if (res.status !== 200) {
    throw new Error("Unable to clear notifications");
  }
  return res.data;
};