// Save theme to local storage
import { create } from 'zustand';

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("chat-theme") || 'light',
  setTheme: (theme) => {
    localStorage.setItem("chat-theme", theme)
    set({ theme })
  },
}))