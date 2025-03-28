export default class Player {
    LastShotTime;
    ShotCooldown;
    constructor(canvasWidth, canvasHeight) {
        this.Width = 30;
        this.Height = 15;
        this.Speed = 3;
        this.Emoji = "🚀";
        this.X = canvasWidth / 2 - this.Width / 2;
        this.Y = canvasHeight - 30;
        this.Dx = 0;
        this.ShotCooldown = 250;
    }

    MoveLeft() {
        this.Dx = -this.Speed;
    }

    MoveRight() {
        this.Dx = this.Speed;
    }

    Stop() {
        this.Dx = 0;
    }

    Update(canvasWidth) {
        this.X += this.Dx;
        if (this.X < 0) this.X = 0;
        if (this.X + this.Width > canvasWidth) this.X = canvasWidth - this.Width;
    }

    Draw(ctx) {
        ctx.font = "30px Arial";
        ctx.fillText(this.Emoji, this.X, this.Y);
    }

    Shoot() {
        const now = Date.now();
        if (now - this.LastShotTime < this.ShotCooldown) return; // Si el tiempo no ha pasado, no dispara
        this.LastShotTime = Date.now();
        return { x: this.X, y: this.Y };
    }
}