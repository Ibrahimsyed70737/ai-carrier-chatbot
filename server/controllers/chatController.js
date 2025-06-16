// server/controllers/chatController.js
const Chat = require('../models/Chat');

// @desc    Get all chats for a user
// @route   GET /api/chat
// @access  Private
const getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single chat by ID for a user
// @route   GET /api/chat/:id
// @access  Private
const getChatById = async (req, res) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, user: req.user._id });
    if (chat) {
      res.json(chat);
    } else {
      res.status(404).json({ message: 'Chat not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new chat or update existing chat with a message
// @route   POST /api/chat
// @access  Private
const saveMessage = async (req, res) => {
  const { chatId, sender, text } = req.body;

  try {
    let chat;
    if (chatId) {
      // Update existing chat
      chat = await Chat.findOne({ _id: chatId, user: req.user._id });
      if (chat) {
        chat.messages.push({ sender, text });
        await chat.save();
        res.status(200).json(chat);
      } else {
        res.status(404).json({ message: 'Chat not found or not authorized' });
      }
    } else {
      // Create new chat
      chat = await Chat.create({
        user: req.user._id,
        messages: [{ sender, text }],
        title: text.substring(0, 30) + '...' // Use first part of message as title
      });
      res.status(201).json(chat);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a chat
// @route   DELETE /api/chat/:id
// @access  Private
const deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (chat) {
      res.json({ message: 'Chat removed' });
    } else {
      res.status(404).json({ message: 'Chat not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getChats,
  getChatById,
  saveMessage,
  deleteChat,
};