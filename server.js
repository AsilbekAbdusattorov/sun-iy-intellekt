const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { MongoClient } = require("mongodb");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 5000;
const OPENAI_API_KEY = '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';  // OpenAI API key
const MONGODB_URI = 'mongodb+srv://abdusattorovasilbek278:o5no2OD1MNTX9dxA@cluster0.scuct.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';  // MongoDB URI

// Проверка наличия API ключа
if (!OPENAI_API_KEY) {
    console.error("❌ OPENAI_API_KEY не найден!");
    process.exit(1);
}

if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI не найден!");
    process.exit(1);
}

// Подключение к MongoDB
let db;
MongoClient.connect(MONGODB_URI, { useUnifiedTopology: true })
    .then(client => {
        console.log("✅ Успешное подключение к базе данных MongoDB.");
        db = client.db(); // Получение базы данных по умолчанию
    })
    .catch(err => {
        console.error("❌ Ошибка подключения к базе данных MongoDB:", err);
        process.exit(1);
    });

// Генерация текста с помощью AI и сохранение в MongoDB
app.post("/generate", async (req, res) => {
    const { name, question } = req.body;

    // Проверка наличия имени и вопроса
    if (!name || !question) {
        return res.status(400).json({ error: "Имя и вопрос обязательны для ввода!" });
    }

    try {
        const response = await axios.post("https://api.openai.com/v1/chat/completions", {
            model: "gpt-3.5-turbo", // Использование новой модели
            messages: [{ role: "user", content: question }], // Вопрос пользователя
            max_tokens: 500
        }, {
            headers: {
                "Authorization": `Bearer ${OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            }
        });

        const generatedText = response.data.choices[0].message.content.trim();

        // Сохранение результата в базу данных MongoDB
        const collection = db.collection("users");
        await collection.insertOne({ name, question, response: generatedText });

        res.json({ text: generatedText });
    } catch (error) {
        console.error("❌ Ошибка при подключении к AI:", error.response?.data || error.message);
        res.status(500).json({
            error: `Ошибка при подключении к AI: ${error.response?.data?.error?.message || error.message}`
        });
    }
});

// Получение истории генераций
app.get("/history", async (req, res) => {
    try {
        const collection = db.collection("users");
        const result = await collection.find().sort({ _id: -1 }).toArray(); // Сортировка по убыванию ID (последние записи)
        res.json(result);
    } catch (error) {
        console.error("❌ Ошибка при получении данных:", error);
        res.status(500).json({ error: "Произошла ошибка при получении данных." });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Сервер работает на порту ${PORT}...`);
});
