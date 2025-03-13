import { create } from "zustand"
import { axiosInstance } from "../lib/axios.js"
import toast from "react-hot-toast"

import { io } from "socket.io-client"

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/"

// Global state management
export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  // This method will check if the user is authenticated
  // We use this whenever we refresh the application
  checkAuth: async () => {
    try {
      // Using our check endpoint
      const response = await axiosInstance.get("/auth/check")
      // Now we can set the authUser state with this response
      set({ authUser: response.data })

      // Need to connect to our socket after checking auth
      console.log("Checking auth")
      get().connectSocket()

    } catch (error) {
      // This means user is not authenticated
      set({ authUser: null })

      console.log("Error in checkAuth", error)
    } finally {
      // Using a finally block to showcase that we have finished checking auth
      set({ isCheckingAuth: false })
    }
  },

  // When validation on the form is complete, we call this method to sign up the user
  signup: async (data) => {
    set({ isSigningUp: true })

    try {
      const res = await axiosInstance.post("/auth/signup", data)
      set({ authUser: res.data })
      toast.success("Account created successfully.")

      // After successful signup, we can connect to our socket
      get().connectSocket()

    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      set({ isSigningUp: false })
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true })
    try {
      const res = await axiosInstance.post("/auth/login", data)
      set({ authUser: res.data })
      toast.success("Logged in successfully.")

      // After successful login, we can connect to our socket
      get().connectSocket()

    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      set({ isLoggingIn: false })
    }
  },

  // Now the logout functionality
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout")
      set({ authUser: null })
      toast.success("Logged out successfully")
      // Disconnecting from the socket when we logout
      get().disconnectSocket()
    } catch (error) {
      toast.error(error.response.data.message)
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true })
    try {
      const res = await axiosInstance.put("/auth/update-profile", data)
      set({ authUser: res.data })
      toast.success("Profile updated successfully")
    } catch (error) {
      console.log("Error in updateProfile", error)
      toast.error(error.response.data.message)
    } finally {
      set({ isUpdatingProfile: false })
    }
  },

  // This is for connecting to our socket
  connectSocket: () => {

    const { authUser } = get()
    // If there is no authenticated user
    // or if the socket is already connected
    // then we don't need to connect
    if (!authUser || get().socket?.connected) {
      return
    }
    // Connecting to backend server
    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id
      }
    })

    socket.connect()

    set({ socket: socket })

    // Listening for online users
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds })
    })
  },

  disconnectSocket: () => {
    if (get().socket?.connected) {
      get().socket.disconnect()
    }
  }
}))