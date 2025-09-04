// Simple, reliable chat function
async function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    const message = chatInput.value.trim();
    
    if (!message) return;

    // Add user message
    const userMessageEl = document.createElement('div');
    userMessageEl.classList.add('message', 'user');
    userMessageEl.textContent = message;
    chatMessages.appendChild(userMessageEl);
    
    chatInput.value = '';
    
    // Show "Thinking..." message
    const thinkingEl = document.createElement('div');
    thinkingEl.classList.add('message', 'bot');
    thinkingEl.textContent = 'Thinking...';
    chatMessages.appendChild(thinkingEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        // Call your Netlify function
        const response = await fetch('/.netlify/functions/chatbot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userMessage: message })
        });

        const data = await response.json();
        
        // Remove "Thinking..." message
        chatMessages.removeChild(thinkingEl);

        // Add AI response
        const aiMessageEl = document.createElement('div');
        aiMessageEl.classList.add('message', 'bot');
        aiMessageEl.textContent = data.aiResponse || "Sorry, I couldn't get a response.";
        chatMessages.appendChild(aiMessageEl);
        chatMessages.scrollTop = chatMessages.scrollHeight;

    } catch (error) {
        // Remove "Thinking..." message
        chatMessages.removeChild(thinkingEl);
        
        const errorEl = document.createElement('div');
        errorEl.classList.add('message', 'bot');
        errorEl.textContent = 'Network error. Please try again.';
        chatMessages.appendChild(errorEl);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// Make sure Enter key works
document.addEventListener('DOMContentLoaded', function() {
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }
});
