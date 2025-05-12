import {cherryBomb} from '@/styles/fonts';
import React, {useState, useEffect, useCallback, useRef} from 'react';
import Button from "@/components/Button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import levelsData from "../../../../database/jsondata/CallOfTheClan.json";
import {router} from "next/client";
import GameOverModal from "@/components/GameOverModal";
import CongratsModal from "@/components/CongratsModal";
import Lifes from "@/components/Lifes";
import Title from "@/components/Title";
import ErrorReportModal from "@/components/ErrorModal";
import {useTranslation} from "react-i18next";


const AnimalClassificationGame = () => {
    const [difficulty, setDifficulty] = useState("easy");
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [maxScore, setMaxScore] = useState(0);
    const [gameActive, setGameActive] = useState(true);
    const [gameFinished, setGameFinished] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [message, setMessage] = useState('Move your animal to the correct group!');
    const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 50 });
    const allLevels = levelsData.allLevels;
    const [randomLevels, setRandomLevels] = useState([]);

    const lifesRef = useRef(null);
    const [lives, setLives] = useState(5);

    const newLevelSound = useRef(null);
    const failSound = useRef(null);
    const winSound = useRef(null);
    const loseSound = useRef(null);
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
        fetchDifficulty();
    }, []);

    useEffect(() => {
        if (difficulty) {
            setRandomLevels(selectRandomLevels(difficulty));
        }
    }, [difficulty]);

    useEffect(() => {
        if (lives === 0) {
            if (maxScore < score) {
                setMaxScore(score);
            }
            setGameFinished(true);
            loseSound.current.play();
        }
    }, [lives]);

    function selectRandomLevels(difficulty) {
        const shuffled = [...allLevels].sort(() => 0.5 - Math.random());
        if (difficulty === "hard") {
            return shuffled.slice(0, 6);
        }

        if (difficulty === "medium") {
            return shuffled.slice(0, 5);
        }

        return shuffled.slice(0, 4);
    }

    const currentLevel = randomLevels[Math.min(level - 1, randomLevels.length - 1)] || allLevels[0];

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
                    const newScore = score + 5;
                    setScore(newScore);

                    if (level === randomLevels.length) {
                        setGameFinished(true);
                        if (newScore > maxScore) {
                            setMaxScore(newScore);
                        }
                        setGameWon(true);
                        winSound.current.play();
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
                    if (lives === 0) {
                        setGameFinished(true);
                        if (score > maxScore) {
                            setMaxScore(score);
                        }
                        loseSound.current.play();
                    }
                    setMessage(`Incorrect! ${currentLevel.player.name} is a ${currentLevel.player.classification}, but ${group.name} are ${group.classification}s.`);
                    setScore(prev => prev - 2);
                    setTimeout(() => {
                        setPlayerPosition({ x: 50, y: 50 });
                        setGameActive(true);
                        setLives(lives - 1);
                        lifesRef.current.loseLife();
                        failSound.current.play();
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
        setLives(5);
        lifesRef.current?.resetHearts();
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

    if (randomLevels.length === 0) return <div>Loading game...</div>;

    return (
        <div className="app min-h-screen flex flex-col bg-PS-main-purple">
            <Header/>
            <section className="flex-1 flex justify-center items-center py-10">
                <div className="w-full max-w-screen-lg px-4 flex flex-col items-center">
                    <div className="mt-[-4em]">
                        <Title>Call of the Clan</Title>
                    </div>

                    <div className="relative w-[90em] mb-[-2em] flex justify-around">
                        <Button size="small" onClick={finishGame}>{t("backButton")} </Button>
                        <Lifes ref={lifesRef}/>
                        <ErrorReportModal></ErrorReportModal>
                    </div>

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
                            <CongratsModal onCloseMessage={finishGame} onRestart={restartGame} points={score}/>
                        )}

                        {(!gameWon && gameFinished) && (
                            <GameOverModal onCloseMessage={finishGame} onRestart={restartGame}/>
                        )}

                    </div>
                    <audio ref={newLevelSound} src="/sounds/CallOfTheClan/newlevel-calloftheclan.mp3" preload="auto" />
                    <audio ref={failSound} src="/sounds/CallOfTheClan/fail-calloftheclan.mp3" preload="auto" />
                    <audio ref={winSound} src="/sounds/CallOfTheClan/won-calloftheclan.mp3" preload="auto" />
                    <audio ref={loseSound} src="/sounds/CallOfTheClan/lost-calloftheclan.mp3" preload="auto" />
                </div>
            </section>
            <Footer/>
        </div>
    );
};

export default AnimalClassificationGame;