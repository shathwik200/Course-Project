import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import Groq from 'groq-sdk';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

app.post('/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: userMessage }],
            model: "llama-3.3-70b-versatile",
            temperature: 1,
            max_tokens: 1024,
            top_p: 1
        });

        res.json({ response: chatCompletion.choices[0]?.message?.content || '' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
