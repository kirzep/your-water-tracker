document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const errorMessage = document.getElementById("error-message");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorMessage.textContent = "";

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token); // сохранить токен
        window.location.href = "/views/main.html"; // перенаправление на главный экран
      } else if (response.status === 401) {
        errorMessage.textContent = "Неверный email или пароль.";
      } else {
        errorMessage.textContent = "Ошибка входа. Повторите позже.";
      }
    } catch (error) {
      errorMessage.textContent = "Сервер недоступен.";
      console.error("Ошибка входа:", error);
    }
  });
});