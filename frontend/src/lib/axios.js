// Creating an instance that we can use throughout the application
import axios from "axios"

export const axiosInstance = axios.create({
  // API url
  baseURL: "http://localhost:5001/api",
  // Sending cookies with every request
  withCredentials: true
})