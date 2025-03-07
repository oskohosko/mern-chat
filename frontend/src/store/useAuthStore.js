import { create } from "zustand"
import { axiosInstance } from "../lib/axios.js"
import toast from "react-hot-toast"

// Global state management
export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  // This method will check if the user is authenticated
  // We have an endpoint for this so we can use it
  checkAuth: async () => {
    try {
      // Using our check endpoint
      const response = await axiosInstance.get("/auth/check")
      // Now we can set the authUser state with this response
      set({ authUser: response.data })

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
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }
}))