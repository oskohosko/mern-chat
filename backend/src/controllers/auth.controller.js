import { generateToken } from "../lib/utils.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import cloudinary from "../lib/cloudinary.js"

// Handling the user signup
export const signup = async (req, res) => {
  const { fullName, email, password } = req.body

  try {
    // Ensuring password length
    if (password.trim().length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" })
    }

    // Ensuring all fields are filled
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      return res.status(400).json({ message: "All fields must be non-empty." })
    }

    // Checking if email already exists
    const user = await User.findOne({ email })
    if (user) {
      res.status(400).json({ message: "Email already exists." })
    }

    // Encrypting password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword
    })

    if (newUser) {
      // Generating the token
      generateToken(newUser._id, res)
      // And saving the user to the DB
      await newUser.save()
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic
      })
    } else {
      res.status(400).json({ message: "Invalid user data" })
    }

  } catch (err) {
    console.log("Error in signup controller", err.message)
    res.status(500).json("Internal Error")
  }
}

// Handling the login of the user
export const login = async (req, res) => {
  const { email, password } = req.body

  try {
    // Checking if user exists in the db
    const user = await User.findOne({ email })

    // If they don't exist.
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Now checking if the passwords match
    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // If all is correct, we generate the token for the user
    generateToken(user._id, res)

    // Sending back the user details
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal Server Error" })
  }
}

// Handling logout of the user
export const logout = (req, res) => {
  // Remove the token from the user and have it expire immediately
  try {
    // Removing cookie and expiring immediately
    res.cookie("jwt", "", { maxAge: 0 })
    res.status(200).json({ message: "Logged out successfully." })
    // Handling errors
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal Server Error" })
  }
}

// Handling updating of user's profiles
// Need to be logged in to access
// Middleware
export const updateProfile = async (req, res) => {
  // Need to get profile pic
  try {
    // Extracting profile pic from request body
    const { profilePic } = req.body
    // And getting the user id as we set user in the middleware
    const userId = req.user._id

    // If they didn't give us a profile picture
    if (!profilePic) {
      return res.status(400).json({ message: "Profile Pic is required." })
    }
    // Uploading image to our bucket of images
    const uploadResponse = await cloudinary.uploader.upload(profilePic)
    // Finding user and updating the profile pic
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true } // Returns the updated object, not previous one
    )

    // And a success message
    res.status(200).json({ message: "Updated User." })

  } catch (error) {
    // Handling any errors as always
    console.log(error)
    res.status(500).json({ message: "Internal server error." })
  }
}

export const checkAuth = (req, res) => {
  // Sending user back to the client
  try {
    res.status(200).json(req.user)
  } catch (error) {
    console.log("Error in checkAuth controller.", error.message)
    res.status(500).json({ message: "Internal Server Error." })
  }
}
