const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: "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" });

async function chatWithGroq(prompt) {
    const chatCompletion = await getGroqChatCompletion(prompt);
    return chatCompletion;
}
async function getGroqChatCompletion(prompt) {
    return groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: prompt,
            },
        ],
        model: "llama3-groq-70b-8192-tool-use-preview",
    });
}

module.exports = {
    chatWithGroq
}

