// ai-chat.js
// This file contains the improved chat function that calls your real AI

async function sendMessage() {
    const chatInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');
    const message = chatInput.value.trim();
    
    if (!message) return;

    addMessage(message, 'user');
    chatInput.value = '';
    
    addMessage("Thinking...", 'bot');

    try {
        const response = await fetch('/.netlify/functions/chatbot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userMessage: message })
        });

        const data = await response.json();
        chatMessages.removeChild(chatMessages.lastChild);

        if (data.aiResponse) {
            addMessage(data.aiResponse, 'bot');
        } else {
            addMessage("Sorry, I couldn't get a response right now.", 'bot');
        }

    } catch (error) {
        console.error('Error:', error);
        if (chatMessages.lastChild.textContent === 'Thinking...') {
            chatMessages.removeChild(chatMessages.lastChild);
        }
        addMessage("Network error. Please try again.", 'bot');
    }
}

function addMessage(text, sender) {
    const chatMessages = document.getElementById('chat-messages');
    const messageEl = document.createElement('div');
    messageEl.classList.add('message', sender);
    messageEl.textContent = text;
    chatMessages.appendChild(messageEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

document.addEventListener('DOMContentLoaded', function() {
    const chatInput = document.getElementById('user-input');
    const sendButton = document.querySelector('button.primary');
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }
    
    // Add click event listener to the send button
    if (sendButton) {
        sendButton.addEventListener('click', sendMessage); // <-- Connect the button
    }
});
