import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js"
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/message.controller.js"

const router = express.Router()

// Fetching users for our sidebar
router.get("/user", protectRoute, getUsersForSidebar)

// Now for the messages
router.get("/:id", protectRoute, getMessages)

// And now sending messages
router.post("/send/:id", protectRoute, sendMessage)

export default router