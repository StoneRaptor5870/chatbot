// routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.get('/history', chatController.getChatHistory);
router.post('/send', chatController.sendMessage);

module.exports = router;
