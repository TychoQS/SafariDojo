import React, {useState, useEffect, useRef} from 'react';
import Header from "@/components/Header";
import Title from "@/components/Title";
import Footer from "@/components/Footer";
import CongratsModal from "@/components/CongratsModal";
import Button from "@/components/Button";
import ErrorReportModal from "@/components/ErrorModal";
import {router} from "next/client";
import {useTranslation} from "react-i18next";
import Lifes from "@/components/Lifes";
import GameOverModal from "@/components/GameOverModal";


export default function MazeGame() {
    // Definición del laberinto (0: camino, 1: pared, 2: puntos, 3: lava, 4: salida)
    const mazeEasy = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
        [1, 0, 1, 0, 0, 0, 0, 0, 2, 1, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
        [1, 0, 0, 2, 0, 0, 0, 1, 0, 1, 0, 1],
        [1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
        [1, 3, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
        [1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];

    const mazeMedium = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1, 0, 2, 0, 1, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
        [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 3, 1, 0, 1],
        [1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1],
        [1, 0, 0, 3, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 0, 2, 0, 0, 1, 2, 0, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1],
        [1, 0, 1, 1, 3, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1],
        [1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1],
        [1, 3, 2, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1]
    ];

    const mazeHard = [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,1,0,0,0,1,0,2,0,1,0,0,0,0,2,0,1],
        [1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,1,0,1,0,1],
        [1,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1,0,1,3,1],
        [1,0,1,1,1,0,1,1,1,1,1,1,1,1,0,1,0,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1],
        [1,1,1,1,1,1,1,0,1,1,1,1,0,1,1,1,1,1,0,1],
        [1,2,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,1,0,1],
        [1,1,1,1,1,0,1,1,1,1,0,1,1,1,1,1,0,1,0,1],
        [1,0,0,0,1,0,0,0,0,3,0,0,0,0,0,1,0,1,0,1],
        [1,0,1,2,1,0,1,0,1,1,1,1,1,1,0,1,0,1,0,1],
        [1,0,1,3,0,0,1,0,0,0,0,0,0,0,3,1,0,1,0,1],
        [1,0,1,1,1,0,1,1,1,1,1,1,0,1,0,2,0,1,0,1],
        [1,0,0,0,0,0,0,0,2,0,0,1,0,0,0,1,0,1,0,1],
        [1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1],
        [1,0,0,0,2,0,0,1,0,0,0,0,0,0,0,2,0,1,0,1],
        [1,3,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,4,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ]

    const [playerPos, setPlayerPos] = useState({ x: 1, y: 1 });
    const [mazeState, setMazeState] = useState(mazeEasy);
    const [difficulty, setDifficulty] = useState(null);
    const [gameWon, setGameWon] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(0);
    const [lives, setLives] = useState(3);
    const livesRef = useRef(null);

    const startSound = useRef(null);
    const appleSound = useRef(null);
    const dropSound = useRef(null);
    const winSound = useRef(null);

    const {t} = useTranslation();

    async function fetchDifficulty() {
        const previousURL = localStorage.getItem('previousURL');

        if (previousURL) {
            const urlParams = new URLSearchParams(new URL(previousURL).search);
            const ageParam = urlParams.get("Age");
            setDifficulty(ageParam);

        } else {
            console.error("No previous URL found in localStorage");
        }
    }

    useEffect(() => {
        fetchDifficulty().then(() => {
            if (difficulty === "hard") {
                setMazeState(mazeHard)
            }
            if (difficulty === "medium") {
                setMazeState(mazeMedium)
            }
            if (startSound.current) {
                startSound.current.play().catch((err) => {
                    console.warn("Start sound failed to play automatically:", err);
                });
            }
        })
    }, [difficulty]);

    const movePlayer = (dx, dy) => {
        const newX = playerPos.x + dx;
        const newY = playerPos.y + dy;

        if (
            newX >= 0 && newX < mazeState[0].length &&
            newY >= 0 && newY < mazeState.length
        ) {
            let tileType = mazeState[newY][newX];

            if (tileType === 0) {
                setPlayerPos({ x: newX, y: newY });
            } else if (tileType === 2) {
                setPlayerPos({ x: newX, y: newY });
                setScore(score + 5);
                appleSound.current.play();

                const updatedMaze = mazeState.map((row, rowIndex) =>
                    row.map((cell, colIndex) =>
                        rowIndex === newY && colIndex === newX ? 0 : cell
                    )
                );
                setMazeState(updatedMaze);
            }
            else if (tileType === 3) {
                dropSound.current.play();
                setPlayerPos({ x: newX, y: newY });
                setScore(score - 2);
                livesRef.current.loseLife();
                setLives(lives - 1);
                if (lives === 0) {
                    if (bestScore < score) {
                        setBestScore(score);
                    }
                    setGameOver(true);
                    // loseSound.current.play();
                }
            }
            else if (tileType === 4) {
                if (score > bestScore) {
                    setBestScore(score);
                }
                winSound.current.play();
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

    const restartGame = () => {
        startSound.current.play();
        if (difficulty === "hard") {
            setMazeState(mazeHard)
        }
        if (difficulty === "medium") {
            setMazeState(mazeMedium)
        }
        else {
            setMazeState(mazeEasy)
        }
        setLives(3);
        livesRef.current?.resetHearts();
        setPlayerPos({ x: 1, y: 1 });
        setGameWon(false);
        setGameOver(false);
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


    const cellSize = 30;

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
                    <div className={"relative w-[60em] mb-3 flex justify-between"}>
                        <Button size="small" onClick={finishGame}>{t("backButton")} </Button>
                        <div className={"text-3xl"}>Score: {score}</div>
                        <div className={"mt-[-1.5em]"}>
                            <Lifes ref={livesRef} />
                        </div>
                        <ErrorReportModal></ErrorReportModal>
                    </div>

                )}

                <div className="bg-white border-4 border-gray-800 relative"
                     style={{width: mazeState[0].length * cellSize, height: mazeState.length * cellSize}}>
                    {mazeState.map((row, y) => (
                        row.map((cell, x) => (
                            <div
                                key={`${x}-${y}`}
                                className={`absolute ${
                                    cell === 1 ? 'bg-gray-800' :
                                        cell === 2 ? 'bg-yellow-400' :
                                            cell === 3 ? 'bg-red-600' :
                                                cell === 4 ? 'bg-green-500' : 'bg-white'
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

                {gameOver && (
                    <GameOverModal onCloseMessage={finishGame} onRestart={restartGame}/>
                )}

                <audio ref={startSound} src="/sounds/SnakeMaze/startSound.mp3" preload="auto "/>
                <audio ref={appleSound} src="/sounds/SnakeMaze/appleSound.mp3" preload="auto" />
                <audio ref={dropSound} src="/sounds/SnakeMaze/dropSound.mp3" preload="auto" />
                <audio ref={winSound} src="/sounds/SnakeMaze/winSound.mp3" preload="auto" />
            </section>
            <Footer />
        </div>
    );
}