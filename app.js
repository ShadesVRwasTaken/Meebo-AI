import * as webllm from "https://esm.run/@mlc-ai/web-llm";

const messagesContainer = document.getElementById('messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const statusText = document.getElementById('status-text');
const progressContainer = document.getElementById('progress-container');
const progressBar = document.getElementById('progress-bar');

const selectedModel = "Qwen2.5-0.5B-Instruct-q4f16_1-MLC";
let engine;

appendMessage("Hi! I'm Meebo. I process your text directly on your Chromebook. Give me a moment to download my local brain files!", 'ai');

async function initializeAI() {
    try {
        progressContainer.style.display = "block";
        
        // Boot up WebLLM
        engine = await webllm.CreateMLCEngine(selectedModel, {
            initProgressCallback: (report) => {
                // Show the raw text status directly so you can see exactly what WebLLM is doing
                statusText.textContent = report.text;
                
                // Simplified progress bar math that won't freeze up
                if (report.progress && report.progress > 0) {
                    progressBar.style.width = (report.progress * 100) + "%";
                } else if (report.text.includes("%")) {
                    progressBar.style.width = "50%"; // Visual fallback indicator
                }
            }
        });

        statusText.textContent = "Meebo is ready & 100% local!";
        progressContainer.style.display = "none";
        userInput.disabled = false;
        sendBtn.disabled = false;
        userInput.placeholder = "Say something to Meebo...";
    } catch (error) {
        // Fallback text explaining exactly why it crashed
        statusText.textContent = "Hardware Error: WebGPU is blocked or unsupported.";
        appendMessage("System Alert: I can't wake up because this Chromebook's browser doesn't have WebGPU enabled. Please see instructions below!", 'ai');
        console.error(error);
    }
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    appendMessage(text, 'user');
    userInput.value = '';
    
    userInput.disabled = true;
    sendBtn.disabled = true;

    const loadingMessage = appendMessage('Meebo is typing...', 'ai');

    try {
        const messages = [
            { role: "system", content: "Your name is Meebo. You are a helpful, brief, and friendly local AI assistant." },
            { role: "user", content: text }
        ];

        const chunks = await engine.chat.completions.create({
            messages: messages,
            stream: true
        });

        let fullReply = "";
        for await (const chunk of chunks) {
            const content = chunk.choices?.delta?.content || "";
            fullReply += content;
            loadingMessage.textContent = fullReply; 
        }

    } catch (error) {
        loadingMessage.textContent = "Oops! Something glitched inside my local hardware pipeline.";
        console.error(error);
    } finally {
        userInput.disabled = false;
        sendBtn.disabled = false;
        userInput.focus();
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

initializeAI();
