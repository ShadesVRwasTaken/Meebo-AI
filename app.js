const messagesContainer = document.getElementById('messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Meebo warmly greets the user instantly on load
window.addEventListener('DOMContentLoaded', () => {
    appendMessage("Hello! I am Meebo. I am awake, fully free, and ready to go! How can I help you?", 'ai');
});

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    appendMessage(text, 'user');
    userInput.value = '';

    const loadingMessage = appendMessage('Meebo is typing...', 'ai');

    try {
        // Construct clear identity guidelines inside the context envelope
        const identityPrompt = `Your name is Meebo. You are a cheerful, friendly, and helpful AI companion. Respond to this: ${text}`;
        
        // Puter API executes the text completion smoothly over standard network endpoints
        const response = await puter.ai.chat(identityPrompt);
        
        loadingMessage.textContent = response;
    } catch (error) {
        loadingMessage.textContent = "Meebo had trouble responding. Please check your internet connection.";
        console.error(error);
    }
}

function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    msgDiv.textContent = text;
    messagesContainer.appendChild(msgDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return msgDiv;
}
