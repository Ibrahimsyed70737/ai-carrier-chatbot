// server/routes/chat.js
const express = require('express');
const { getChats, getChatById, saveMessage, deleteChat } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(protect, getChats); // Get all chats for logged-in user
router.route('/:id').get(protect, getChatById).delete(protect, deleteChat);
router.route('/message').post(protect, saveMessage); // Save a message (new chat or existing)

module.exports = router;