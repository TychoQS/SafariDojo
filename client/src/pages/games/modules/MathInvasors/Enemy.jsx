const MinDistanceBetweenEnemies = 150;

export default class Enemy {
    constructor(X, Number) {
        this.X = X;
        this.Y = 0;
        this.Width = 30;
        this.Height = 30;
        this.Speed = 1;
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
}

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
    do {
        const x = Math.random() * (canvasWidth - 30);
        newEnemy = new Enemy(x, Number);
    } while (!isEnemyFarEnough(newEnemy, Enemies));

    return newEnemy;
}

const isEnemyFarEnough = (newEnemy, existingEnemies) => {
    return existingEnemies.every((enemy) =>
        Math.abs(newEnemy.X - enemy.X) > MinDistanceBetweenEnemies
    );
};
