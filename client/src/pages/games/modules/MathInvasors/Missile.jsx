const ShootingSfxSource = "http://localhost:8080/sfx/shoot.wav";
export default class Missile {
    constructor(x, y) {
        const horizontalOffset = 15;
        const verticalOffset = 2;
        this.X = x + horizontalOffset;
        this.Y = y + verticalOffset;
        this.Width = 7;
        this.Height = 15;
        this.Radius = 5;
        this.Speed = 6;
        this.Color = "purple";
        new Audio(ShootingSfxSource).play();
    }

    Move() {
        this.Y -= this.Speed;
    }

    Draw(ctx) {
        ctx.fillStyle = this.Color;
        ctx.beginPath()
        ctx.arc(this.X + this.Radius, this.Y + this.Radius, this.Radius, 0, 2*Math.PI)
        ctx.fill();
    }
}