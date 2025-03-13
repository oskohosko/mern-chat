// Creating an instance that we can use throughout the application
import axios from "axios"

export const axiosInstance = axios.create({
  // API url
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api",
  // Sending cookies with every request
  withCredentials: true
})