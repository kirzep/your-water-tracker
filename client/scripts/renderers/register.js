// Обработчик отправки формы
document.getElementById('registerForm').addEventListener('submit', async function(event) {
  event.preventDefault();  // Предотвращаем стандартное поведение формы

  // Собираем данные из формы
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const weight = document.getElementById('weight').value;

  const userData = {
      username: username,
      email: email,
      password: password,
      weight: parseInt(weight),
  };

  try {
      // Отправляем POST-запрос на сервер
      const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
      });

      // Обрабатываем ответ
      if (response.ok) {
          const data = await response.json();
          // Сохраняем токен в localStorage или sessionStorage
          localStorage.setItem('token', data.token);
          // Перенаправляем на главную страницу
          window.location.href = '/';
      } else {
          const errorData = await response.json();
          // Показываем сообщение об ошибке
          document.getElementById('errorMessage').textContent = errorData.message || 'Ошибка при регистрации!';
          document.getElementById('errorMessage').style.display = 'block';
      }
  } catch (error) {
      // В случае ошибки при отправке запроса
      document.getElementById('errorMessage').textContent = 'Не удалось подключиться к серверу.';
      document.getElementById('errorMessage').style.display = 'block';
  }
});
