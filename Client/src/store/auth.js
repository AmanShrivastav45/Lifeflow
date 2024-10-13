import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:5050/lifeflow/auth";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null, // Load user from localStorage
  isAuthenticated: localStorage.getItem("isAuthenticated") === "true" || false, // Load auth status
  role: localStorage.getItem("role") || null, // Load role from localStorage
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

  // Sign up method
  signup: async (
    firstName,
    lastName,
    email,
    phone,
    password,
    selectedRole,
    bloodGroup,
    gender,
    city,
    pincode
  ) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        password: password,
        bloodGroup: bloodGroup,
        selectedRole: selectedRole,
        gender: gender,
        city: city,
        pincode: pincode,
      });
      const userData = response.data.user;

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("role", selectedRole); // Persist role

      set({
        user: userData,
        isAuthenticated: true,
        isLoading: false,
        role: selectedRole,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error signing up",
        isLoading: false,
      });
      throw error;
    }
  },

  // Login method
  login: async (email, password, role) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
        role,
      });
      const userData = response.data.user;
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("role", role); // Persist role

      set({
        isAuthenticated: true,
        user: userData,
        role: role,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error logging in",
        isLoading: false,
      });
      throw error;
    }
  },

  // Logout method
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/logout`);
      localStorage.removeItem("user");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("role");

      set({
        user: null,
        isAuthenticated: false,
        role: null,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({ error: "Error logging out", isLoading: false });
      throw error;
    }
  },

  // Verify email method
  verifyEmail: async (code, role) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/verify-email`, {
        OTP: code,
        role,
      });
      const userData = response.data.user;

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("role", role); // Persist role

      set({
        user: userData,
        isAuthenticated: true,
        role: role,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error verifying email",
        isLoading: false,
      });
      throw error;
    }
  },

  // Check if the user is already authenticated (useful for page reloads)
  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const isAuthenticated =
        localStorage.getItem("isAuthenticated") === "true";
      const role = localStorage.getItem("role");

      if (userData && isAuthenticated) {
        set({
          user: userData,
          isAuthenticated: true,
          role: role,
          isCheckingAuth: false,
        });
      } else {
        // If no stored user, check with the API
        const response = await axios.get(`${API_URL}/check-auth`);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("role", response.data.user.role); // Persist role

        set({
          user: response.data.user,
          isAuthenticated: true,
          role: response.data.user.role,
          isCheckingAuth: false,
        });
      }
    } catch (error) {
      localStorage.removeItem("user");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("role");
      set({ error: null, isCheckingAuth: false, isAuthenticated: false });
    }
  },

  // Forgot password method
  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, {
        email,
      });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error.response?.data?.message || "Error sending reset password email",
      });
      throw error;
    }
  },

  // Reset password method
  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, {
        password,
      });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Error resetting password",
      });
      throw error;
    }
  },

  createClass: async (className, description) => {
    set({ isLoading: true, error: null });

    try {
      const mentorId = JSON.parse(localStorage.getItem("user"))._id; // Assuming user ID is stored in localStorage
      const response = await axios.post(`${API_URL}/create-class`, {
        className,
        description,
        mentorId,
      });

      set({
        message: response.data.message,
        isLoading: false,
        error: null,
      });

      return response.data.class;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Error creating class",
      });
      throw error;
    }
  },
  // getClassesByMentor : async (mentorId) => {
  //   try {
  //     const response = await axios.post(`${API_URL}/get-classes-by-mentor`, {
  //       mentorId: mentorId,  // send mentorId in the body
  //     });
  //     console.log(response.data.classes);  // Logging the retrieved classes
  //     return response.data.classes;  // Return classes data
  //   } catch (error) {
  //     console.error("Error fetching classes:", error.response?.data?.message || error.message);
  //     throw error;
  //   }
  // }
}));
