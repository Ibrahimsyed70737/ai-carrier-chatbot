// server/models/Chat.js
const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
  sender: {
    type: String, // 'user' or 'bot'
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const chatSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Reference to the User model
    },
    messages: [messageSchema], // Array of message objects
    title: { // Optional: for display in chat history (e.g., "Chat with AI about career X")
      type: String,
      default: 'New Chat',
    }
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;