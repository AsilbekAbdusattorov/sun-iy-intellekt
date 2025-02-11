const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors());

// Config qiymatlari
const PORT = 5000;
const OPENAI_API_KEY = "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"; // API kaliti bevosita kodda

// AI yordamida matn yaratish
app.post("/generate", async (req, res) => {
    const { name, question } = req.body;

    if (!name || !question) {
        return res.status(400).json({ error: "Имя и вопрос обязательны!" });
    }

    try {
        const response = await axios.post("https://api.openai.com/v1/chat/completions", {
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: question }],
            max_tokens: 500
        }, {
            headers: {
                "Authorization": `Bearer ${OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            }
        });

        const generatedText = response.data.choices[0].message.content.trim();
        res.json({ text: generatedText });
    } catch (error) {
        console.error("Ошибка при подключении к AI:", error.response?.data || error.message);
        res.status(500).json({
            error: `Ошибка при подключении к AI: ${error.response?.data?.error?.message || error.message}`
        });
    }
});

// Serverni ishga tushurish
app.listen(PORT, () => {
    console.log(`✅ Сервер работает на порту ${PORT}...`);
});
