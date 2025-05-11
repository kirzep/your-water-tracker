document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // предотвращаем перезагрузку страницы

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const weight = parseFloat(document.getElementById('weight').value);

    // Проверка на корректность введенных данных
    if (!username || !email || !password || !weight) {
      alert("Все поля должны быть заполнены.");
      return;
    }

    try {
      // Отправка данных на сервер
      const res = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, weight }),
      });

      const data = await res.json();

      // Обработка успешного ответа
      if (res.ok) {
        // Сохраняем полученный токен в localStorage
        localStorage.setItem('token', data.token);
        
        // Перенаправляем на главный экран
        window.location.href = 'main.html'; // Перенаправление на главную страницу
      } else {
        // Если ошибка, выводим сообщение
        alert(data.message || "Ошибка регистрации");
      }
    } catch (error) {
      console.error("Ошибка при отправке данных:", error);
      alert("Произошла ошибка при подключении к серверу.");
    }
  });
});