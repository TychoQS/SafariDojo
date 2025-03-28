import {useEffect, useRef, useState} from "react";
import Player from "@/pages/games/modules/MathInvasors/Player";
import Missile from "@/pages/games/modules/MathInvasors/Missile";
import Enemy, {generateEnemies} from "@/pages/games/modules/MathInvasors/Enemy";

export default function MathInvasors() {
    const canvasRef = useRef(null);
    const playerRef = useRef(null);
    const missilesRef = useRef([]);
    const enemiesRef = useRef([]);
    const [score, setScore] = useState(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");


        playerRef.current = new Player(canvas.width, canvas.height);

        enemiesRef.current = generateEnemies(canvas.width, 3);

        const keyPressed = (e) => {
            if (!playerRef.current) return;
            if (e.key === "ArrowLeft") playerRef.current.MoveLeft();
            if (e.key === "ArrowRight") playerRef.current.MoveRight();
            if (e.key === " ") {
                const shootPosition = playerRef.current.Shoot();
                if (!shootPosition) return;
                const newMissile = new Missile(shootPosition.x, shootPosition.y);
                missilesRef.current.push(newMissile);
            }
        };

        const keyReleased = (e) => {
            if (!playerRef.current) return;
            if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
                playerRef.current.Stop();
            }
        };

        // Agregar los event listeners
        window.addEventListener("keydown", keyPressed);
        window.addEventListener("keyup", keyReleased);

        const UpdateAndDrawPlayer = (ctx) => {
            if (!playerRef.current) return;
            playerRef.current.Update(canvas.width);
            playerRef.current.Draw(ctx);
        };

        const UpdateEnemies = () => {
            enemiesRef.current = enemiesRef.current
                .map((enemy) => {
                    enemy.Move();
                    if (enemy.Y > canvas.height) {
                        return new Enemy(Math.random() * (canvas.width));
                    }
                    return enemy;
                })
                .filter(Boolean);
        }

        const DrawEnemies = (ctx) => {
            enemiesRef.current.forEach((enemies) => enemies.Draw(ctx));
        }

        const UpdateMissiles = () => {
            missilesRef.current.forEach((missile) => missile.Move());
            missilesRef.current = missilesRef.current.filter(
                (missile) => missile.Y > 0
            );
        };

        const DrawMissiles = (ctx) => {
            missilesRef.current.forEach((missile) => missile.Draw(ctx));
        };

        function animateMissiles() {
            UpdateMissiles();
            DrawMissiles(ctx);
        }

        function animateEnemies() {
            UpdateEnemies();
            DrawEnemies(ctx);
        }

        const CheckCollisions = () => {
            missilesRef.current = missilesRef.current.filter((missile) => {
                let hit = false;

                enemiesRef.current = enemiesRef.current.filter((enemy) => {
                    function missileIsInEnemySquare() {
                        return missile.X < enemy.X + (enemy.Width * 1.05) &&
                               missile.X >= (enemy.X * 0.9) &&
                               missile.Y < enemy.Y + (enemy.Height * 1.05) &&
                               missile.Y >= (enemy.Y * 0.9);
                    }

                    if (missileIsInEnemySquare()) {
                        hit = true;
                        setScore((prevScore) => prevScore + enemy.Number);
                        return false;
                    }
                    return true;
                });
                return !hit;
            });

            while (enemiesRef.current.length < 3) {
                enemiesRef.current.push(new Enemy(Math.random() * (canvasRef.current.width - 30)));
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            UpdateAndDrawPlayer(ctx);
            animateMissiles();
            animateEnemies();
            CheckCollisions();
            requestAnimationFrame(animate);
        };
        animate();

        // Remover event listeners al desmontar el componente
        return () => {
            window.removeEventListener("keydown", keyPressed);
            window.removeEventListener("keyup", keyReleased);
        };
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-black">
            <h1 className="text-white text-2xl mb-2">Math Invasors</h1>
            <div className="text-white text-3xl mb-4">
                Score: {score}
            </div>
            <canvas
                ref={canvasRef}
                width="920"
                height="700"
                className="border-4 border-orange-500 bg-purple-600"
            ></canvas>
        </div>
    );
}