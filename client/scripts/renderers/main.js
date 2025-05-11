window.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Токен не найден. Пожалуйста, выполните вход.');
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/users/profile', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Ошибка при получении профиля');
    }

    const data = await response.json();

    document.getElementById('username').textContent = data.username;
    document.getElementById('email').textContent = data.email;
    document.getElementById('weight').textContent = data.weight;
    document.getElementById('dailyWaterGoal').textContent = data.daily_water_goal;
  } catch (error) {
    console.error(error);
    alert('Не удалось загрузить профиль');
  }

  // Обработчик для кнопки "Добавить воду"
  document.getElementById('addWaterBtn').addEventListener('click', async () => {
    const waterAmount = parseInt(document.getElementById('waterAmount').value);

    if (isNaN(waterAmount) || waterAmount <= 0) {
      alert('Пожалуйста, введите корректное количество воды.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/water/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ amount: waterAmount })
      });

      if (!response.ok) {
        throw new Error('Ошибка при добавлении воды');
      }

      const data = await response.json();

      // Обновляем прогресс
      const progressText = document.getElementById('progressText');
      progressText.textContent = `Добавлено ${waterAmount} мл. Осталось: ${data.remaining_water_goal} мл.`;

      // Очистить поле ввода
      document.getElementById('waterAmount').value = '';

    } catch (error) {
      console.error(error);
      alert('Не удалось добавить воду');
    }
  });
});