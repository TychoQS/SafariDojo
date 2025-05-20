import React, { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Lifes from "@/components/Lifes";
import {router} from "next/client";
import {t} from "i18next";
import Button from "@/components/Button";
import CongratsModal from "@/components/CongratsModal";
import GameOverModal from "@/components/GameOverModal";
import Title from "@/components/Title";
import ErrorReportModal from "@/components/ErrorModal";
import saveGameData from "@/StorageServices/SaveDataFinishedGame";
import {useRouter} from "next/router";


async function initialCards(cardsDiff) {
    const response = await fetch("http://localhost:8080/api/memory")
    if (!response.ok) {
        console.error("Error fetching memory cards");
        return [];
    }
    const fetchedPairs = await response.json();
    const allPairs = fetchedPairs.pairs;

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
        cards.push({ id: index * 2 + 1, value: pair.pair, pairId: index });
    });

    return cards.sort(() => Math.random() - 0.5);
}

export default function MemoryGame() {
    const [cards, setCards] = useState([]);
    const [selected, setSelected] = useState([]);
    const [matched, setMatched] = useState([]);
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
    const [lives, setLives] = useState(5);
    const [isActive, setIsActive] = useState(true);
    const [timeLeft, setTimeLeft] = useState(5);
    const [isComplete, setIsComplete] = useState(false);
    const router = useRouter();
    const progressPercentage = (timeLeft / 5) * 100;

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
            initialCards(difficulty).then(setCards);
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
                lifesRef.current.loseLife();
                setLives(lives - 1);
                setTimeout(() => setSelected([]), 800);
            }
        }
    }, [selected]);

    useEffect(() => {
        if (lives === 0) {
            if (bestScore < score) {
                setBestScore(score);
            }
            setGameOver(true);
            loseSound.current.play();
        }
    }, [lives]);

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
            setIsActive(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        let interval = null;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prevTime => {
                    if (prevTime <= 0.1) {
                        clearInterval(interval);
                        setIsActive(false);
                        setIsComplete(true);
                        return 0;
                    }
                    return prevTime - 0.1;
                });
            }, 100);
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

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

    async function restartGame() {
        setCards(await initialCards(difficulty));
        setLives(5);
        lifesRef.current?.resetHearts();
        setScore(0);
        setGameOver(false);
        setSelected([]);
        setMatched([]);
        setPreview(true);
        setIsActive(true);
        setTimeLeft(5);

        setTimeout(() => {
            setPreview(false);
            setIsActive(false);
        }, 5000);
    }

    const closeModal = () => {
        saveGameData(score);
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

    return (
        <div className="app min-h-screen flex flex-col bg-PS-main-purple">
            <Header />
            <main className="flex-1 flex flex-col justify-start px-4 relative">
                <div className="mt-[-1em] self-center">
                    <Title>Memory</Title>
                </div>
                <div className="flex items-center justify-between">
                    <Button size="small" onClick={() => router.back()}> {t("backButton")} </Button>
                    <div className={"ml-8 mt-6 text-4xl"}>
                        Score: {score}
                    </div>
                    {isActive &&
                        <div className="w-50">
                            <div className="text-md text-black mb-1 flex justify-between">
                                <span>{Math.ceil(timeLeft)}s</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-100 ${isComplete ? 'bg-red-500' : 'bg-blue-500'}`}
                                    style={{ width: `${progressPercentage}%` }}
                                ></div>
                            </div>
                        </div>
                    }
                    <Lifes ref={lifesRef}/>
                    <ErrorReportModal></ErrorReportModal>
                </div>

                {isClient && cards && cards.length > 0 && (
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
                                        isFlipped ? "bg-white" : "bg-gray-300"
                                    } ${isMatched ? "opacity-0 scale-75" : "hover:scale-105"}`}
                                    style={{
                                        perspective: "1000px",
                                        transition: "all 0.8s ease",
                                        transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)"
                                    }}
                                >
                                    {isFlipped ? (
                                        typeof card.value === "string" && card.value.startsWith("/images") ? (
                                            <img src={card.value} alt="Card" className="w-24 h-24 object-contain" style={{ transform: "rotateY(180deg)" }} />
                                        ) : (
                                            <span style={{ transform: "rotateY(180deg)" }}>{card.value}</span>
                                        )
                                    ) : "?"}
                                </div>
                            );
                        })}
                    </div>
                )}

                {matched.length === cards.length / 2 && (
                    <CongratsModal onCloseMessage={closeModalCongrats} onRestart={restartGameCongrats} points={score}/>
                )}
                {gameOver && (
                    <GameOverModal onCloseMessage={closeModal} onRestart={restartGame}/>
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