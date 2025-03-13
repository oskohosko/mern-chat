import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import { connectDB } from "./lib/db.js"
import cors from "cors"

import path from "path"

// Using module so use .js on the end
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import { app, server } from "./lib/socket.js"

// Setting up app
dotenv.config()
const PORT = process.env.PORT

const __dirname = path.resolve()

app.use(express.json())
// Allows us to parse cookies
app.use(cookieParser())
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true // Allowing auth headers to be sent
}))

// Endpoints
app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)

// Serving static assets if in production
if (process.env.NODE_ENV === "production") {
  // Setting static folder
  app.use(express.static(path.join(__dirname, "../frontend/dist")))

  // Sending index.html file
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))}
  )
}


// Setting up the app
server.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`)
  connectDB()
})