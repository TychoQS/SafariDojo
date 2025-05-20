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
import saveGameData from "@/StorageServices/SaveDataFinishedGame";
import {useRouter} from "next/router";


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
    const loseSound = useRef(null);
    const router = useRouter();

    const {t} = useTranslation();

    useEffect(() => {
        const previousURL = localStorage.getItem('previousURL');

        if (previousURL) {
            const urlParams = new URLSearchParams(new URL(previousURL).search);
            const ageParam = urlParams.get("Age");
            setDifficulty(ageParam);

        } else {
            console.error("No previous URL found in localStorage");
        }
    }, [])

    useEffect(() => {
        if (difficulty) {
            generateMaze();
            restartGame();
        }
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
                setPlayerPos({ x: 1, y: 1 });
                loseLive();
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

    function generateMaze() {
        if (difficulty === "hard") {
            setMazeState(mazeHard);
        }
        else if (difficulty === "medium") {
            setMazeState(mazeMedium);
        }
        else {
            setMazeState(mazeEasy);
        }
    }

    const restartGame = () => {
        startSound.current.play();
        generateMaze();
        setLives(3);
        livesRef.current?.resetHearts();
        setPlayerPos({ x: 1, y: 1 });
        setGameWon(false);
        setGameOver(false);
        setScore(0);
    };

    function loseLive() {
        setScore(score - 2);
        livesRef.current.loseLife();
        setLives(lives - 1);
        if (lives === 0) {
            if (bestScore < score) {
                setBestScore(score);
            }
            setGameOver(true);
            loseSound.current.play();
        }
    }

    const closeModal = () => {
        setTimeout(() => {
            router.back();
        }, 0);
    };


    const closeModalCongrats = () => {
        saveGameData(score);
        closeModal();
    };

    const restartGameCongrats = () => {
        saveGameData(score);
        restartGame();
    }


    const cellSize = 30;

    return (
        <div className="app min-h-screen flex flex-col bg-PS-main-purple">
            <Header />
            <section className="flex-1 flex flex-col justify-center items-center py-10">
                <div className="mt-[-4em]">
                    <Title>Snake Maze</Title>
                </div>
                <div className={"relative w-[60em] mb-3 flex justify-between"}>
                    <Button size="small" onClick={finishGame}>{t("backButton")} </Button>
                    <div className={"text-3xl"}>{t("snakemaze.score")}: {score}</div>
                    <div className={"mt-[-1.5em]"}>
                        <Lifes ref={livesRef} />
                    </div>
                    <ErrorReportModal></ErrorReportModal>
                </div>

                <div className="bg-white border-4 border-gray-800 relative"
                     style={{width: mazeState[0].length * cellSize, height: mazeState.length * cellSize}}>
                    {mazeState.map((row, y) => (
                        row.map((cell, x) => (
                            <div
                                key={`${x}-${y}`}
                                className={`absolute ${
                                    cell === 1 ? 'bg-yellow-950' : 'bg-yellow-200'
                                }`}
                                style={{
                                    left: x * cellSize,
                                    top: y * cellSize,
                                    width: cellSize,
                                    height: cellSize
                                }}
                            >
                                {cell === 2 && <img src={"/images/Games/Science/SnakeMaze/mouse.svg"} alt={"mouse"}
                                                    style={{
                                                    left: playerPos.x * cellSize + cellSize * 0.1,
                                                    top: playerPos.y * cellSize + cellSize * 0.1,
                                                    width: cellSize * .9,
                                                    height: cellSize * .9
                                                    }}
                                />}
                                {cell === 3 && <img src={"/images/Games/Science/SnakeMaze/eagle.svg"} alt={"eagle"}
                                                    style={{
                                                        left: playerPos.x * cellSize + cellSize * 0.1,
                                                        top: playerPos.y * cellSize + cellSize * 0.1,
                                                        width: cellSize * .9,
                                                        height: cellSize * .9
                                                    }}
                                />}
                                {cell === 4 && <img src={"/images/Games/Science/SnakeMaze/hole.svg"} alt={"hole"}
                                                    style={{
                                                        left: playerPos.x * cellSize + cellSize * 0.1,
                                                        top: playerPos.y * cellSize + cellSize * 0.1,
                                                        width: cellSize * .9,
                                                        height: cellSize * .9
                                                    }}
                                />}
                            </div>
                        ))
                    ))}

                    <img src={"/images/Games/Science/SnakeMaze/snake.svg"} alt={"snake"}
                        className="absolute"
                        style={{
                            left: playerPos.x * cellSize + cellSize * 0.1,
                            top: playerPos.y * cellSize + cellSize * 0.1,
                            width: cellSize * .9,
                            height: cellSize * .9,
                            transition: 'left 0.15s, top 0.15s'
                        }}
                    />
                </div>

                {gameWon && (
                        <CongratsModal onCloseMessage={closeModalCongrats} onRestart={restartGameCongrats} points={score}/>
                )}

                {gameOver && (
                    <GameOverModal onCloseMessage={closeModal} onRestart={restartGame}/>
                )}

                <audio ref={startSound} src="/sounds/SnakeMaze/startSound.mp3" preload="auto "/>
                <audio ref={appleSound} src="/sounds/SnakeMaze/biteSound.mp3" preload="auto" />
                <audio ref={dropSound} src="/sounds/SnakeMaze/dropSound.mp3" preload="auto" />
                <audio ref={winSound} src="/sounds/SnakeMaze/winSound.mp3" preload="auto "/>
                <audio ref={loseSound} src="/sounds/SnakeMaze/loseSound.mp3" preload="auto" />
            </section>
            <Footer />
        </div>
    );
}