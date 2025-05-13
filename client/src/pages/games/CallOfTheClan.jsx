import {cherryBomb} from '@/styles/fonts';
import React, {useState, useEffect, useCallback, useRef} from 'react';
import Button from "@/components/Button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import {router} from "next/client";
import LoadingPage from "@/components/LoadingPage";


const AnimalClassificationGame = () => {
    const [difficulty, setDifficulty] = useState("easy");
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [maxScore, setMaxScore] = useState(0);
    const [gameActive, setGameActive] = useState(true);
    const [gameFinished, setGameFinished] = useState(false);
    const [gameLoaded, setGameLoaded] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [message, setMessage] = useState('Move your animal to the correct group!');
    const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 50 });
    const [allLevels, setAllLevels] = useState([]);
    const [currentLevel, setCurrentLevel] = useState(null);
    const [randomLevels, setRandomLevels] = useState([]);

    const newLevelSound = useRef(null);
    const failSound = useRef(null);
    const winSound = useRef(null);
    const loseSound = useRef(null);

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

    async function fetchLevels() {
        const response = await fetch('http://localhost:8080/api/calloftheclan');
        if (response.ok) {
            const data = await response.json();
            return data;
        }
    }

    useEffect(() => {
        async function loadData() {
            try {
                const levelResponse = await fetchLevels();
                const levels = levelResponse?.allLevels || [];
                setAllLevels(levels);
                await fetchDifficulty();
            } catch (err) {
                console.error("Error loading data:", err);
            }
        }

        loadData();
    }, []);

    useEffect(() => {
        if (allLevels.length > 0 && difficulty) {
            const selectedRandomLevels = selectRandomLevels(difficulty);
            setRandomLevels(selectedRandomLevels);
            console.log("Niveles seleccionados: ", selectedRandomLevels); // Verifica los niveles seleccionados
            const initialLevel = selectedRandomLevels[Math.min(level - 1, selectedRandomLevels.length - 1)];
            setCurrentLevel(initialLevel);
            setGameLoaded(true);
        }
    }, [allLevels, difficulty]);

    useEffect(() => {
        if (randomLevels.length > 0 && level > 0) {
            const newCurrentLevel = randomLevels[Math.min(level - 1, randomLevels.length - 1)];
            setCurrentLevel(newCurrentLevel);
        }
    }, [randomLevels, level]);

    function selectRandomLevels(difficulty) {
        const shuffled = [...allLevels].sort(() => 0.5 - Math.random());
        if (difficulty === "hard") return shuffled.slice(0, 6);
        if (difficulty === "medium") return shuffled.slice(0, 5);
        return shuffled.slice(0, 4);
    }

    const handleKeyDown = useCallback((e) => {
        if (!gameActive) return;

        const speed = 5;
        const key = e.key.toLowerCase();

        if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
            e.preventDefault();
        }

        setPlayerPosition(prev => {
            let newX = prev.x;
            let newY = prev.y;

            switch (e.key.toLowerCase()) {
                case 'w':
                case 'arrowup':
                    newY = Math.max(18, prev.y - speed);
                    break;
                case 's':
                case 'arrowdown':
                    newY = Math.min(96, prev.y + speed);
                    break;
                case 'a':
                case 'arrowleft':
                    newX = Math.max(3, prev.x - speed);
                    break;
                case 'd':
                case 'arrowright':
                    newX = Math.min(97, prev.x + speed);
                    break;
            }

            return { x: newX, y: newY };
        });
    }, [gameActive]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    useEffect(() => {
        if (!gameActive || !currentLevel) return;

        currentLevel.groups.forEach(group => {
            const distance = Math.hypot(playerPosition.x - group.position.x, playerPosition.y - group.position.y);

            if (distance < 10) {
                setGameActive(false);

                const correct = group.classification === currentLevel.player.classification;

                if (correct) {
                    setMessage(`Correct! ${currentLevel.player.name} and ${group.name} are ${group.classification}s.`);
                    const newScore = score + 100;
                    setScore(newScore);

                    if (level === randomLevels.length) {
                        setGameFinished(true);
                        if (newScore > maxScore) {
                            setMaxScore(newScore);
                        }
                        if ((newScore >= 200 && difficulty === "easy") ||
                            (newScore >= 300 && difficulty === "medium") ||
                            (newScore >= 450 && difficulty === "hard")) {
                            setGameWon(true);
                            winSound.current.play();
                            }
                        else {
                            loseSound.current.play();
                        }
                    } else {
                        setTimeout(() => {
                            setLevel(prev => prev + 1);
                            setPlayerPosition({ x: 50, y: 50 });
                            setGameActive(true);
                            newLevelSound.current.play()
                            setMessage('Move your animal to the correct group!');
                        }, 2000);
                    }
                } else {
                    setMessage(`Incorrect! ${currentLevel.player.name} is a ${currentLevel.player.classification}, but ${group.name} are ${group.classification}s.`);
                    setScore(prev => prev - 50);
                    setTimeout(() => {
                        setPlayerPosition({ x: 50, y: 50 });
                        setGameActive(true);
                        failSound.current.play()
                        setMessage('Try again! Find the correct group.');
                    }, 2000);
                }
            }
        });
    }, [playerPosition, gameActive, currentLevel, level, randomLevels.length]);

    const restartGame = () => {
        setRandomLevels(selectRandomLevels(difficulty));
        setLevel(1);
        setScore(0);
        setPlayerPosition({ x: 50, y: 50 });
        setGameActive(true);
        setMessage('Move your animal to the correct group!');
        setGameFinished(false);
        setGameWon(false);
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
                    if (maxScore > storedScore) {
                        localStorage.setItem(key, maxScore.toString());
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

    if (randomLevels.length === 0) return <LoadingPage></LoadingPage>

    return (
        !gameLoaded ?
            <LoadingPage></LoadingPage>
        :
        <section className="app min-h-screen flex flex-col bg-PS-main-purple">
            <Header />

            <main className="flex-1 flex flex-col items-center px-4 relative">
                <div className="relative w-[1000px] h-[600px] bg-blue-200 rounded-lg overflow-hidden border-4 border-blue-950 mt-5 mb-3">
                    <div className={`text-2xl justify-between p-1.5 w-full text-black flex ${cherryBomb.className}`}>
                        <div>Level: {level}/{randomLevels.length}</div>
                        <div>Score: {score}</div>
                    </div>

                    <div className={`absolute text-xl top-12 w-full text-center bg-blue-700
                     bg-opacity-70 p-2`}>
                        {message}
                    </div>

                    <div
                        className="absolute text-5xl transition-all duration-100 transform -translate-x-1/2 -translate-y-1/2"
                        style={{ left: `${playerPosition.x}%`, top: `${playerPosition.y}%` }}
                    >
                        <img src={currentLevel.player.emoji} alt={currentLevel.player.name} className={"w16 h-16"}/>
                    </div>

                    {currentLevel.groups.map((group, index) => (
                        <div
                            key={index}
                            className="absolute text-5xl transform -translate-x-1/2 -translate-y-1/2"
                            style={{ left: `${group.position.x}%`, top: `${group.position.y}%` }}
                        >
                            <div className="flex flex-col items-center text-black">

                                <span className="text-6xl mb-2"><img src={group.emoji} alt={group.name} className={"w16 h-16"}/></span>
                                <span className="bg-white bg-opacity-70 px-2 py-1 rounded text-sm">
                  {group.name}
                </span>
                            </div>
                        </div>
                    ))}

                    {(gameWon && gameFinished) && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-blue-400 text-black">
                            <div className={"flex flex-col items-center justify-between w-80 h-50 mb-5 bg-sky-500 border-sky-600 border-4 rounded-2xl"}>
                                <h2 className={`text-4xl font-bold mt-4 animate-bounce ${cherryBomb.className}`}>Congratulations!</h2>
                                <p className="text-2xl mb-6 animate-pulse">You won a medal! 🏅</p>
                                <p className="text-xl mb-8 text-green-800">Final score: {score}</p>
                            </div>
                            <Button size="large" onClick={restartGame}>Play Again</Button>
                            <Button size="large" onClick={finishGame}>Finish game</Button>
                        </div>
                    )}

                    {(!gameWon && gameFinished) && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-blue-400 text-black">
                            <div className={"flex flex-col items-center justify-between w-80 h-50 mb-7 bg-sky-500 border-sky-600 border-4 rounded-2xl"}>
                                <h2 className={`text-4xl font-bold mt-4 ${cherryBomb.className}`}>Game Over</h2>
                                <p className="text-2xl mb-6 animate-pulse">Keep trying!</p>
                                <p className="text-xl mb-8 text-red-600">Final score: {score}</p>
                            </div>
                            <Button size="large" onClick={restartGame}>Try Again</Button>
                            <Button size="large" onClick={finishGame} className="mt-2">Finish game</Button>
                        </div>
                    )}

                </div>
                {!gameFinished && (
                    <div className="mt-4 mb-2 relative flex">
                        <Button size="small" onClick={finishGame}>Back</Button>
                    </div>
                )}
                <audio ref={newLevelSound} src="/sounds/CallOfTheClan/newlevel-calloftheclan.mp3" preload="auto" />
                <audio ref={failSound} src="/sounds/CallOfTheClan/fail-calloftheclan.mp3" preload="auto" />
                <audio ref={winSound} src="/sounds/CallOfTheClan/won-calloftheclan.mp3" preload="auto" />
                <audio ref={loseSound} src="/sounds/CallOfTheClan/lost-calloftheclan.mp3" preload="auto" />
            </main>

            <Footer />
        </section>
    );
};

export default AnimalClassificationGame;
