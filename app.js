const messagesContainer = document.getElementById('messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

window.addEventListener('DOMContentLoaded', () => {
    appendMessage("Hi there! I'm Meebo. My smart connection is fully updated through an invisible tunnel. Test me out with any complex question!", 'ai');
});

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    appendMessage(text, 'user');
    userInput.value = '';

    const loadingMessage = appendMessage('Meebo is thinking...', 'ai');

    try {
        // Build a proper prompt context telling the AI how to act
        const explicitPrompt = `You are a real, highly intelligent AI named Meebo. You are cheerful, helpful, and friendly. Give a complete, conversational answer to this request: ${text}`;
        
        // This targets an encrypted proxy wrapper to sneak past the school firewall completely
        const networkTargetUrl = `https://pollinations.ai{encodeURIComponent(explicitPrompt)}?model=openai`;
        const proxyGatewayUrl = `https://allorigins.win{encodeURIComponent(networkTargetUrl)}`;

        const response = await fetch(proxyGatewayUrl);
        if (!response.ok) throw new Error("Tunnel failed");

        const wrapperData = await response.json();
        
        // The real AI response text resides safely inside the wrapped 'contents' string attribute
        const realAiText = wrapperData.contents;

        if (!realAiText || realAiText.trim() === "") {
            loadingMessage.textContent = "Meebo received an empty packet. Please try again.";
        } else {
            loadingMessage.textContent = realAiText;
        }

    } catch (error) {
        loadingMessage.textContent = "Meebo's cloud pipeline was blocked. Try using a mobile hotspot!";
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
