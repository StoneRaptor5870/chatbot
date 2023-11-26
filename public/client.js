// public/client.js
const socket = io('ws://chatbot-henna-sigma.vercel.app/');

// DOM elements
const chatContainer = document.getElementById('chat-container');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const historyButton = document.getElementById('history-button');

// Function to send a message
function sendMessage() {
  socket.emit('send-message', { message: messageInput.value });

  // Clear the input field
  messageInput.value = '';
}

// Handle incoming messages
socket.on('receive-message', (data) => {
  const chatMessage = document.createElement('div');
  chatMessage.className = 'chat-message';
  chatMessage.textContent = `${data.message}`;

  // Append the message to the chat container
  chatContainer.appendChild(chatMessage);

  // Optionally, scroll to the bottom of the chat container
  chatContainer.scrollTop = chatContainer.scrollHeight;
});

function getHistory() {
  try {
    fetch('https://chatbot-henna-sigma.vercel.app/api/chat/history', {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response as needed
        appendMessage(data);
      });
  } catch (error) {
    console.error('Error getting response from Server:', error);
  }
}

// Attach event listeners
sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    sendMessage();
  }
});

historyButton.addEventListener('click', getHistory);

function appendMessage(data) {
  const messages = data.messages;
  const userMsg = messages.filter((message) => message.senderType === 'user');
  const botMsg = messages.filter((message) => message.senderType === 'chatbot');

  // Loop through each message in the array
  for (let i = 0; i < userMsg.length; i++) {
    const historyMessage = document.createElement('div');
    const historyMessage2 = document.createElement('div');
    historyMessage.className = 'chat-message';
    historyMessage.textContent = `${userMsg[i].content}`;

    // Append the message to the chat container
    chatContainer.appendChild(historyMessage);
    historyMessage2.textContent = `${botMsg[i].content}`;
    historyMessage2.className = 'chat-message';
    chatContainer.appendChild(historyMessage2);
  }
  // Optionally, scroll to the bottom of the chat container
  chatContainer.scrollTop = chatContainer.scrollHeight;
}
