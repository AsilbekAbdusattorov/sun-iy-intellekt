document.getElementById("generate").addEventListener("click", async function() {
    const question = document.getElementById("question").value;
    const timer = parseInt(document.getElementById("timer").value, 10);
    const name = "Ваше имя"; // Админ имя

    if (!question.trim()) {
        alert("Пожалуйста, введите вопрос!");
        return;
    }

    document.getElementById("generated-content").innerHTML = "Генерация текста...";

    setTimeout(async () => {
        try {
            const response = await fetch("http://localhost:5000/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, question })
            });

            if (!response.ok) {
                const errorMessage = `Ошибка сервера: ${response.statusText}`;
                const errorData = await response.json();
                document.getElementById("generated-content").innerHTML = `<p>${errorMessage}</p><p>${errorData.error}</p>`;
                throw new Error(errorMessage);
            }

            const data = await response.json();
            document.getElementById("generated-content").innerHTML = `<p>${data.text}</p>`;
        } catch (error) {
            document.getElementById("generated-content").innerHTML = "Произошла ошибка! Попробуйте снова.";
            console.error(error);
        }
    }, timer * 1000);
});

document.getElementById("view-history").addEventListener("click", async function() {
    try {
        const response = await fetch("http://localhost:5000/history");

        if (!response.ok) {
            const errorData = await response.json();
            alert("Ошибка при просмотре истории: " + errorData.error);
            return;
        }

        const history = await response.json();
        const historyList = document.getElementById("history-list");
        historyList.innerHTML = ''; // очистить список

        history.forEach(item => {
            const li = document.createElement("li");
            li.textContent = `Имя: ${item.name}, Вопрос: ${item.question}, Ответ: ${item.response}`;
            historyList.appendChild(li);
        });

        document.getElementById("history").style.display = "block";
    } catch (error) {
        console.error(error);
        alert("Ошибка при получении истории.");
    }
});
