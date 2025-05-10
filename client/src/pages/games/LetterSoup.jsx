import React, {useState, useEffect} from 'react';
import Title from "@/components/Title";
import Header from "@/components/Header";
import Button from "@/components/Button";
import Link from "next/link";
import Footer from "@/components/Footer";
import {useRouter} from "next/router";
import CongratsModal from "@/components/CongratsModal";
import {useTranslation} from "react-i18next";

export default function LetterSoup() {
    const [words, setWords] = useState([]);
    const [difficulty, setDifficulty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [gameCompleted, setGameCompleted] = useState(false);
    const directions = [
        [1, 0], [0, 1], [1, 1], [-1, 0], [0, -1], [-1, -1], [1, -1], [-1, 1]
    ];
    const {t} = useTranslation();

    const [grid, setGrid] = useState([]);
    const [selectedCells, setSelectedCells] = useState([]);
    const [foundWords, setFoundWords] = useState([]);
    const [foundWordCells, setFoundWordCells] = useState([]);
    const [isSelecting, setIsSelecting] = useState(false);
    const [currentWord, setCurrentWord] = useState("");
    const [message, setMessage] = useState("");
    const [currentDirection, setCurrentDirection] = useState(null);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [points, setPoints] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();

    const fetchLetterSoupData = async (diff) => {
        if (!diff) return;
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/api/getLetterSoup?Difficulty=${diff}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setGrid(data.grid);
            setWords(data.words);
            setFoundWords([]);
            setFoundWordCells([]);
            setTimeElapsed(0);
            setPoints(0);
            setShowModal(false);
        } catch (err) {
            console.error('Fetch error:', err);
            setError(err.message);
            setMessage(`Failed to load game data: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const previousURL = localStorage.getItem("previousURL");
        let initialDifficulty = 'easy';
        if (previousURL) {
            const url = new URL(previousURL);
            const difficultyFromURL = url.searchParams.get("Age");
            if (['easy', 'medium', 'hard'].includes(difficultyFromURL)) {
                initialDifficulty = difficultyFromURL;
            }
        }
        setDifficulty(initialDifficulty);
        fetchLetterSoupData(initialDifficulty);
    }, []);

    useEffect(() => {
        let timer;
        if (!loading && !error && !showModal) {
            timer = setInterval(() => {
                setTimeElapsed((prev) => prev + 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [loading, error, showModal]);

    const calculatePoints = (seconds) => {
        const minutes = 90;
        if (seconds <= minutes) {
            return 50;
        }
        const extraSeconds = seconds - minutes;
        const deductions = Math.floor(extraSeconds / 30) * 5;
        return Math.max(50 - deductions, 0);
    };

    useEffect(() => {
        if (foundWords.length === words.length && words.length > 0 && !showModal && !gameCompleted) {
            setMessage("Congrats! You found all the words.");
            setShowModal(true);
            setPoints(calculatePoints(timeElapsed));
            setGameCompleted(true);
        }
    }, [foundWords, words, timeElapsed, showModal, gameCompleted]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const isWordFound = (word) => foundWords.includes(word);

    const getSelectedText = () => selectedCells.map(([row, col]) => grid[row][col]).join("");

    const startSelection = (row, col) => {
        setIsSelecting(true);
        setSelectedCells([[row, col]]);
        setCurrentWord(grid[row][col]);
        setCurrentDirection(null);
    };

    const continueSelection = (row, col) => {
        if (!isSelecting) return;

        const lastCell = selectedCells[selectedCells.length - 1];

        if (selectedCells.length > 1) {
            const secondLastCell = selectedCells[selectedCells.length - 2];
            if (row === secondLastCell[0] && col === secondLastCell[1]) {
                const newSelectedCells = selectedCells.slice(0, -1);
                setSelectedCells(newSelectedCells);
                setCurrentWord(currentWord.slice(0, -1));
                if (newSelectedCells.length === 1) {
                    setCurrentDirection(null);
                }
                return;
            }
        }

        if (selectedCells.length > 1 && currentDirection) {
            const [dx, dy] = currentDirection;
            const expectedRow = lastCell[0] + dx;
            const expectedCol = lastCell[1] + dy;
            if (row !== expectedRow || col !== expectedCol) {
                return;
            }
        } else if (selectedCells.length === 1) {
            const dx = row - lastCell[0];
            const dy = col - lastCell[1];
            const isValidDirection = directions.some(([dirX, dirY]) => dirX === dx && dirY === dy);
            if (!isValidDirection) {
                return;
            }
            setCurrentDirection([dx, dy]);
        }

        const isAlreadySelected = selectedCells.some(([r, c]) => r === row && c === col);
        if (!isAlreadySelected) {
            setSelectedCells([...selectedCells, [row, col]]);
            setCurrentWord(currentWord + grid[row][col]);
        }
    };

    const endSelection = () => {
        setIsSelecting(false);
        setCurrentDirection(null);
        const selectedText = getSelectedText();

        if (words.includes(selectedText) && !isWordFound(selectedText)) {
            setFoundWords([...foundWords, selectedText]);

            setFoundWordCells([...foundWordCells, ...selectedCells]);
            setMessage(`${t("letterSoup.done")}: '${selectedText}'`);
            setTimeout(() => setMessage(""), 5000);
        } else if (isWordFound(selectedText)) {
            setMessage("You already found this word!");
            setTimeout(() => setMessage(""), 5000);
        } else {
            setMessage("");
        }

        setSelectedCells([]);
        setCurrentWord("");
    };

    const saveScore = () => {
        try {
            const previousURL = localStorage.getItem("previousURL");
            if (previousURL) {
                const url = new URL(previousURL);
                const gameData = url.searchParams.get("Game");
                const age = url.searchParams.get("Age");

                if (gameData && age) {
                    const key = `${gameData}_${age}_bestScore`;
                    const storedScore = parseInt(localStorage.getItem(key) || "0", 10);

                    if (points > storedScore) {
                        localStorage.setItem(key, points.toString());
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
            console.error("Error processing score or medal update:", error);
        }
    }

    const closeModal = () => {
        setShowModal(false);
        saveScore();
        setTimeout(() => {
            router.back();
        }, 0);
    };

    const handleMouseDown = (row, col) => startSelection(row, col);
    const handleMouseEnter = (row, col) => continueSelection(row, col);
    const handleMouseUp = () => endSelection();

    const isCellSelected = (row, col) => selectedCells.some(([r, c]) => r === row && c === col);
    const isCellInFoundWord = (row, col) => foundWordCells.some(([r, c]) => r === row && c === col);

    const handleRetry = () => {
        setGameCompleted(false);
        fetchLetterSoupData(difficulty);
    };

    const playAgain = () => {
        setShowModal(false);
        saveScore();
        fetchLetterSoupData(difficulty);
    }

    if (loading) {
        return (
            <div className="app min-h-screen flex flex-col bg-PS-main-purple">
                <Header/>
                <main className="bg-PS-main-purple w-dvw h-[768px] mb-7 flex flex-col justify-center items-center">
                    <Title>Loading...</Title>
                </main>
                <Footer/>
            </div>
        );
    }

    if (error) {
        return (
            <div className="app min-h-screen flex flex-col bg-PS-main-purple">
                <Header/>
                <main className="bg-PS-main-purple w-dvw h-[768px] mb-7 flex flex-col justify-center items-center">
                    <Title>Error</Title>
                    <p className="text-red-500 mb-4">{error}</p>
                    <Button onClick={handleRetry}>Retry</Button>
                </main>
                <Footer/>
            </div>
        );
    }

    return (
        <div className="app min-h-screen flex flex-col bg-PS-main-purple">
            <Header></Header>
            <section className=" justify-center items-center mb-7 flex flex-col  py-10 bg-PS-main-purple">
                <Title>Letter Soup</Title>
                <Link href={{pathname: "../GameSelectionPage", query: {Subject: "English"}}}>
                    <div className="mt-4 mb-2 relative w-[1150px] flex justify-start">
                        <Button size="small">{t("backButton")}</Button>
                    </div>
                </Link>
                <div className="flex flex-row items-start justify-between p-4 max-w-6xl mx-auto bg-pink-50
                                rounded-lg shadow-lg h-full border-4 border-stone-700"
                     style={{maxHeight: '620px', width: '1200px'}}
                >
                    <div className="w-3/5">
                        <div
                            className="grid grid-cols-11 gap-2 mt-2 mb-6 bg-white p-4 rounded-lg shadow"
                        >
                            {grid.map((row, rowIndex) => (
                                row.map((letter, colIndex) => (
                                    <div
                                        key={`${rowIndex}-${colIndex}`}
                                        className={`w-9 h-9 flex items-center justify-center rounded cursor-pointer select-none text-lg text-white font-medium
                                            ${isCellSelected(rowIndex, colIndex) ? 'bg-blue-400 text-white' :
                                            isCellInFoundWord(rowIndex, colIndex) ? 'bg-green-300 line-through' : 'bg-blue-200'}`}
                                        onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                                        onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                                        onMouseUp={handleMouseUp}
                                    >
                                        {letter}
                                    </div>
                                ))
                            ))}
                        </div>
                        {message && (
                            <div className="animate-fade-in-out mb-2 text-lg font-medium text-green-600 text-center">
                                {message}
                            </div>
                        )}
                    </div>

                    <div className="w-2/5 pl-6 flex flex-col h-full mt-2">
                        <div className="bg-white p-6 rounded-lg shadow mb-4">
                            <h2 className="text-2xl text-center font-semibold mb-4 text-pink-800">{t('letterSoup.subtitle')}</h2>

                            <div className="grid grid-cols-2 gap-3">
                                {words.map((word, index) => (
                                    <div
                                        key={index}
                                        className={`px-3 py-2 rounded-full text-center ${isWordFound(word) ? 'bg-green-500 text-white line-through animate-found-pulse' : 'bg-gray-200 text-gray-700'}`}
                                    >
                                        {word}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow flex flex-col items-center">
                            <div className="text-2xl text-gray-600 font-bold mb-2">{t('letterSoup.progress')}</div>
                            <div className="text-2xl font-bold text-pink-800">
                                {foundWords.length} <span
                                className="text-gray-600 font-medium">/</span> {words.length}
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-4 mt-3">
                                <div
                                    className="bg-pink-600 h-4 rounded-full transition-all duration-500 ease-in-out shadow-md"
                                    style={{width: `${(foundWords.length / words.length) * 100}%`}}
                                ></div>
                            </div>
                            <div className="text-lg text-gray-600 font-medium mt-3">
                                {t('letterSoup.time')}: <span
                                className="font-bold text-pink-800">{formatTime(timeElapsed)}</span>
                            </div>
                            {showModal && (
                                <CongratsModal
                                    points={points}
                                    onCloseMessage={closeModal}
                                    onRestart={playAgain}
                                />
                            )}

                        </div>
                    </div>
                </div>
            </section>
            <Footer></Footer>
        </div>
    );
}