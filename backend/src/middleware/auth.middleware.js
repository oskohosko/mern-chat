import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

export const protectRoute = async (req, res, next) => {
  try {
    // Firstly checking if there is a token or not
    const token = req.cookies.jwt

    // If there is not a token provided
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No Token Provided." })
    }

    // If there is a token - we need to decode it to grab user id
    // We put user id into the payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    // Invalid token - falsy value
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token." })
    }

    // Finding the user from the decoded token
    // Not wanting to send password back to the client
    const user = await User.findById(decoded.userId).select("-password")

    // Handling an issue
    if (!user) {
      return res.status(404).json({ message: "User Not Found." })
    }

    // Setting the user
    req.user = user

    // And now proceeding to whatever method is next in the route
    next()

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal Server Error" })
  }
}