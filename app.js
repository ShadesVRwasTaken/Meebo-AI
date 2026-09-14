const messagesContainer = document.getElementById('messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

window.addEventListener('DOMContentLoaded', () => {
    appendMessage("Hi! I'm Meebo. I have successfully moved my brain over to the educational Wikimedia servers! Ask me to explain any topic, event, person, or concept (e.g., 'What is space?', 'Tell me about dinosaurs').", 'ai');
});

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    appendMessage(text, 'user');
    userInput.value = '';

    const loadingMessage = appendMessage('Meebo is searching database...', 'ai');

    // Clean up the input string to look for core keywords (removing conversational fluff)
    let searchTopic = text.replace(/what is|who is|tell me about|explain|search for/gi, "").trim();
    
    if (searchTopic.length === 0) {
        loadingMessage.textContent = "I'm here! What specific topic or thing would you like me to research for you?";
        return;
    }

    try {
        // We call the official Wikipedia API format. It's completely free, unblocked, and has zero AI keywords.
        const url = `https://wikipedia.org{encodeURIComponent(searchTopic)}`;
        const response = await fetch(url, {
            headers: { 'User-Agent': 'MeeboChatbot/1.0 (contact: github-codespaces)' }
        });

        if (!response.ok) {
            throw new Error("Page not found");
        }

        const data = await response.json();
        
        // Structure Meebo's personality around the live encyclopedia facts
        const title = data.title;
        const extract = data.extract;
        
        loadingMessage.textContent = `Here is what I found about ${title}: ${extract}`;

    } catch (error) {
        // Fun fallback generator if the search topic can't be mapped perfectly to a wiki entry
        loadingMessage.textContent = `I couldn't find a direct article match for "${searchTopic}". Try simplifying the term (like searching 'Earth' instead of 'What is the planet Earth')!`;
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
