// server.js
const Message = require('./models/message');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const routes = require('./routes');

const app = express();
app.enable('trust proxy');
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.options('*', cors());

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => console.log('DB connection successful'));

app.use(express.static('public', { extensions: ['html', 'htm', 'css', 'js'] }));

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use(
  express.json({
    limit: '10kb',
  }),
);
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.use('/', (req, res) => {
  res.send('Welcome to the chatbot api.');
});

// Define routes
app.use('/api', routes);

io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle incoming messages from the client
  socket.on('send-message', async (data) => {
    const userMessage = new Message({ content: data.message });

    // Save the user's message to MongoDB (optional)
    await userMessage.save();

    // Emit the user's message to all connected clients
    io.emit('receive-message', { message: `user: ${data.message}` });

    // Handle the message, generate a response using OpenAI
    try {
      fetch('https://chatbot-henna-sigma.vercel.app/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: data.message }),
      })
        .then((response) => response.json())
        .then((data) => {
          // Handle the response as needed
          io.emit('receive-message', {
            message: `Chatbot: ${data.chatbotMessage.content}`,
          });
        })
        .catch((error) => {
          console.error('Error sending message:', error);
        });
    } catch (error) {
      console.error('Error generating response from OpenAI:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
