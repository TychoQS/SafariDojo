import React, { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Lifes from "@/components/Lifes";
import {router} from "next/client";
import {t} from "i18next";
import Button from "@/components/Button";
import CongratsModal from "@/components/CongratsModal";
import GameOverModal from "@/components/GameOverModal";


function initialCards(cardsDiff) {
    const allPairs = [
        { id: 1, content: "/images/Games/Science/Memory/mano.png", match: "Hand" },
        { id: 2, content: "/images/Games/Science/Memory/pie.avif", match: "Feet" },
        { id: 3, content: "/images/Games/Science/Memory/oreja.avif", match: "Ear" },
        { id: 4, content: "/images/Games/Science/Memory/nariz.avif", match: "Nose" },
        { id: 5, content: "/images/Games/Science/Memory/ojo.png", match: "Eye" },
        { id: 6, content: "/images/Games/Science/Memory/boca.png", match: "Mouth" },
        { id: 7, content: "/images/Games/Science/Memory/tobillo.png", match: "Ankle" },
        { id: 8, content: "/images/Games/Science/Memory/pierna.avif", match: "Leg" },
        { id: 9, content: "/images/Games/Science/Memory/brazo.avif", match: "Arm" },
        { id: 10, content: "/images/Games/Science/Memory/cerebro.png", match: "Brain" },
        { id: 11, content: "/images/Games/Science/Memory/corazon.png", match: "Heart" }
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
        setLives(5);
        lifesRef.current?.resetHearts();
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
                    const storedScore = parseInt(localStorage.getItem(key) || "0", 10);
                    if (bestScore > storedScore) {
                        localStorage.setItem(key, bestScore.toString());
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

    return (
        <div className="app min-h-screen flex flex-col bg-PS-main-purple">
            <Header />
            <main className="flex-1 flex flex-col justify-start px-4 relative">
            <div className="flex items-center justify-between">
                <Button size="small" onClick={() => router.back()}> {t("backButton")} </Button>
                <div className={"ml-8 mt-6 text-4xl"}>
                    Score: {score}
                </div>
                <Lifes ref={lifesRef}/>
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
                                    {isFlipped ? (
                                        typeof card.value === "string" && card.value.startsWith("/images") ? (
                                            <img src={card.value} alt="Card" className="w-24 h-24 object-contain" />
                                        ) : (
                                            <span>{card.value}</span>
                                        )
                                    ) : "?"}
                                </div>
                            );
                        })}
                    </div>
                )}

                {matched.length === cards.length / 2 && (
                    <CongratsModal onCloseMessage={finishGame} onRestart={restartGame} points={score}/>
                )}
                {gameOver && (
                    <GameOverModal onCloseMessage={finishGame} onRestart={restartGame} points={score}/>
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
