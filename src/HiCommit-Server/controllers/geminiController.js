const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function geminiChat(prompt) {
    let model = genAI.getGenerativeModel({
        // Using `responseMimeType` requires either a Gemini 1.5 Pro or 1.5 Flash model
        model: "gemini-1.5-flash",
        // Set the `responseMimeType` to output JSON
        generationConfig: { responseMimeType: "application/json" }
    });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    return text;
}

module.exports = {
    geminiChat
}