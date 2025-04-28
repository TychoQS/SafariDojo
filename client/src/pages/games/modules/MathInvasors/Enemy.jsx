export default class Enemy {
    constructor(X, Number) {
        this.X = X;
        this.Y = 0;
        this.Width = this.calculateWidth(Number);
        this.Height = 30;
        this.Speed = 0.7;
        this.Color = "red";
        this.Number = Number;
    }

    Move() {
        this.Y += this.Speed;
    }

    Draw(ctx) {
        ctx.fillStyle = this.Color;
        ctx.font = "30px Arial";
        ctx.fillText(this.Number, this.X, this.Y);
    }

    calculateWidth(number) {
        const baseWidth = 30;
        const numDigits = number.toString().length;
        return baseWidth + (numDigits - 1) * 15;
    }
}

const BASE_MARGIN = 15;

export function generateEnemies(canvasWidth, Numbers, Enemies = []) {
    let newEnemies = [];

    Numbers.forEach((number) => {
        const newEnemy = generateAnEnemy(canvasWidth, number, [...newEnemies]);
        if (newEnemy) newEnemies.push(newEnemy);
    });

    return newEnemies;
}

export function generateAnEnemy(canvasWidth, Number, Enemies = []) {
    let newEnemy;
    const tempEnemy = new Enemy(0, Number);
    const enemyWidth = tempEnemy.Width;
    const maxX = canvasWidth - enemyWidth;
    do {
        const x = Math.random() * maxX;
        newEnemy = new Enemy(x, Number);
    } while (!isEnemyFarEnough(newEnemy, Enemies));

    return newEnemy;
}

const isEnemyFarEnough = (newEnemy, existingEnemies) => {
    if (existingEnemies.length === 0) return true;
    return existingEnemies.every((enemy) => {
            const minDistance = (newEnemy.Width / 2) + (enemy.Width / 2) + BASE_MARGIN;
            return Math.abs(newEnemy.X - enemy.X) > minDistance
        }
    );
};
