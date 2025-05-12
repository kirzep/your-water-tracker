class Water {
    constructor(data = {}) {
        this.id = data.id;
        this.userId = data.userId;
        this.amount = data.amount || 0;
        this.date = data.date || new Date();
        this.dailyGoal = data.dailyGoal || 0;
    }

    static fromJSON(json) {
        return new Water(json);
    }

    toJSON() {
        return {
            id: this.id,
            userId: this.userId,
            amount: this.amount,
            date: this.date,
            dailyGoal: this.dailyGoal
        };
    }

    // Добавление воды
    addAmount(amount) {
        this.amount += amount;
        return this;
    }

    // Получение прогресса в процентах
    getProgressPercentage() {
        if (!this.dailyGoal) return 0;
        return Math.min(Math.round((this.amount / this.dailyGoal) * 100), 100);
    }

    // Проверка достижения дневной цели
    hasReachedGoal() {
        return this.amount >= this.dailyGoal;
    }

    // Сброс количества воды (для нового дня)
    reset() {
        this.amount = 0;
        this.date = new Date();
        return this;
    }
}

module.exports = Water; 