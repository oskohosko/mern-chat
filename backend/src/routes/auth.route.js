import express from "express"
import { login, logout, signup, updateProfile, checkAuth } from "../controllers/auth.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js"

const router = express.Router()

// Basic auth endpoints
router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)

// Updating profile endpoint
router.put("/update-profile", protectRoute, updateProfile)

// And one to check if the userr is authenticated
// Do this when refreshing
router.get("/check", protectRoute, checkAuth)

export default router