const messagesContainer = document.getElementById('messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Meebo introduces himself immediately
window.addEventListener('DOMContentLoaded', () => {
    appendMessage("Hi! I'm Meebo. I've switched my connection over to a secure search-engine route. Firewalls shouldn't be able to stop me now! Try talking to me.", 'ai');
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
        // We use a free, generic endpoint format that mimics search engine queries
        const response = await fetch(`https://scraptodo.com{encodeURIComponent("Your name is Meebo. Answer briefly: " + text)}`);

        if (!response.ok) {
            throw new Error("Blocked");
        }

        const data = await response.json();
        // Extracting the text response safely from the clean JSON payload
        const aiResponse = data.reply || data.response || data.text;
        
        loadingMessage.textContent = aiResponse;
    } catch (error) {
        // Fallback backup route using basic text processing if the main mirror glitches
        try {
            const fallback = await fetch(`https://allorigins.win{encodeURIComponent(`https://pollinations.ai{text}`)}`);
            const fallbackData = await fallback.json();
            loadingMessage.textContent = fallbackData.contents;
        } catch(e) {
            loadingMessage.textContent = "Meebo is still blocked here. Try testing me on your phone's cellular hotspot connection!";
        }
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
