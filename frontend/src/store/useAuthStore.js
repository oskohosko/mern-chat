import { create } from "zustand"
import { axiosInstance } from "../lib/axios"

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

  
}))