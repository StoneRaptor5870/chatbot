// models/message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: String,
  senderType: String,
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
