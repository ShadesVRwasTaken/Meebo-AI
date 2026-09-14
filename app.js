const messagesContainer = document.getElementById('messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Meebo introduces himself immediately
window.addEventListener('DOMContentLoaded', () => {
    appendMessage("Hi there! I'm Meebo. I've updated my data tunnel to route around your network blocks! Go ahead and test me.", 'ai');
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
        // Switching to an alternate unblocked text API mirror endpoint
        const response = await fetch(`https://codetabs.com{encodeURIComponent(text)}`);

        if (!response.ok) {
            throw new Error("Network proxy failed");
        }

        const aiResponse = await response.text();
        loadingMessage.textContent = aiResponse;
    } catch (error) {
        // Fallback option using an open public text-generator mirror 
        try {
            loadingMessage.textContent = "Meebo is attempting fallback route...";
            const fallbackResponse = await fetch(`https://allorigins.win{encodeURIComponent(`https://pollinations.ai{text}`)}`);
            const data = await fallbackResponse.json();
            loadingMessage.textContent = data.contents;
        } catch (fallbackError) {
            loadingMessage.textContent = "System Block: Both the primary and fallback data lines are blocked by this firewall.";
            console.error(fallbackError);
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
