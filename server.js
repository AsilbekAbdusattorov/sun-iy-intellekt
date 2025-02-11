require('dotenv').config(); // .env faylini yuklash

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors());

// Config qiymatlari
const PORT = 5000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // OpenAI API kaliti

// AI yordamida matn yaratish
app.post("/generate", async (req, res) => {
    const { name, question } = req.body;

    // Ism va savol mavjudligini tekshirish
    if (!name || !question) {
        return res.status(400).json({ error: "Имя и вопрос обязательны!" });
    }

    try {
        // OpenAI API'ga so'rov yuborish
        const response = await axios.post("https://api.openai.com/v1/chat/completions", {
            model: "gpt-3.5-turbo", // Modelni tanlash
            messages: [{ role: "user", content: question }], // Foydalanuvchi so'rovini yuborish
            max_tokens: 500
        }, {
            headers: {
                "Authorization": `Bearer ${OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            }
        });

        const generatedText = response.data.choices[0].message.content.trim();

        // Javobni qaytarish
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
