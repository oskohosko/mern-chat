import { Server } from "socket.io"
import http from "http"
import express from "express"


const app = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
})


export function getReceiverSocketId(userId) {
  return userSocketMap[userId]
}

// This is for our online users list
const userSocketMap = {} // { userId: socketId }

io.on("connection", (socket) => {
  console.log("A user connected", socket.id)

  // Getting user id
  const userId = socket.handshake.query.userId

  if (userId) {
    userSocketMap[userId] = socket.id
  }

  // Broadcasting to all clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap))


  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id)
    // Removing user from online users list
    delete userSocketMap[userId]
    io.emit("getOnlineUsers", Object.keys(userSocketMap))
  })
})



export { io, app, server }