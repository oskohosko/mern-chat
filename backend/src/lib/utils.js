import jwt from "jsonwebtoken"

export const generateToken = (userId, res) => {
  // Generating token
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  })

  // Sending to the user in an http only cookie for 7 days
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // Milliseconds
    httpOnly: true,  // Prevents XSS attacks - more secure
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development" // True if in production
  })


  return token
}