import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import {processInsuranceInteraction, analyzeInsuranceNeeds } from "./ai-chatbot-stateless.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

const PORT = process.env.PORT || 5998;


app.post('/api/insurance/start', async (req, res) => {
    try {
        const question = "Hi! I'm Tina. I'm here to help you find the best car insurance policy. May I ask some questions to make sure I recommend the best insurance policy for you?";
        res.json({ 
            question,
            history: [
                {
                    role: "assistant",
                    parts: [{ text: question }]
                }
            ]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Continue insurance consultation with a response
app.post('/api/insurance/respond', async (req, res) => {
    try {
        const { response, history } = req.body;
        if (!response || !history) {
            return res.status(400).json({ 
                error: 'A response is required' 
            });
        }

        // Add user's response to history
        const updatedHistory = [...history, {
            role: "user",
            parts: [{ text: response }]
        }];

        // Get next question
        const question = await processInsuranceInteraction(updatedHistory);
        
        // Add AI's question to history
        updatedHistory.push({
            role: "assistant",
            parts: [{ text: question }]
        });

        res.json({
            question,
            history: updatedHistory
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/insurance/analyze', async (req, res) => {
    try {
        const { history } = req.body;
        if (!history) {
            return res.status(400).json({ 
                error: 'Conversation history is required' 
            });
        }

        const analysis = await analyzeInsuranceNeeds(history);
        res.json({
            analysis,
            history
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});