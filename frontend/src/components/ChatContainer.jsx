import { useEffect, useRef } from 'react'
import { useChatStore } from '../store/useChatStore'
import ChatHeader from './ChatHeader'
import MessageInput from './MessageInput'
import MessageSkeleton from './skeletons/MessageSkeleton'
import { useAuthStore } from '../store/useAuthStore'
import { formatMessageTime } from '../lib/utils'

export default function ChatContainer() {

  const { messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unSubscribeFromMessages } = useChatStore()

  const { authUser } = useAuthStore()

  // Ref for scrolling to the end of the messages
  const messageEndRef = useRef(null)

  useEffect(() => {
    getMessages(selectedUser._id)
    // When we get messages, listen for new ones
    subscribeToMessages()

    // When we cleanup we unsubscribe from listening to new messages
    return () => {
      unSubscribeFromMessages()
    }
  }, [selectedUser._id, getMessages, subscribeToMessages, unSubscribeFromMessages])

  // Use effect hook for scrolling to the end of the new message
  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Map through messages and show the message and image if there is one */}
        {messages.map((message) => (
          <div
            key={message._id}
            // If the authenticated user is sending the message, we want message on the right
            // Else on the left
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full">
                <img
                  // If the authenticated user is sending the message, we want to show their profile picture
                  src={message.senderId === authUser._id ? authUser.profilePic || "/avatar.png" : selectedUser.profilePic || "/avatar.png"}
                  alt="profile pic"
                />
              </div>
            </div>
            {/* Time of the message being sent */}
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            {/* Chat bubble */}
            <div className="chat-bubble flex flex-col gap-1">
              {/* Displaying the image and text */}
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-mb mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  )
}
