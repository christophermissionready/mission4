import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env') });

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL_NAME });


/**
 * Process an insurance consultation interaction and return the next question
 * @param {Array} history - Array of previous interactions
 * @returns {Promise<string>} The AI's next question
 */
async function processInsuranceInteraction(history = []) {
    try {
        // Format history for the AI model
        const formattedHistory = history.map(msg => ({
            role: msg.role === "assistant" ? "model" : msg.role,
            parts: Array.isArray(msg.parts) ? msg.parts : [{ text: msg.parts }]
        }));

        // Create chat with context
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: `You are an insurance advisor helping a customer find the best car insurance policy. Have a natural conversation to gather information about:
                    1. The car's make
                    2. Cars model
                    3. Cars year
                    4. Desired coverage type (for own or just 3rd party)
                    
                    The 3 insurance products are: Mechanical Breakdown Insurance (MBI), Comprehensive Car Insurance, Third Party Car Insurance.
                    Ask one question at a time. Be friendly and conversational. 
                    Never break immersion, assume all features outside the chat are operational.
                    Once all the information is gathered, tell the user to press the "Get Recommendations" button at the bottom of the chat window` }]
                },
                {
                    role: "model",
                    parts: [{ text: "I understand. I will act as a friendly insurance advisor and have a natural conversation to gather the necessary information." }]
                },
                ...formattedHistory
            ]
        });

        // Send the message and get the response
        const result = await chat.sendMessageStream(
            formattedHistory[formattedHistory.length - 1].parts[0].text
        );

        // Capture AI's follow-up question
        let aiResponse = "";
        for await (const chunk of result.stream) {
            aiResponse += chunk.text();
        }

        return aiResponse;
    } catch (error) {
        console.error('Error in processInsuranceInteraction:', error);
        throw error;
    }
}

async function analyzeInsuranceNeeds(history = []) {
    try {
        // Format history for the AI model
        const formattedHistory = history.map(msg => ({
            role: msg.role === "assistant" ? "model" : msg.role,
            parts: Array.isArray(msg.parts) ? msg.parts : [{ text: msg.parts }]
        }));

        // Create chat with context
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: `You are an expert insurance advisor analyzing a customer's insurance needs based on their conversation. 
                    Based on the conversation history.
                    The 3 insurance products are: Mechanical Breakdown Insurance (MBI), Comprehensive Car Insurance, Third Party Car Insurance.
                    MBI is not available to trucks and racing cars.  And Comprehensive Car Insurance is only available to any motor vehicles less than 10 years old.
                    Recommend one of these 3 products based on the conversation history.
                    Be specific and explain your recommendations clearly.
                    Do not go over 300 words
                    Speak as if you are speaking directly to the customer` }]
                },
                {
                    role: "model",
                    parts: [{ text: "I understand. I will analyze the conversation and provide detailed insurance policy recommendations." }]
                },
                ...formattedHistory
            ]
        });

        // Send analysis request
        const result = await chat.sendMessageStream(
            "Please analyze the customer's needs and provide detailed insurance policy recommendations."
        );

        // Capture AI's analysis
        let aiResponse = "";
        for await (const chunk of result.stream) {
            aiResponse += chunk.text();
        }

        return aiResponse;
    } catch (error) {
        console.error('Error in analyzeInsuranceNeeds:', error);
        throw error;
    }
}

export {  processInsuranceInteraction, analyzeInsuranceNeeds };