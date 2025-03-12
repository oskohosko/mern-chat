import Navbar from "./components/Navbar"
import { Routes, Route, Navigate } from "react-router-dom"
import HomePage from "./pages/HomePage"
import SignUpPage from "./pages/SignUpPage"
import LoginPage from "./pages/LoginPage"
import SettingsPage from "./pages/SettingsPage"
import ProfilePage from "./pages/ProfilePage"
import { useAuthStore } from "./store/useAuthStore"
import { useThemeStore } from "./store/useThemeStore"
import { useEffect } from "react"

import { Loader } from "lucide-react"
import { Toaster } from "react-hot-toast"

export default function App() {
  // Authentication state to help with management
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore()

  const { theme } = useThemeStore()

  // console.log("Online users:", { onlineUsers })

  // Checking if the user is authenticated
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  console.log({ authUser })

  // Spinning gear if we are checking the authentication status of the user
  if (isCheckingAuth && !authUser) return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin" />
    </div>
  )
  return (
    <div data-theme={theme}>
      {/* We want the navbar component at the top */}
      <Navbar />

      {/* Now let's setup the routes */}
      <Routes>
        {/* Protecting the routes with authentication */}
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
      <Toaster/>

    </div>

  )
}
