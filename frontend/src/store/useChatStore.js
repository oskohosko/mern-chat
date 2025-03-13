import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true })
    try {
      const res = await axiosInstance.get("/messages/users")
      set({ users: res.data })
    } catch (error) {
      toast.error("Failed to fetch users:" + error.response.data.message)
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true })
    try {
      const res = await axiosInstance.get(`/messages/${userId}`)
      set({ messages: res.data })
    } catch (error) {
      toast.error("Failed to fetch messages:" + error.response.data.message)
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get()

    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData)
      set({messages: [...messages, res.data]})

    } catch (error) {
      toast.error(error.response.data.message)
    }
  },

  subscribeToMessages: () => {
    const selectedUser = get().selectedUser
    if (!selectedUser) {
      return
    }

    const socket = useAuthStore.getState().socket

    // Todo: optimize this function
    socket.on("newMessage", (newMessage) => {
      // Spreading messages array and adding new one at the end in realtime
      set({
        messages: [...get().messages, newMessage]
      })
    })
  },

  // Unsuscribe from messages (when logging out or closing)
  unSubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket
    socket.off("newMessage")
  },

  // TODO optimize this function
  setSelectedUser: (selectedUser) => set({ selectedUser })
}))