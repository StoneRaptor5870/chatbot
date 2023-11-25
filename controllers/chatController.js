// controllers/chatController.js
const Message = require('../models/message');
const OpenAI = require('openai');

// Initialize OpenAI API (replace with your API key)
const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

exports.getChatHistory = async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 'desc' });
    res.json({ success: true, messages });
  } catch (error) {
    console.error('Error retrieving chat history:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const userInput = req.body.message;
    //const { message } = req.body;

    // Send user input to OpenAI API
    const completion = await openaiClient.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: userInput },
      ],
      model: 'gpt-3.5-turbo',
      // response_format: { type: 'json_object' },
    });
    // Extract the chatbot's response
    const chatbotResponse = completion.choices[0].message.content;

    // Save the user and chatbot messages in MongoDB
    const userMessage = new Message({ content: userInput, senderType: 'user' });
    const chatbotMessage = new Message({
      content: chatbotResponse,
      senderType: 'chatbot',
    });

    await Promise.all([userMessage.save(), chatbotMessage.save()]);

    res.json({ success: true, userMessage, chatbotMessage });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};
