require("dotenv").config(); // .env faylni yuklash

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());

// CORS ruxsatini kerakli domenlarga berish (ishlab chiqishda, undan keyin butun dunyoga ruxsat berish mumkin)
const allowedOrigins = ["https://your-allowed-domain.com"]; // Kerakli domenni qo'shing
app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    }
}));

// Config qiymatlari
const PORT = process.env.PORT || 5000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // API kalitni .env fayldan olish

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
