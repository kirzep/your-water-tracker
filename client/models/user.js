class User {
    constructor(data = {}) {
        this.id = data.id;
        this.username = data.username;
        this.email = data.email;
        this.weight = data.weight;
        this.dailyWaterGoal = data.dailyWaterGoal;
    }

    static fromJSON(json) {
        return new User(json);
    }

    toJSON() {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            weight: this.weight,
            dailyWaterGoal: this.dailyWaterGoal
        };
    }

    // Вычисление дневной нормы воды на основе веса
    calculateDailyWaterGoal() {
        // Формула: 30 мл на 1 кг веса
        return Math.round(this.weight * 30);
    }

    // Обновление веса и пересчет дневной нормы
    updateWeight(newWeight) {
        this.weight = newWeight;
        this.dailyWaterGoal = this.calculateDailyWaterGoal();
        return this;
    }
}

module.exports = User; 