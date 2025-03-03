// Using Mongoose to connect to our db and interact
import mongoose from "mongoose"

export const connectDB = async () => {
  try {
    // Connecting to our database
    const conn = await mongoose.connect(process.env.MONGODB_URI)
    console.log(`MongoDB connected: ${conn.connection.host}`)
  } catch (err) {
    console.log(err)
  }
}

