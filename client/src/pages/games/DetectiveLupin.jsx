import React, { useState, useEffect, useRef } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Lifes from "@/components/Lifes";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import CongratsModal from "@/components/CongratsModal";
import GameOverModal from "@/components/GameOverModal";
import Button from "@/components/Button";
import ErrorReportModal from "@/components/ErrorModal";

function fetchPaintings(difficulty = 'easy') {
    return fetch(`http://localhost:8080/api/getPaintings?` + new URLSearchParams({
        difficulty: difficulty.toLowerCase()
    }), {
        method: "GET",
        headers: {'Content-Type': 'application/json'},
    });
}

function DetectiveLupin() {
    const { t } = useTranslation();

    const [letterSlots, setLetterSlots] = useState([]);
    const [selectedSlotIndex, setSelectedSlotIndex] = useState(-1);
    const [currentLetter, setCurrentLetter] = useState("");

    const [waiting, setWaiting] = useState(false);
    const [score, setScore] = useState(0);

    const [bestScore, setBestScore] = useState(0);
    const [tries, setTries] = useState(5);

    const [gameFinished, setGameFinished] = useState(false);
    const [gamePaintings, setGamePaintings] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const lifesRef = useRef(null);

    let currentPainting = gamePaintings[currentIndex];

    const router = useRouter();
    const fetchGameData = async () => {
        if (!router.isReady) return;
        let difficulty = router.query.Age || "easy";
        const response = await fetchPaintings(difficulty);
        if (response.ok) {
            let fetchedPaintings = await response.json();
            fetchedPaintings.sort(() => 0.5 - Math.random());
            setGamePaintings(fetchedPaintings.slice(0,7));
        }
    }

    useEffect(() => {
        if (router.isReady) {
            fetchGameData().then(() => {
                console.log("Loaded game countries");
            });
            setCurrentIndex(0);
        }
    }, [router.isReady, router.query.Age]);

    useEffect(() => {
        if (currentPainting) {
            setupLetterSlots(currentPainting.name);
        }
    }, [currentPainting]);

    // Función para configurar los slots de letras con algunas ya rellenadas
    const setupLetterSlots = (paintingName) => {
        const name = paintingName.trim();
        const slots = [];

        // Establecer 50% de letras reveladas para todas las dificultades
        const revealPercentage = 0.5;

        // Crear array de índices y mezclarlo aleatoriamente
        const indices = Array.from({ length: name.length }, (_, i) => i);
        indices.sort(() => 0.5 - Math.random());

        // Calcular cuántas letras revelar
        const lettersToReveal = Math.max(1, Math.floor(name.length * revealPercentage));
        const revealIndices = new Set(indices.slice(0, lettersToReveal));

        // Crear slots
        for (let i = 0; i < name.length; i++) {
            const isRevealed = revealIndices.has(i);
            const char = name[i];

            // Tratar espacios y caracteres especiales
            if (char === " " || char === "-" || char === "." || char === "," || char === "'") {
                slots.push({
                    letter: char,
                    isRevealed: true,
                    isSpecial: true
                });
            } else {
                slots.push({
                    letter: char,
                    isRevealed: isRevealed,
                    isSpecial: false
                });
            }
        }

        setLetterSlots(slots);
        setSelectedSlotIndex(-1);
        setCurrentLetter("");
    };

    const handleSlotClick = (index) => {
        if (letterSlots[index].isRevealed || waiting) return;

        setSelectedSlotIndex(index);
        setCurrentLetter("");
    };

    const handleLetterInput = (e) => {
        if (selectedSlotIndex === -1) return;

        const letter = e.target.value.slice(-1).toUpperCase();
        setCurrentLetter(letter);

        // Actualizar el slot automáticamente al ingresar una letra
        if (letter) {
            const newSlots = [...letterSlots];
            newSlots[selectedSlotIndex] = {
                ...newSlots[selectedSlotIndex],
                enteredLetter: letter
            };
            setLetterSlots(newSlots);

            // Mover automáticamente al siguiente slot disponible
            moveToNextEmptySlot();
        }
    };

    const handleKeyDown = (e) => {
        // Si presiona Enter, validar la respuesta
        if (e.key === "Enter") {
            checkAnswer();
            return;
        }

        // Si presiona Backspace, borrar la letra actual
        if (e.key === "Backspace") {
            if (currentLetter) {
                // Si hay una letra en el input actual, borrarla
                setCurrentLetter("");
            } else {
                // Si no hay letra en el input actual, borrar la letra del slot seleccionado
                // y mantener el mismo slot seleccionado
                const newSlots = [...letterSlots];
                if (newSlots[selectedSlotIndex]) {
                    newSlots[selectedSlotIndex] = {
                        ...newSlots[selectedSlotIndex],
                        enteredLetter: ""
                    };
                    setLetterSlots(newSlots);
                }

                // Si no hay letra en el slot actual, moverse al slot anterior
                if (!currentLetter && selectedSlotIndex > 0) {
                    moveToPreviousEmptySlot();
                }
            }
        }
    };

    const moveToPreviousEmptySlot = () => {
        // Buscar el slot anterior que no sea revelado o especial
        for (let i = selectedSlotIndex - 1; i >= 0; i--) {
            if (!letterSlots[i].isRevealed && !letterSlots[i].isSpecial) {
                setSelectedSlotIndex(i);
                setCurrentLetter(letterSlots[i].enteredLetter || "");
                return;
            }
        }
    };

    const moveToNextEmptySlot = () => {
        const nextEmptyIndex = letterSlots.findIndex((slot, index) =>
            index > selectedSlotIndex && !slot.isRevealed && !slot.isSpecial
        );

        if (nextEmptyIndex !== -1) {
            setSelectedSlotIndex(nextEmptyIndex);
            setCurrentLetter("");
        } else {
            // Si no hay más slots vacíos, verificar si se completaron todos
            const allSlotsFilled = letterSlots.every(slot =>
                slot.isRevealed || slot.isSpecial || slot.enteredLetter
            );

            if (allSlotsFilled) {
                checkAnswer();
            } else {
                // Buscar el primer slot vacío desde el principio
                const firstEmptyIndex = letterSlots.findIndex(slot =>
                    !slot.isRevealed && !slot.isSpecial && !slot.enteredLetter
                );

                if (firstEmptyIndex !== -1) {
                    setSelectedSlotIndex(firstEmptyIndex);
                    setCurrentLetter("");
                }
            }
        }
    };

    const checkAnswer = () => {
        if (gameFinished) return;

        // Verificar si todas las letras ingresadas son correctas
        const isCorrect = letterSlots.every((slot, index) => {
            if (slot.isRevealed || slot.isSpecial) return true;
            return slot.enteredLetter && slot.enteredLetter.toUpperCase() === slot.letter.toUpperCase();
        });

        if (isCorrect) {
            setScore(prevScore => prevScore + 5);
        } else {
            lifesRef.current.loseLife();
            setTries(prev => prev - 1);
        }

        if (currentIndex === gamePaintings.length - 1) {
            setGameFinished(true);
            setBestScore(Math.max(bestScore, score));
            setWaiting(false);
        } else {
            setWaiting(true);
        }
    };

    function getMessage() {
        const isCorrect = letterSlots.every((slot, index) => {
            if (slot.isRevealed || slot.isSpecial) return true;
            return slot.enteredLetter && slot.enteredLetter.toUpperCase() === slot.letter.toUpperCase();
        });

        if (!isCorrect)
            return (
                <div className="flex flex-col items-center justify-center text-center gap-5">
                    <p className="flex flex-col text-red-600 text-2xl">Incorrect</p>
                    <p className="flex flex-col text-black text-xl">Actual Name:
                        <span className="font-bold text-2xl text-blue-600">{gamePaintings[currentIndex]?.name}</span></p>
                </div>
            );
        else
            return (
                <div className="flex flex-col items-center justify-center gap-5">
                    <p className="flex flex-col text-green-600 text-2xl">Correct</p>
                </div>
            );
    }

    function nextGame() {
        setCurrentIndex(prev => prev + 1);
        setWaiting(false);
    }

    function restartGame() {
        fetchGameData().then(() => {console.log("Game paintings loaded")});
        setCurrentIndex(0);
        setTries(5);
        setScore(0);
        if (lifesRef.current) lifesRef.current.resetHearts();
        setGameFinished(false);
        setWaiting(false);
    }

    const closeModal = () => {
        saveScore();
        setTimeout(() => {
            router.back();
        }, 0);
    };

    const playAgain = () => {
        saveScore();
        restartGame();
    }

    function saveScore() {
        try {
            const gameTitle = "Detective Lupin";
            const age = router.query.Age;
            if (age) {
                const key = `${gameTitle}_${age}_bestScore`;
                const storesScore = parseInt(localStorage.getItem(key) || "0", 10);
                if (score > storesScore) {
                    localStorage.setItem(key, score.toString());
                }
            }

            const currentScore = parseInt(localStorage.getItem(`${gameTitle}_${age}_bestScore`) || "0", 10);
            const medalType = age === "easy"
                ? "BronzeMedal" : age === "medium" ? "SilverMedal" : "GoldMedal";
            const medalKey = `${gameTitle}_${medalType}`;
            const medalStatus = localStorage.getItem(medalKey) === "1";
            if (!medalStatus && currentScore > (gamePaintings.length - 2 * 5)) {
                localStorage.setItem(medalKey, "1");
            }
        } catch (error) {
            console.error("Error processing score update: ", error);
        }
    }

    return (
        <div className="app min-h-screen flex flex-col bg-PS-main-purple">
            <Header />
            <section className="min-h-screen flex flex-col justify-evenly bg-PS-main-purple">
                <div className="w-full max-w-6xl mx-auto flex flex-col mt-8 px-4">
                    {!gameFinished && (
                        <div className="w-full relative mb-4 h-10 flex items-center">
                            <div className="absolute left-0">
                                <Button size="small" onClick={() => router.back()}>
                                    {t("backButton")}
                                </Button>
                            </div>
                            <div className="absolute left-1/2 -translate-x-1/2"><Lifes ref={lifesRef} /></div>
                            <div className="absolute right-0"><ErrorReportModal /></div>
                        </div>
                    )}

                    <div className="flex flex-col self-center items-center justify-evenly border-4 rounded-2xl
                        border-PS-dark-yellow bg-PS-light-yellow p-6 w-full max-w-4xl overflow-hidden">

                        <div className="max-w-96 max-h-80 min-h-50 flex justify-center items-center mb-8 overflow-hidden">
                            <img src={`${currentPainting?.image}`} alt="Painting" className="max-w-full max-h-full object-contain border-4 border-black"/>
                        </div>

                        {/* Slots de letras */}
                        {/* Slots de letras */}
                        <div className="flex flex-wrap justify-center gap-2 mb-6 w-full max-w-4xl px-4 overflow-x-auto">
                            {letterSlots.map((slot, index) => (
                                <div
                                    key={index}
                                    className={`w-10 h-12 flex items-center justify-center text-2xl font-bold text-black
                                        ${slot.isSpecial ? 'border-0' : 'border-2 border-black cursor-pointer'} 
                                        ${selectedSlotIndex === index ? 'bg-yellow-200' : slot.isRevealed ? 'bg-gray-200' : 'bg-white'}
                                        ${slot.isRevealed || slot.isSpecial ? '' : 'hover:bg-yellow-100'}`}
                                    onClick={() => handleSlotClick(index)}
                                >
                                    {slot.isRevealed || slot.isSpecial ? slot.letter : (slot.enteredLetter || "")}
                                </div>
                            ))}
                        </div>

                        {/* Input para la letra actual */}
                        {selectedSlotIndex !== -1 && !waiting && !gameFinished && (
                            <div className="flex flex-col items-center gap-4 mb-6 bg-gray-100 p-4 rounded-lg border border-gray-300">
                                <p className="text-lg font-bold text-black">Enter a letter here:</p>
                                <input
                                    type="text"
                                    value={currentLetter}
                                    onChange={handleLetterInput}
                                    onKeyDown={handleKeyDown}
                                    maxLength={1}
                                    autoFocus
                                    className="w-12 h-12 text-2xl font-bold text-center border-2 border-black bg-white text-black"
                                    placeholder="?"
                                />
                                <p className="text-sm text-black">Use Backspace to delete and Enter to validate</p>
                            </div>
                        )}

                        {(!waiting && !gameFinished && letterSlots.length > 0) && (
                            <button
                                className="cursor-pointer py-2 px-6 rounded-2xl
                                    text-lg border-2 border-[#F67C6E] bg-[#F2C1BB] text-black duration-300 hover:scale-110
                                    hover:bg-[#F67C6E]"
                                onClick={checkAnswer}
                            >
                                Solve
                            </button>
                        )}

                        {(waiting && !gameFinished) && (
                            <div className="flex flex-col items-center gap-6">
                                {getMessage()}
                                <button
                                    className="cursor-pointer py-2 px-6 rounded-2xl
                                        text-lg border-2 border-[#F67C6E] bg-[#F2C1BB] text-black duration-300 hover:scale-110
                                        hover:bg-[#F67C6E]"
                                    onClick={nextGame}
                                >
                                    Next
                                </button>
                            </div>
                        )}

                        {gameFinished && (
                            <CongratsModal
                                points={score}
                                onCloseMessage={closeModal}
                                onRestart={playAgain}
                            />
                        )}

                        {tries === 0 && (
                            <GameOverModal
                                onCloseMessage={closeModal}
                                onRestart={playAgain}
                            />
                        )}

                        <div className="flex items-center justify-center mt-4">
                            <p className="text-black text-2xl font-black">Score: <span className="font-bold text-4xl">{score}</span></p>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}

export default DetectiveLupin;