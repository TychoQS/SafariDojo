import React, { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Lifes from "@/components/Lifes";
import Link from "next/link";
import {router} from "next/client";


function initialCards(cardsDiff) {
    const allPairs = [
        { id: 1, content: "🖐️", match: "Hand" },
        { id: 2, content: "👣", match: "Feet" },
        { id: 3, content: "👂", match: "Ear" },
        { id: 4, content: "👃", match: "Nose" },
        { id: 5, content: "👁️", match: "Eye" },
        { id: 6, content: "👄", match: "Mouth" },
        { id: 7, content: "🦶", match: "Ankle" },
        { id: 8, content: "🦵", match: "Leg" },
        { id: 9, content: "💪", match: "Arm" },
        { id: 10, content: "🧠", match: "Brain" },
        { id: 11, content: "🫀", match: "Heart" }
    ];

    const shuffled = [...allPairs].sort(() => Math.random() - 0.5);

    let numberOfPairs;
        if (cardsDiff === "hard") {
            numberOfPairs = 6;
        } else if (cardsDiff === "medium") {
            numberOfPairs = 5;
        } else {
            numberOfPairs = 4;
        }

    const pairs = shuffled.slice(0, numberOfPairs);

    let cards = [];
    pairs.forEach((pair, index) => {
        cards.push({ id: index * 2, value: pair.content, pairId: index });
        cards.push({ id: index * 2 + 1, value: pair.match, pairId: index });
    });

    return cards.sort(() => Math.random() - 0.5);
}

export default function MemoryGame() {
    const [cards, setCards] = useState([]);
    const [selected, setSelected] = useState([]);
    const [matched, setMatched] = useState([]);
    const [mistakes, setMistakes] = useState(0);
    const [lives, setLives] = useState(3);
    const [gameOver, setGameOver] = useState(false);
    const [preview, setPreview] = useState(true);
    const [isClient, setIsClient] = useState(false);
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(0);
    const [difficulty, setDifficulty] = useState("easy");

    const successSound = useRef(null);
    const failSound = useRef(null);
    const winSound = useRef(null);
    const loseSound = useRef(null);
    const lifesRef = useRef(null);

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
        fetchDifficulty();
    }, []);

    useEffect(() => {
        if (difficulty) {
            setCards(initialCards(difficulty));
        }
    }, [difficulty]);

    useEffect(() => {
        if (selected.length === 2) {
            const [first, second] = selected;
            if (first.pairId === second.pairId) {
                setScore(score + 5);
                successSound.current.play();
                setMatched((prev) => [...prev, first.pairId]);
                setTimeout(() => setSelected([]), 500);
            } else {
                setScore(score - 2);
                failSound.current.play();
                setMistakes((prev) => prev + 1);
                setTimeout(() => setSelected([]), 800);
            }
        }
    }, [selected]);

    useEffect(() => {
        if (mistakes === 7) {
            if (bestScore < score) {
                setBestScore(score);
            }
            setGameOver(true);
            loseSound.current.play();
            lifesRef.current.loseLife();
        }
    }, [mistakes]);

    useEffect(() => {
        if (matched.length === cards.length / 2 && cards.length > 0) {
            const timeout = setTimeout(() => {
                winSound.current?.play();
                if (bestScore < score) {
                    setBestScore(score);
                }
            }, 500);

            return () => clearTimeout(timeout);
        }
    }, [matched, cards]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setPreview(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleClick = (card) => {
        if (
            selected.length < 2 &&
            !selected.includes(card) &&
            !matched.includes(card.pairId) &&
            !gameOver
        ) {
            setSelected((prev) => [...prev, card]);
        }
    };

    function restartGame() {
        setCards(initialCards(difficulty));
        setMistakes(0);
        setScore(0);
        setGameOver(false);
        setSelected([]);
        setMatched([]);
        setPreview(true);

        setTimeout(() => {
            setPreview(false);
        }, 5000);
    }

    function finishGame() {
        try {
            const previousURL = localStorage.getItem("previousURL");
            if (previousURL) {
                const url = new URL(previousURL);
                const gameData = url.searchParams.get("Game");
                const age = url.searchParams.get("Age");

                if (gameData && age) {
                    const key = `${gameData}_${age}_bestScore`;
                    localStorage.setItem(key, bestScore.toString());
                }
            }
        } catch (error) {
            console.error("Error processing score update:", error);
        }
        router.back();
    }

    return (
        <div className="app min-h-screen flex flex-col bg-PS-main-purple">
            <Header />
            <main className="flex-1 flex flex-col justify-start px-4 relative">
            <div className="flex items-center justify-between">
                <div className={`ml-8 mt-6 text-4xl 
                ${7 - mistakes <= 2 ? "text-red-500 animate-bounce" : "text-white animate-pulse"}`}>
                    Tries remain: {7-mistakes}
                </div>
                <div className={"ml-8 mt-6 text-4xl"}>
                    Score: {score}
                </div>
                <Lifes ref={lifesRef} lives={lives} />
            </div>

                {isClient && (
                    <div className={`mb-8 grid justify-items-center 
                    ${difficulty === "easy" ? "grid-cols-4" : difficulty === "medium" ? "grid-cols-5" : "grid-cols-6"}`}>
                        {cards.map((card) => {
                            const isFlipped =
                                selected.includes(card) || matched.includes(card.pairId) || preview;
                            const isMatched = matched.includes(card.pairId);

                            return (
                                <div
                                    key={card.id}
                                    onClick={() => handleClick(card)}
                                    className={`cursor-pointer mt-8 flex items-center justify-center w-44 h-60 border rounded-xl text-xl 
                            shadow-md transition-transform duration-300 ease-in-out transform text-black ${
                                        isFlipped ? "rotate-y-360 bg-white" : "bg-gray-300"
                                    } ${isMatched ? "opacity-0 scale-75" : "hover:scale-105"}`}
                                    style={{
                                        perspective: "1000px",
                                        transition: "all 0.8s ease",
                                    }}
                                >
                                    {isFlipped ? card.value : "?"}
                                </div>
                            );
                        })}
                    </div>
                )}

                {(matched.length === cards.length / 2 || gameOver) && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-PS-main-purple bg-opacity-90 z-50">
                        {matched.length === cards.length / 2 && (
                            <div className="text-center text-green-600 font-bold text-3xl animate-bounce">
                                🏅 ¡Congratulations! You've won a medal.
                                <br />
                                Final score: {score}
                                <br />
                                Best score: {bestScore}
                            </div>
                        )}

                        {gameOver && (
                            <div className="text-center text-red-500 font-bold text-3xl animate-pulse">
                                💀 ¡You lost! Try again.
                                <br />
                                Final score: {score}
                                <br />
                                Best score: {bestScore}
                            </div>
                        )}
                        <div className={"mt-8 space-x-8 flex flex-row"}>
                            <button className={"cursor-pointer h-15 w-35 rounded-4xl border-b-8 hover:border-none text-lg " +
                                "border-[#6EF68B] bg-[#C9F1D2] text-black"} onClick={() => restartGame()}>
                                Play again
                            </button>
                            <button className={"cursor-pointer h-15 w-35 rounded-4xl border-b-8 hover:border-none " +
                                "text-lg border-[#6EF68B] bg-[#C9F1D2] text-black"} onClick={() => finishGame()}>
                                Finish game
                            </button>
                        </div>
                    </div>
                )}

            <audio ref={successSound} src="/sounds/Memory/correct_answer.mp3" preload="auto" />
            <audio ref={failSound} src="/sounds/Memory/fail_answer.mp3" preload="auto" />
            <audio ref={winSound} src="/sounds/Memory/win_game.mp3" preload="auto" />
            <audio ref={loseSound} src="/sounds/Memory/lose_game.mp3" preload="auto" />
            </main>

            <Footer />
        </div>
    );
}
