import User from "../models/user.model.js"
import Message from "../models/message.model.js"

import cloudinary from "../lib/cloudinary.js"

// Want to fetch every user except us
export const getUsersForSidebar = async (req, res) => {
  try {
    // Getting current user
    const currentUser = req.user._id

    // And filtering out current user from the list
    const filteredUsers = await User.find({ _id: { $ne: currentUser } }).select("-password")

    res.status(200).json(filteredUsers)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal Server error" })
  }
}

// Getting all messages where user with id is involved in
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params
    // Currently authenticated user's id
    const currentUserId = req.user._id

    // Finding all messages where either current user is the sender
    // Or when we are the sender
    const messages = await Message.find({
      $or: [
        {
          senderId: currentUserId,
          receiverId: userToChatId
        },
        {
          senderId: userToChatId,
          receiverId: currentUserId
        }
      ]
    })
    // Returning messages
    res.status(200).json(messages)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal Server Error" })
  }
}

// Messages can be text or images
export const sendMessage = async (req, res) => {
  try {
    // Firstly getting the text and or image from the request body
    const { text, image } = req.body
    // And the ID of the receiver
    const { id: receiverId } = req.params
    // And current user (sender) id
    const senderId = req.user._id

    let imageUrl
    // If the user sent an image, upload to cloudinary
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image)
      imageUrl = uploadResponse.secure_url
    }

    // Now that we have handled the image
    // Handle the message
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl
    })

    await newMessage.save()

    //! TODO - realtime functionality goes here => socket.io websockets

    res.status(201).json(newMessage)

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal Server Error." })
  }
}