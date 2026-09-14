// Import WebLLM library dynamically from a Content Delivery Network (CDN)
import * as webllm from "https://esm.run";

const messagesContainer = document.getElementById('messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const statusText = document.getElementById('status-text');
const progressContainer = document.getElementById('progress-container');
const progressBar = document.getElementById('progress-bar');

// A 300MB AI model that runs incredibly well on lower-RAM devices like Chromebooks
const selectedModel = "Qwen2.5-0.5B-Instruct-q4f16_1-MLC";
let engine;

// Display a greeting explaining the loading process
appendMessage("Hi! I'm Meebo. I process your text directly on your Chromebook. Give me a moment to download my local brain files!", 'ai');

// Initializes the AI engine and handles the file download bar
async function initializeAI() {
    try {
        progressContainer.style.display = "block";
        
        // Boot up WebLLM and hook into the setup status reporting
        engine = await webllm.CreateMLCEngine(selectedModel, {
            initProgressCallback: (report) => {
                statusText.textContent = report.text;
                
                // Extract the numerical percentage string from WebLLM's text progress reports
                if (report.text.includes("%")) {
                    const match = report.text.match(/(\d+)%/);
                    if (match) progressBar.style.width = match[1] + "%";
                }
            }
        });

        // Hide progress UI and unlock chat controls once ready
        statusText.textContent = "Meebo is ready & 100% local!";
        progressContainer.style.display = "none";
        userInput.disabled = false;
        sendBtn.disabled = false;
        userInput.placeholder = "Say something to Meebo...";
    } catch (error) {
        statusText.textContent = "Error: WebGPU pipeline failed. Check chrome://flags.";
        console.error(error);
    }
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });

// Handles taking user input, sending it to the local model, and streaming the output
async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    // Put user message on screen and clear the entry box
    appendMessage(text, 'user');
    userInput.value = '';
    
    // Lock inputs to prevent accidental double-submits while Meebo works
    userInput.disabled = true;
    sendBtn.disabled = true;

    // Create the text shell that Meebo will fill in live
    const loadingMessage = appendMessage('Meebo is typing...', 'ai');

    try {
        // Construct the strict context framing for the model
        const messages = [
            { role: "system", content: "Your name is Meebo. You are a helpful, brief, and friendly local AI assistant." },
            { role: "user", content: text }
        ];

        // Trigger the asynchronous text generator stream
        const chunks = await engine.chat.completions.create({
            messages: messages,
            stream: true
        });

        let fullReply = "";
        
        // Capture each new word chunk as it processes and update the interface instantly
        for await (const chunk of chunks) {
            const content = chunk.choices?.delta?.content || "";
            fullReply += content;
            loadingMessage.textContent = fullReply; 
        }

    } catch (error) {
        loadingMessage.textContent = "Oops! Something glitched inside my local hardware pipeline.";
        console.error(error);
    } finally {
        // Re-enable input focus for the next query
        userInput.disabled = false;
        sendBtn.disabled = false;
        userInput.focus();
    }
}

// Utility function to inject message blocks nicely into the UI window
function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    msgDiv.textContent = text;
    messagesContainer.appendChild(msgDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight; // Auto-scroll to latest text
    return msgDiv;
}

// Start the loading chain immediately upon file load
initializeAI();
