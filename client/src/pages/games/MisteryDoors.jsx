import React, {useState, useEffect} from 'react';
import Title from "@/components/Title";
import Button from "@/components/Button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import {cherryBomb} from "@/styles/fonts";
import {useRouter} from "next/router";
import {useTranslation} from "react-i18next";
import ErrorReportModal from "@/components/ErrorModal";
import CongratsModal from "@/components/CongratsModal";
import GameOverModal from "@/components/GameOverModal";

const MisteryDoorsGame = () => {
    const [showStartScreen, setShowStartScreen] = useState(true);
    const [gameState, setGameState] = useState('playing');
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [problem, setProblem] = useState(null);
    const [doors, setDoors] = useState([]);
    const [lives, setLives] = useState(3);
    const [vaultCode, setVaultCode] = useState([]);
    const [vaultGuess, setVaultGuess] = useState(['', '', '']);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [showFeedback, setShowFeedback] = useState(false);
    const [difficulty, setDifficulty] = useState("easy");
    const router = useRouter();
    const {t} = useTranslation();

    const MAX_LEVELS = 5;

    useEffect(() => {
        fetchDifficulty();
    }, []);

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

    const getVariableEquationText = (a, operator, answer, result) => {
        if (operator === '+') {
            return `${a} + ? = ${result}`;
        } else if (operator === '-') {
            return `${a} - ? = ${a - answer}`;
        } else if (operator === '×') {
            return `${a} ÷ ? = ${result}`;
        }
    };

    const generateProblem = (difficultyLevel = difficulty) => {
        let a, b, operator, result;
        let operators;
        let maxNumber;
        let variableMode = false;

        switch (difficultyLevel) {
            case 'hard':
                variableMode = Math.random() > 0.5;
                operators = ['+', '-', '×'];
                maxNumber = 99;
                break;
            case 'medium':
                operators = ['+', '-', '×'];
                maxNumber = 99;
                break;
            default:
                operators = ['+', '-'];
                maxNumber = 9;
                break;
        }

        operator = operators[Math.floor(Math.random() * operators.length)];

        if (variableMode) {
            if (operator === '+') {
                result = Math.floor(Math.random() * 50) + 10;
                a = Math.floor(Math.random() * (result - 1)) + 1;
                b = result - a;
            } else if (operator === '-') {
                a = Math.floor(Math.random() * 50) + 10;
                b = Math.floor(Math.random() * (a - 1)) + 1;
                result = b;
            } else if (operator === '×') {
                b = Math.floor(Math.random() * 9) + 2;
                result = Math.floor(Math.random() * 10) + 2;
                a = b * result;
            }

            return {
                text: getVariableEquationText(a, operator, b, result),
                correctAnswer: b,
                a,
                b,
                operator,
                isVariable: true
            };
        } else {
            if (difficultyLevel === 'easy') {
                if (operator === '+') {
                    a = Math.floor(Math.random() * 9) + 1;
                    b = Math.floor(Math.random() * 9) + 1;
                    result = a + b;
                } else if (operator === '-') {
                    a = Math.floor(Math.random() * 9) + 1;
                    b = Math.floor(Math.random() * a) + 1;
                    result = a - b;
                }
            } else if (difficultyLevel === 'medium') {
                if (operator === '+') {
                    a = Math.floor(Math.random() * 90) + 10;
                    b = Math.floor(Math.random() * 90) + 10;
                    result = a + b;
                } else if (operator === '-') {
                    a = Math.floor(Math.random() * 90) + 10;
                    b = Math.floor(Math.random() * a) + 1;
                    if (b < 10) b = Math.floor(Math.random() * 90) + 10;
                    if (b > a) [a, b] = [b, a];
                    result = a - b;
                } else if (operator === '×') {
                    a = Math.floor(Math.random() * 9) + 1;
                    b = Math.floor(Math.random() * 9) + 1;
                    result = a * b;
                }
            } else {
                if (operator === '+') {
                    a = Math.floor(Math.random() * 90) + 10;
                    b = Math.floor(Math.random() * 90) + 10;
                    result = a + b;
                } else if (operator === '-') {
                    a = Math.floor(Math.random() * 90) + 10;
                    b = Math.floor(Math.random() * 90) + 10;
                    if (b > a) [a, b] = [b, a];
                    result = a - b;
                } else if (operator === '×') {
                    a = Math.floor(Math.random() * 12) + 2;
                    b = Math.floor(Math.random() * 12) + 2;
                    result = a * b;
                }
            }

            return {
                text: `${a} ${operator} ${b}`,
                correctAnswer: result,
                a,
                b,
                operator,
                isVariable: false
            };
        }
    };

    const correctDoorsGenerator = (correctAnswer) => {
        const doorOptions = [correctAnswer];

        while (doorOptions.length < 3) {
            let offset;
            if (difficulty === 'easy') {
                offset = Math.floor(Math.random() * 3) + 1;
            } else if (difficulty === 'medium') {
                offset = Math.floor(Math.random() * 5) + 1;
            } else {
                offset = Math.floor(Math.random() * 10) + 1;
            }

            const wrongAnswer = Math.random() > 0.5
                ? correctAnswer + offset
                : correctAnswer - offset;

            if (wrongAnswer >= 0 && !doorOptions.includes(wrongAnswer)) {
                doorOptions.push(wrongAnswer);
            }
        }

        return doorOptions.sort(() => Math.random() - 0.5);
    };

    const startLevel = () => {
        const newProblem = generateProblem(difficulty);
        setProblem(newProblem);

        const correctAns = newProblem.isVariable ? newProblem.b : newProblem.correctAnswer;
        setDoors(correctDoorsGenerator(correctAns));
        setShowFeedback(false);
    };

    const generateVaultCode = () => {
        const codes = [];
        if (difficulty === 'easy') {
            for (let i = 0; i < 3; i++) {
                const a = Math.floor(Math.random() * 5) + 1;
                const b = Math.floor(Math.random() * 5) + 1;
                codes.push({
                    text: `${a} + ${b}`,
                    answer: a + b
                });
            }
        } else if (difficulty === 'medium') {
            for (let i = 0; i < 3; i++) {
                if (i % 3 === 0) {
                    const a = Math.floor(Math.random() * 9) + 1;
                    const b = Math.floor(Math.random() * 9) + 1;
                    codes.push({
                        text: `${a} + ${b}`,
                        answer: a + b
                    });
                } else if (i % 3 === 1) {
                    const b = Math.floor(Math.random() * 5) + 1;
                    const a = Math.floor(Math.random() * 5) + b + 1;
                    codes.push({
                        text: `${a} - ${b}`,
                        answer: a - b
                    });
                } else {
                    const a = Math.floor(Math.random() * 5) + 1;
                    const b = Math.floor(Math.random() * 5) + 1;
                    codes.push({
                        text: `${a} × ${b}`,
                        answer: a * b
                    });
                }
            }
        } else {
            for (let i = 0; i < 3; i++) {
                if (i % 3 === 0) {
                    const a = Math.floor(Math.random() * 9) + 1;
                    const b = Math.floor(Math.random() * 9) + 1;
                    const c = Math.floor(Math.random() * 9) + 1;
                    codes.push({
                        text: `${a} + ${b} + ${c}`,
                        answer: a + b + c
                    });
                } else if (i % 3 === 1) {
                    const a = Math.floor(Math.random() * 5) + 2;
                    const b = Math.floor(Math.random() * 5) + 2;
                    codes.push({
                        text: `${a} × ${b}`,
                        answer: a * b
                    });
                } else {
                    const a = Math.floor(Math.random() * 5) + 2;
                    const b = Math.floor(Math.random() * 5) + 2;
                    const c = Math.floor(Math.random() * 3) + 1;
                    codes.push({
                        text: `${a} × ${b} - ${c}`,
                        answer: a * b - c
                    });
                }
            }
        }

        setVaultCode(codes);
    };

    const handleDoorSelect = (selectedAnswer) => {
        const correctAnswer = problem.isVariable ? problem.b : problem.correctAnswer;

        if (selectedAnswer === correctAnswer) {
            const newScore = score + 5;
            setScore(newScore);
            setFeedbackMessage(t('misterydoors.correct'));
            setShowFeedback(true);

            setTimeout(() => {
                if (level >= MAX_LEVELS) {
                    generateVaultCode();
                    setGameState('vault');
                } else {
                    setLevel(level + 1);
                    startLevel();
                }
            }, 3000);
        } else {
            setLives(lives - 1);
            setFeedbackMessage(t('misterydoors.incorrect'));
            setShowFeedback(true);

            setTimeout(() => {
                if (lives <= 1) {
                    setGameState('lose');
                } else if (level < MAX_LEVELS) {
                    setLevel(level + 1);
                    startLevel();
                } else {
                    generateVaultCode();
                    setGameState('vault');
                }
            }, 3000);
        }
    };
    const handleVaultInputChange = (index, value) => {
        const newGuess = [...vaultGuess];
        newGuess[index] = value;
        setVaultGuess(newGuess);
    };

    const checkVaultCode = () => {
        const isCorrect = vaultGuess.every((guess, index) => {
            return parseInt(guess) === vaultCode[index].answer;
        });

        if (isCorrect) {
            const newScore = score + 25;
            setScore(newScore);
            saveScore(newScore);
            setFeedbackMessage(t('misterydoors.vaultCorrect'));
        } else {
            setFeedbackMessage(t('misterydoors.vaultIncorrect'));
        }
        setGameState('win');
    };

    const saveScore = (newScore) => {
        try {
            const previousURL = localStorage.getItem("previousURL");
            if (previousURL) {
                const url = new URL(previousURL);
                const gameData = url.searchParams.get("Game");
                const age = url.searchParams.get("Age");

                if (gameData && age) {
                    const key = `${gameData}_${age}_bestScore`;
                    const storedScore = parseInt(localStorage.getItem(key) || "0", 10);

                    if (newScore > storedScore) {
                        localStorage.setItem(key, newScore.toString());
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

    const takeSmallReward = () => {
        saveScore(score);
        setFeedbackMessage(t('misterydoors.completedDungeon'));
        setGameState('win');
    };

    const startGame = () => {
        setShowStartScreen(false);
        setGameState('playing');
        startLevel();
    };

    useEffect(() => {
        if (gameState === 'playing' && !showStartScreen) {
            startLevel();
        }
    }, [level, gameState, showStartScreen]);

    const restartGame = () => {
        setLevel(1);
        setScore(0);
        setLives(3);
        setGameState('playing');
        setFeedbackMessage('');
        setShowFeedback(false);
        setShowStartScreen(true);
    };

    const onCloseMessage = () => {
        router.back();
    };

    return (
        <div className="app min-h-screen flex flex-col bg-PS-main-purple">
            <Header></Header>
            <main className="bg-PS-main-purple w-dvw h-dvh flex flex-col justify-center items-center">
                <Title>Maths Dungeon</Title>
                {gameState !== 'win' && gameState !== 'lose' && (
                    <div className="mt-4 mb-2 relative w-[1150px] flex justify-between">
                        <Button size="small" onClick={() => router.back()}> {t("backButton")} </Button>
                        <ErrorReportModal></ErrorReportModal>
                    </div>
                )}
                <div
                    className="relative w-[1200px] h-[968px] bg-violet-700 rounded-lg overflow-hidden border-4 border-stone-700 mb-5">
                    {showStartScreen && (
                        <div
                            className="absolute inset-0 flex flex-col items-center justify-center bg-stone-800 text-center p-6">
                            <div
                                className="bg-stone-700 p-8 rounded-lg border-4 border-yellow-500 shadow-2xl text-center max-w-2xl">
                                <h2 className={`text-5xl font-bold mb-8 text-yellow-400 ${cherryBomb.className}`}>{t('misterydoors.introduction.briefInstructions')}</h2>

                                <div className="mb-8 space-y-6">
                                    <p className="text-2xl font-bold mb-4 text-white">{t('misterydoors.introduction.ventureMessage')}</p>

                                    <div className="bg-stone-600 p-6 rounded-lg text-left">
                                        <h3 className="text-xl font-bold text-yellow-400 mb-2">{t('misterydoors.introduction.howToPlay')}:</h3>
                                        <ul className="list-disc pl-5 space-y-2 text-white">
                                            <li>{t('misterydoors.introduction.solveOperations')}</li>
                                            <li>{t('misterydoors.introduction.chooseDoor')}</li>
                                            <li>{t('misterydoors.introduction.completeLevels')}</li>
                                            <li>{t('misterydoors.introduction.watchOut')}</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="flex justify-center">
                                    <button
                                        onClick={startGame}
                                        className={`cursor-pointer w-64 h-15 text-2xl rounded-2xl border-2 border-b-8
                                            border-PS-light-black hover:bg-orange-400 hover:border-none 
                                            bg-PS-dark-yellow font-black shadow-md text-PS-light-black
                                            focus:outline-none ${cherryBomb.className}`}
                                    >
                                        {t('startButton')}
                                    </button>
                                </div>
                            </div>

                            <div className="absolute top-20 right-20">
                                <div className="w-20 h-16 bg-amber-700 rounded-t-lg border-2 border-amber-500 relative">
                                    <div
                                        className="absolute -top-2 left-0 right-0 h-4 bg-amber-900 border-2 border-amber-500 rounded-t-lg"></div>
                                    <div
                                        className="absolute top-6 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-yellow-300 rounded-full border border-yellow-600"></div>
                                </div>
                            </div>

                            <div className="absolute bottom-20 left-20">
                                <div className="w-20 h-16 bg-amber-700 rounded-t-lg border-2 border-amber-500 relative">
                                    <div
                                        className="absolute -top-2 left-0 right-0 h-4 bg-amber-900 border-2 border-amber-500 rounded-t-lg"></div>
                                    <div
                                        className="absolute top-6 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-yellow-300 rounded-full border border-yellow-600"></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {!showStartScreen && gameState === 'playing' && (
                        <>
                            <div
                                className="absolute text-2xl top-0 left-0 w-full bg-purple-900 bg-opacity-70 p-2 flex justify-between">
                                <div className="font-bold">{t('misterydoors.level')}: {level}/{MAX_LEVELS}</div>
                                <div className="font-bold">{t('misterydoors.score')}: {score}</div>
                                <div className="flex items-center">
                                    <div className="text-red-500 font-bold mr-2">
                                        {Array(lives).fill('❤️').join(' ')}
                                    </div>
                                </div>
                            </div>

                            <div
                                className="absolute text-xl top-12 left-0 w-full text-center font-bold bg-purple-900 bg-opacity-70 p-2">
                                {showFeedback ? feedbackMessage : t('misterydoors.chooseDoor')}
                            </div>

                            <div className="absolute mt-8 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-3/4">
                                <div className="text-4xl font-bold text-white text-center mb-8">
                                    {problem && problem.text}
                                </div>

                                {!showFeedback && (
                                    <div className="flex justify-center gap-6">
                                        {doors.map((answer, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleDoorSelect(answer)}
                                                className="w-24 h-40 bg-amber-800 hover:bg-amber-700 text-white text-xl
                                                font-bold rounded-t-lg flex flex-col items-center justify-end transition-colors
                                                relative overflow-hidden"
                                            >
                                                <div
                                                    className="absolute top-1/4 w-6 h-6 rounded-full bg-amber-900 border-2 border-amber-600"></div>
                                                <div className="mt-auto mb-6">{answer}</div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {!showStartScreen && gameState === 'vault' && (
                        <div
                            className="absolute inset-0 flex flex-col items-center justify-center bg-stone-800 text-center p-6">
                            <h2 className="text-3xl font-bold text-yellow-400 mb-6">{t('misterydoors.vault.title')}</h2>
                            <div className="bg-stone-700 p-6 rounded-lg mb-8 w-3/4">
                                <p className="text-white text-lg mb-6">{t('misterydoors.vault.subtitle')}:</p>

                                <div className="flex justify-center gap-8 mb-8">
                                    <button
                                        className={`cursor-pointer w-64 h-20 text-2xl rounded-2xl border-2 border-b-8
                                            border-PS-light-black hover:bg-orange-400 hover:border-none 
                                            bg-PS-dark-yellow font-black shadow-md text-PS-light-black
                                            focus:outline-none ${cherryBomb.className}`}
                                        onClick={takeSmallReward}
                                    >
                                        {t('misterydoors.vault.take')} {score} {t('misterydoors.vault.leave')}
                                    </button>
                                    <div className="text-white text-2xl font-bold flex items-center">{t('misterydoors.vault.or')}</div>
                                    <div
                                        className={`cursor-pointer w-64 h-20 text-2xl rounded-2xl border-2 border-b-8
                                            border-PS-light-black hover:bg-orange-400 hover:border-none 
                                            bg-PS-dark-yellow font-black shadow-md text-PS-light-black
                                            focus:outline-none ${cherryBomb.className}`}
                                        onClick={() => {
                                        }}
                                    >
                                        {t('misterydoors.vault.tryOpen')}
                                    </div>
                                </div>

                                <div className="bg-stone-600 p-6 rounded-lg">
                                    <h3 className="text-2xl font-bold text-white mb-4">{t('misterydoors.vault.safeCode')}</h3>
                                    <p className="text-white mb-4">{t('misterydoors.vault.solve')}:</p>

                                    <div className="flex justify-center gap-6 mb-6">
                                        {vaultCode.map((code, index) => (
                                            <div key={index} className="bg-stone-700 p-4 rounded-lg">
                                                <div className="text-xl font-bold text-yellow-400 mb-2">{code.text} =
                                                    ?
                                                </div>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="9"
                                                    value={vaultGuess[index]}
                                                    onChange={(e) => handleVaultInputChange(index, e.target.value)}
                                                    className="w-16 h-16 text-center text-2xl font-bold bg-stone-800 text-white border-2 border-yellow-500 rounded-lg"
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <Button
                                        size="large"
                                        onClick={checkVaultCode}
                                        disabled={vaultGuess.some(guess => guess === '')}
                                    >
                                        Open the safe
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {!showStartScreen && gameState === 'win' && (
                        <CongratsModal
                            points={score}
                            onCloseMessage={onCloseMessage}
                            onRestart={restartGame}
                        />
                    )}

                    {!showStartScreen && gameState === 'lose' && (
                        <GameOverModal
                            onCloseMessage={onCloseMessage}
                            onRestart={restartGame}
                        />
                    )}
                </div>
            </main>
            <Footer></Footer>
        </div>
    );
};

export default MisteryDoorsGame;