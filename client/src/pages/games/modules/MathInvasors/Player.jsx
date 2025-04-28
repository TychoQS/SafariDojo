export default class Player {
    LastShotTime;
    ShotCooldown;
    constructor(canvasWidth, canvasHeight) {
        this.Width = 30;
        this.Height = 15;
        this.Speed = 4;
        this.Emoji = "🚀";
        this.X = canvasWidth / 2 - this.Width / 2;
        this.Y = canvasHeight - 30;
        this.Dx = 0;
        this.ShotCooldown = 250;
        this.RotationAngle = 0;
        this.RightRotationFactor = 0.8;
        this.LeftRotationFactor = 2.33;
    }

    MoveLeft() {
        this.Dx = -this.Speed;
    }

    MoveRight() {
        this.Dx = this.Speed;
    }

    Stop() {
        this.Dx = 0;
        this.RotationAngle = 0;
    }

    Update(canvasWidth) {
        this.X += this.Dx;

        if (this.X < 0) this.X = 0;
        if (this.X + this.Width > canvasWidth) this.X = canvasWidth - this.Width;

        if (this.Dx !== 0) {
            const direction = this.Dx > 0 ? 1 : -1;
            if (direction > 0) {
                this.RotationAngle = direction * this.RightRotationFactor;
            } else {
                this.RotationAngle = direction * this.LeftRotationFactor;
            }

        }
    }

    Draw(ctx) {
        ctx.save();
        ctx.translate(this.X + this.Width/2, this.Y - this.Height/2);
        ctx.rotate(this.RotationAngle);
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.Emoji, 0, 0);
        ctx.restore();
    }

    Shoot() {
        const now = Date.now();
        if (now - this.LastShotTime < this.ShotCooldown) return;
        this.LastShotTime = Date.now();
        return { x: this.X, y: this.Y };
    }
}