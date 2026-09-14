const messagesContainer = document.getElementById('messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Meebo introduces himself immediately
window.addEventListener('DOMContentLoaded', () => {
    appendMessage("Hi there! I'm Meebo, your cloud companion. I'm bypassing your Chromebook restrictions completely! Ask me anything.", 'ai');
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
        // Send a native web fetch request to Pollinations public AI network
        const response = await fetch('https://pollinations.ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [
                    { role: "system", content: "Your name is Meebo. You are a cheerful, friendly, and helpful AI buddy." },
                    { role: "user", content: text }
                ],
                model: "openai" // Uses standard optimized LLM processing
            })
        });

        // The endpoint directly outputs plain text response structure
        const aiResponse = await response.text();
        
        loadingMessage.textContent = aiResponse;
    } catch (error) {
        loadingMessage.textContent = "Oops! Your school/work network blocks this data request path.";
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
