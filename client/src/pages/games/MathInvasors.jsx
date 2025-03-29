import {useEffect, useRef, useState} from "react";
import Player from "@/pages/games/modules/MathInvasors/Player";
import Missile from "@/pages/games/modules/MathInvasors/Missile";
import Enemy, {generateEnemies} from "@/pages/games/modules/MathInvasors/Enemy";
import {GetRandomOperation, GetRandomNumber} from "@/pages/games/modules/MathInvasors/MathUtils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function MathInvasors() {
    const canvasRef = useRef(null);
    const playerRef = useRef(null);
    const missilesRef = useRef([]);
    const enemiesRef = useRef([]);
    const [Score, setScore] = useState(0);
    const [Operation, SetOperation] = useState("");
    let Result = useRef(0);


    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");


        playerRef.current = new Player(canvas.width, canvas.height);

        SpawnWave(canvas.width);

        function SpawnWave(CanvasWidth) {
            const { operand1, operand2, operator, result } = GetRandomOperation();
            const newOperation = `${operand1} ${operator} ${operand2}`;
            SetOperation(newOperation)
            Result.current = result;
            const EnemiesWave = [GetRandomNumber(), GetRandomNumber(), result].sort(() => Math.random() - 0.5);
            enemiesRef.current = generateEnemies(CanvasWidth, EnemiesWave);
            console.log("Enemies", enemiesRef.current);
        }

        const keyPressed = (e) => {
            if (!playerRef.current) return;
            if (e.key === "ArrowLeft") playerRef.current.MoveLeft();
            if (e.key === "ArrowRight") playerRef.current.MoveRight();
            if (e.key === " ") {
                e.preventDefault();
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
                        return new Enemy(Math.random() * (canvas.width), GetRandomNumber());
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
            let hitCorrectEnemy = false;
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
                        if (enemy.Number === Result.current) {
                            setScore((prevScore) => prevScore + 1);
                            hitCorrectEnemy = true
                        }
                        return false;
                    }
                    return true;
                });
                return !hit;
            });

            if (hitCorrectEnemy) {
                enemiesRef.current = [];
                SpawnWave(canvas.width);
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
        <>
            <Header></Header>
                <main className="flex flex-col items-center justify-center flex-grow bg-black">
                    <h1 className={"text-red-600"}>{Operation}</h1>
                    <h1 className="text-white text-xl mb-2">Math Invasors</h1>
                    <div className="text-white text-xl mb-4">
                        Score: {Score}
                    </div>
                    <canvas
                        ref={canvasRef}
                        width="800"
                        height="600"
                        className="border-4 border-PS-main-purple bg-black-600 mb-4"
                    ></canvas>
                </main>
            <Footer></Footer>
        </>
    );
}
