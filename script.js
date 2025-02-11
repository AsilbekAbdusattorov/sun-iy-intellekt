window.onload = function() {
    const generateButton = document.getElementById("generate");

    if (generateButton) {
        generateButton.addEventListener("click", async function() {
            const name = "Admin"; // Имя администратора, здесь просто задано
            const questionElement = document.getElementById("question"); // Получаем элемент input
            const question = questionElement ? questionElement.value.trim() : ""; // Получаем вопрос

            if (!question) {
                alert("Пожалуйста, введите вопрос!");
                return;
            }

            document.getElementById("generated-content").innerHTML = "Создание текста...";

            try {
                const response = await fetch("http://localhost:5000/generate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, question })
                });

                if (!response.ok) {
                    const errorMessage = `Ошибка: ${response.statusText}`;
                    document.getElementById("generated-content").innerHTML = errorMessage;
                    throw new Error(errorMessage);
                }

                const data = await response.json();
                document.getElementById("generated-content").innerHTML = `<p>${data.text}</p>`;
            } catch (error) {
                document.getElementById("generated-content").innerHTML = "Произошла ошибка, пожалуйста, попробуйте снова!";
                console.error(error);
            }
        });
    } else {
        console.error("Кнопка 'Создать' не найдена.");
    }
};
