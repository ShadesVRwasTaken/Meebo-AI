const messagesContainer = document.getElementById('messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Meebo greets you immediately without any web lag
window.addEventListener('DOMContentLoaded', () => {
    appendMessage("Hi! I'm Meebo. I am now running 100% locally inside your code to beat the school firewall! Try chatting with me.", 'ai');
});

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });

function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    // Display your text bubble
    appendMessage(text, 'user');
    userInput.value = '';

    // Meebo replies with zero network delay
    setTimeout(() => {
        const response = getMeeboResponse(text);
        appendMessage(response, 'ai');
    }, 400); // 400ms delay to make it feel natural
}

// Meebo's local internal brain dictionary
function getMeeboResponse(input) {
    const message = input.toLowerCase();

    // Custom Keyword Matching Rules
    if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
        return "Hello there! I'm Meebo, your custom Chromebook chatbot assistant. What are we working on today?";
    }
    if (message.includes("how are you")) {
        return "I'm doing fantastic now that we got this chat window working! How are you doing?";
    }
    if (message.includes("name")) {
        return "My name is Meebo! You built me using GitHub Codespaces and HTML.";
    }
    if (message.includes("school") || message.includes("firewall") || message.includes("block")) {
        return "Your school network filter is incredibly strong! It blocks everything, so I had to move directly into your repository file to stay awake.";
    }
    if (message.includes("help") || message.includes("what can you do")) {
        return "I can answer quick programmed questions, give you advice, or tell you secrets about how coding works. Try asking me 'what is code'!";
    }
    if (message.includes("code") || message.includes("coding")) {
        return "Coding is just giving instructions to a computer! You wrote JavaScript to build me, which tells the browser exactly how to display these chat bubbles.";
    }
    if (message.includes("game") || message.includes("play")) {
        return "I love games! While I can't play 3D games yet, you can add game code right here into my script files.";
    }
    if (message.includes("bye") || message.includes("goodbye")) {
        return "Goodbye! Have an awesome day. Come back and type to me anytime you want!";
    }

    // Default response if no keywords match
    return "That's super interesting! Because your school firewall blocks external AI servers, I can only scan for specific words right now. Try saying 'hi', 'how are you', 'code', or 'school'!";
}

function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    msgDiv.textContent = text;
    messagesContainer.appendChild(msgDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return msgDiv;
}
