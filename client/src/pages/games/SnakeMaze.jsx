import React, { useState, useEffect } from 'react';
import Header from "@/components/Header";
import Title from "@/components/Title";
import Footer from "@/components/Footer";
import CongratsModal from "@/components/CongratsModal";
import Button from "@/components/Button";
import ErrorReportModal from "@/components/ErrorModal";
import {router} from "next/client";
import {useTranslation} from "react-i18next";


export default function MazeGame() {
    // Definición del laberinto (0: camino, 1: pared, 2: salida)
    const maze = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
        [1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
        [1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];

    const [playerPos, setPlayerPos] = useState({ x: 1, y: 1 });
    const [gameWon, setGameWon] = useState(false);
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(0);
    const {t} = useTranslation();

    // Manejar el movimiento del jugador
    const movePlayer = (dx, dy) => {
        const newX = playerPos.x + dx;
        const newY = playerPos.y + dy;

        // Verificar si la nueva posición está dentro de los límites y no es una pared
        if (
            newX >= 0 && newX < maze[0].length &&
            newY >= 0 && newY < maze.length
        ) {
            const tileType = maze[newY][newX];

            if (tileType === 0) {
                // Es un camino, mover al jugador
                setPlayerPos({ x: newX, y: newY });
            } else if (tileType === 2) {
                // Es la salida, el jugador gana
                if (score > bestScore) {
                    setBestScore(score);
                }
                setPlayerPos({ x: newX, y: newY });
                setGameWon(true);
            }
        }
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (gameWon) return;

            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
            }

            switch (e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    movePlayer(0, -1);
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    movePlayer(0, 1);
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    movePlayer(-1, 0);
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    movePlayer(1, 0);
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [playerPos, gameWon]);

    // Reiniciar el juego
    const restartGame = () => {
        setPlayerPos({ x: 1, y: 1 });
        setGameWon(false);
        setScore(0);
    };

    function finishGame() {
        try {
            const previousURL = localStorage.getItem("previousURL");
            if (previousURL) {
                const url = new URL(previousURL);
                const gameData = url.searchParams.get("Game");
                const age = url.searchParams.get("Age");

                if (gameData && age) {
                    const key = `${gameData}_${age}_bestScore`;
                    const storedScore = parseInt(localStorage.getItem(key) || "0", 10);
                    if (bestScore > storedScore) {
                        localStorage.setItem(key, bestScore.toString());
                    }
                    const typeMedal = age === "easy"
                        ? "BronzeMedal"
                        : age === "medium"
                            ? "SilverMedal"
                            : "GoldMedal";

                    const medalKey = `${gameData}_${typeMedal}`;
                    const medalStatus = localStorage.getItem(medalKey) === "1";
                    if (!medalStatus) {
                        localStorage.setItem(medalKey, "1");
                    }
                }
            }
        } catch (error) {
            console.error("Error processing score update:", error);
        }
        return router.push({
            pathname: "../GameSelectionPage",
            query: {
                Subject: "Science"
            }
        });
    }

    // Tamaño de cada celda del laberinto en píxeles
    const cellSize = 40;

    return (
        <div className="app min-h-screen flex flex-col bg-PS-main-purple">
            <Header />
            <section className="flex-1 flex flex-col justify-center items-center py-10">
                <div className="mt-[-4em]">
                    <Title>Snake Maze</Title>
                </div>
                {gameWon ? (
                    <div className="text-green-600 font-bold">Congrats! You won a medal.</div>
                ) : (
                    <div className={"relative w-[40em] mb-3 flex justify-between"}>
                        <Button size="small" onClick={finishGame}>{t("backButton")} </Button>
                        <div className={"text-3xl"}>Score: {score}</div>
                        <ErrorReportModal></ErrorReportModal>
                    </div>

                )}

                <div className="bg-white border-4 border-gray-800 relative"
                     style={{width: maze[0].length * cellSize, height: maze.length * cellSize}}>
                    {maze.map((row, y) => (
                        row.map((cell, x) => (
                            <div
                                key={`${x}-${y}`}
                                className={`absolute ${
                                    cell === 1 ? 'bg-gray-800' :
                                        cell === 2 ? 'bg-green-500' : 'bg-white'
                                }`}
                                style={{
                                    left: x * cellSize,
                                    top: y * cellSize,
                                    width: cellSize,
                                    height: cellSize
                                }}
                            />
                        ))
                    ))}

                    <div
                        className="absolute bg-red-500 rounded-full"
                        style={{
                            left: playerPos.x * cellSize + cellSize * 0.2,
                            top: playerPos.y * cellSize + cellSize * 0.2,
                            width: cellSize * 0.6,
                            height: cellSize * 0.6,
                            transition: 'left 0.15s, top 0.15s'
                        }}
                    />
                </div>

                {gameWon && (
                    <CongratsModal onCloseMessage={finishGame} onRestart={restartGame} points={score}/>
                )}
            </section>
            <Footer />
        </div>
    );
}