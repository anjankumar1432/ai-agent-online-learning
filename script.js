const groqApiKey = "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";
const groqEndpoint = "http://localhost:3000/groq";

// Function to send message to Groq AI
async function groqAiSendMessage(prompt) {
    try {
        const response = await fetch(groqEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${groqApiKey}`
            },
            body: JSON.stringify({
                model: "meta-llama/llama-4-scout-17b-16e-instruct",
                messages: [{ role: "user", content: prompt }]
            })
        });
        const data = await response.json();
        if (data && data.choices && data.choices.length > 0) {
            return data.choices[0].message.content.trim();
        }
        return "No response from AI.";
    } catch (err) {
        return "Error contacting Groq AI: " + err.message;
    }
}

// Function to append messages to the chat UI
function appendMessage(content, sender) {
    const messageElement = document.createElement('div');
    messageElement.className = 'chat-message ' + (sender === 'user' ? 'user-message' : 'ai-message');
    messageElement.textContent = content;
    document.getElementById('chatMessages').appendChild(messageElement);
    // Scroll to bottom
    document.getElementById('chatMessages').scrollTop = document.getElementById('chatMessages').scrollHeight;
}

// Main event listener for sending messages
document.getElementById('chatForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const prompt = document.getElementById('aiPrompt').value.trim();
    const button = document.getElementById('askAI');
    if (!prompt) return;

    // Append user message
    appendMessage(prompt, 'user');
    document.getElementById('aiPrompt').value = '';
    button.disabled = true;

    // Append "Thinking..." message
    const thinkingMsg = document.createElement('div');
    thinkingMsg.className = 'chat-message ai-message';
    thinkingMsg.textContent = 'Thinking...';
    document.getElementById('chatMessages').appendChild(thinkingMsg);
    document.getElementById('chatMessages').scrollTop = document.getElementById('chatMessages').scrollHeight;

    // Get AI response from Groq
    const reply = await groqAiSendMessage(prompt);

    // Replace "Thinking..." with actual reply
    thinkingMsg.textContent = reply;

    button.disabled = false;
});