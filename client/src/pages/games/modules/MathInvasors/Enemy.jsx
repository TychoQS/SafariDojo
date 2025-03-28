const MinDistanceBetweenEnemies = 50;

export default class Enemy {
    constructor(X, Value) {
        this.X = X;
        this.Y = 0;
        this.Width = 30;
        this.Height = 30;
        this.Speed = 1;
        this.Color = "red";
        this.Number = Value;
    }

    Move() {
        this.Y += this.Speed;
    }

    Draw(ctx) {
        ctx.fillStyle = this.Color;
        ctx.font = "30px Arial";
        ctx.fillText(this.Number, this.X, this.Y);
    }
}

export function generateEnemies(canvasWidth, numEnemies) {
    let enemies = [];
    while (enemies.length < numEnemies) {
        const newEnemy = generateAnEnemy(canvasWidth);
        if (isEnemyFarEnough(newEnemy, enemies)) {
            enemies.push(newEnemy);
        }
    }
    return enemies;
};

export function generateAnEnemy(canvasWidth) {
    const x = Math.random() * (canvasWidth - 30);
    return new Enemy(x, getRandomNumber());
};


const isEnemyFarEnough = (newEnemy, existingEnemies) => {
    return existingEnemies.every((enemy) => {
        const distance = Math.abs(newEnemy.X - enemy.X);
        return distance > MinDistanceBetweenEnemies;
    });
};