import React, { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Lifes from "@/components/Lifes";

const initialCards = () => {
    const pairs = [
        { id: 1, content: "🐶", match: "Perro" },
        { id: 2, content: "🐱", match: "Gato" },
        { id: 3, content: "🚗", match: "Coche" },
        { id: 4, content: "🍎", match: "Manzana" },
        { id: 5, content: "✈️", match: "Avión" },
    ];

    let cards = [];
    pairs.forEach((pair, index) => {
        cards.push({ id: index * 2, value: pair.content, pairId: index });
        cards.push({ id: index * 2 + 1, value: pair.match, pairId: index });
    });

    return cards.sort(() => Math.random() - 0.5);
};

export default function MemoryGame() {
    const [cards, setCards] = useState(initialCards);
    const [selected, setSelected] = useState([]);
    const [matched, setMatched] = useState([]);
    const [mistakes, setMistakes] = useState(0);
    const [lives, setLives] = useState(3);
    const [gameOver, setGameOver] = useState(false);

    const successSound = useRef(null);
    const failSound = useRef(null);
    const winSound = useRef(null);
    const lifesRef = useRef(null);

    useEffect(() => {
        if (selected.length === 2) {
            const [first, second] = selected;
            if (first.pairId === second.pairId) {
                successSound.current.play();
                setMatched((prev) => [...prev, first.pairId]);
                setTimeout(() => setSelected([]), 500);
            } else {
                failSound.current.play();
                setMistakes((prev) => prev + 1);
                setTimeout(() => setSelected([]), 800);
            }
        }
    }, [selected]);

    useEffect(() => {
        if (mistakes === 5) {
            setGameOver(true);
            lifesRef.current.loseLife();
        }
    }, [mistakes]);

    useEffect(() => {
        if (matched.length === cards.length / 2) {
            setTimeout(() => winSound.current.play(), 500);
        }
    }, [matched]);

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

    return (
        <div className="app min-h-screen flex flex-col bg-PS-main-purple">
            <Header />
            <main className="flex-1 flex flex-col justify-start px-4">
            <div className="flex items-center justify-between">
                <div className={`ml-20 text-4xl 
                ${5 - mistakes <= 1 ? "text-red-500 animate-bounce" : "text-white animate-pulse"}`}>
                    Tries remain: {5-mistakes}
                </div>
                <Lifes ref={lifesRef} lives={lives} />
            </div>

            <div className="grid grid-cols-5 gap-10 justify-items-center">
                {cards.map((card) => {
                    const isFlipped =
                        selected.includes(card) || matched.includes(card.pairId);
                    const isMatched = matched.includes(card.pairId);

                    return (
                        <div
                            key={card.id}
                            onClick={() => handleClick(card)}
                            className={`cursor-pointer mt-8 flex items-center justify-center w-75 h-90 border rounded-xl text-xl 
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

            {matched.length === cards.length / 2 && (
                <div className="text-center mt-6 text-green-600 font-bold text-xl animate-bounce">
                    🏅 ¡Felicidades! Has ganado una medalla de élite.
                </div>
            )}

            {gameOver && (
                <div className="text-center mt-6 text-red-500 font-bold text-xl animate-pulse">
                    💀 ¡Has perdido! Vuelve a intentarlo.
                </div>
            )}

            <audio ref={successSound} src="/sounds/correct_answer.mp3" preload="auto" />
            <audio ref={failSound} src="/sounds/fail_answer.mp3" preload="auto" />
            <audio ref={winSound} src="/sounds/win_game.mp3" preload="auto" />
            </main>

            <Footer />
        </div>
    );
}
