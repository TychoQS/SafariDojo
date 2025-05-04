import React, {useState, useEffect} from 'react';
import Title from "@/components/Title";
import Button from "@/components/Button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import {cherryBomb} from "@/styles/fonts";

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

    const generateProblem = (difficultyLevel = difficulty) => {
        let a, b, operator, result;
        let operators;
        let maxNumber;

        switch (difficultyLevel) {
            case 'hard':
                operators = ['+', '-', '×', '÷'];
                maxNumber = 100 + level * 10;
                break;
            case 'medium':
                operators = ['+', '-', '×'];
                maxNumber = 50 + level * 5;
                break;
            default:
                operators = ['+', '-'];
                maxNumber = 20 + level * 2;
                break;
        }

        do {
            operator = operators[Math.floor(Math.random() * operators.length)];

            if (operator === '+') {
                a = Math.floor(Math.random() * maxNumber) + 1;
                b = Math.floor(Math.random() * maxNumber) + 1;
                result = a + b;
            } else if (operator === '-') {
                a = Math.floor(Math.random() * maxNumber) + 1;
                b = Math.floor(Math.random() * a) + 1;
                result = a - b;
            } else if (operator === '×') {
                a = Math.floor(Math.random() * (level + 5)) + 1;
                b = Math.floor(Math.random() * (level + 5)) + 1;
                result = a * b;
            } else if (operator === '÷') {
                b = Math.floor(Math.random() * (level + 3)) + 1;
                result = Math.floor(Math.random() * (level + 3)) + 1;
                a = b * result;
            }
        } while (result < 0 || result > 999);

        return {
            text: `${a} ${operator} ${b}`,
            correctAnswer: result,
            a,
            b,
            operator
        };
    };

    const correctDoorsGenerator = (correctAnswer) => {
        const doorOptions = [correctAnswer];

        while (doorOptions.length < 3) {
            const offset = Math.floor(Math.random() * 5) + 1;
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
        setDoors(correctDoorsGenerator(newProblem.correctAnswer));
        setShowFeedback(false);
    };

    const generateVaultCode = () => {
        const codes = [];
        for (let i = 0; i < 3; i++) {
            const a = Math.floor(Math.random() * 10);
            const b = Math.floor(Math.random() * (9 - a)) + 1;
            codes.push({
                text: `${a} + ${b}`,
                answer: a + b
            });
        }
        setVaultCode(codes);
    };

    const handleDoorSelect = (selectedAnswer) => {
        if (selectedAnswer === problem.correctAnswer) {
            const newScore = score + (level * 10);
            setScore(newScore);
            setFeedbackMessage('Well done!');
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
            setFeedbackMessage(`Not at all... Think about it again!`);
            setShowFeedback(true);

            setTimeout(() => {
                if (lives <= 1) {
                    setGameState('lose');
                } else {
                    startLevel();
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
            setScore(score + 100);
            setFeedbackMessage('Awesome! You opened the safe!');
        } else {
            setFeedbackMessage('So close! At least you secured some points.');
        }
        setGameState('win');
    };

    const takeSmallReward = () => {
        setFeedbackMessage('Dungeon completed!');
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

    return (
        <div className="app min-h-screen flex flex-col bg-PS-main-purple">
            <Header></Header>
            <main className="bg-PS-main-purple w-dvw h-dvh flex flex-col justify-center items-center">
                <Title>Maths Dungeon</Title>
                {gameState !== 'win' && gameState !== 'lose' && (
                    <Link href={{pathname: "../GameSelectionPage", query: {Subject: "Maths"}}}>
                        <div className="mt-4 mb-2 relative w-[1200px] flex justify-start">
                            <Button size="small">Back</Button>
                        </div>
                    </Link>
                )}
                <div className="relative w-[1200px] h-[968px] bg-violet-700 rounded-lg overflow-hidden border-4 border-stone-700 mb-5">
                    {showStartScreen && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-800 text-center p-6">
                            <div className="bg-stone-700 p-8 rounded-lg border-4 border-yellow-500 shadow-2xl text-center max-w-2xl">
                                <h2 className={`text-5xl font-bold mb-8 text-yellow-400 ${cherryBomb.className}`}>Brief instructions</h2>

                                <div className="mb-8 space-y-6">
                                    <p className="text-2xl font-bold mb-4 text-white">Venture into the math dungeon!</p>

                                    <div className="bg-stone-600 p-6 rounded-lg text-left">
                                        <h3 className="text-xl font-bold text-yellow-400 mb-2">How to play:</h3>
                                        <ul className="list-disc pl-5 space-y-2 text-white">
                                            <li>Solve operations</li>
                                            <li>Choose the door with the correct answer</li>
                                            <li>Complete 5 levels to earn the prize</li>
                                            <li>Watch out! You only have 3 opportunities</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="flex justify-center">
                                    <button
                                        onClick={startGame}
                                        className={`cursor-pointer w-64 h-20 text-2xl rounded-2xl border-2 border-b-8
                                            border-PS-light-black hover:bg-orange-400 hover:border-none 
                                            bg-PS-dark-yellow font-black shadow-md text-PS-light-black
                                            focus:outline-none ${cherryBomb.className}`}
                                    >
                                        Start playing!
                                    </button>
                                </div>
                            </div>

                            <div className="absolute top-20 right-20">
                                <div className="w-20 h-16 bg-amber-700 rounded-t-lg border-2 border-amber-500 relative">
                                    <div className="absolute -top-2 left-0 right-0 h-4 bg-amber-900 border-2 border-amber-500 rounded-t-lg"></div>
                                    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-yellow-300 rounded-full border border-yellow-600"></div>
                                </div>
                            </div>

                            <div className="absolute bottom-20 left-20">
                                <div className="w-20 h-16 bg-amber-700 rounded-t-lg border-2 border-amber-500 relative">
                                    <div className="absolute -top-2 left-0 right-0 h-4 bg-amber-900 border-2 border-amber-500 rounded-t-lg"></div>
                                    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-yellow-300 rounded-full border border-yellow-600"></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {!showStartScreen && gameState === 'playing' && (
                        <>
                            <div className="absolute text-2xl top-0 left-0 w-full bg-purple-900 bg-opacity-70 p-2 flex justify-between">
                                <div className="font-bold">Level: {level}/{MAX_LEVELS}</div>
                                <div className="font-bold">Score: {score}</div>
                                <div className="flex items-center">
                                    <div className="text-red-500 font-bold mr-2">
                                        {Array(lives).fill('❤️').join(' ')}
                                    </div>
                                </div>
                            </div>

                            <div className="absolute text-xl top-12 left-0 w-full text-center font-bold bg-purple-900 bg-opacity-70 p-2">
                                {showFeedback ? feedbackMessage : 'Which door has the correct answer?'}
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
                                                <div className="absolute top-1/4 w-6 h-6 rounded-full bg-amber-900 border-2 border-amber-600"></div>
                                                <div className="mt-auto mb-6">{answer}</div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="absolute text-xs bottom-4 right-4 bg-gray-600 bg-opacity-70 p-2 rounded text-white">
                                Note: Click on the door with the correct answer
                            </div>
                        </>
                    )}

                    {!showStartScreen && gameState === 'vault' && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-800 text-center p-6">
                            <h2 className="text-3xl font-bold text-yellow-400 mb-6">You reached the end of the dungeon!</h2>
                            <div className="bg-stone-700 p-6 rounded-lg mb-8 w-3/4">
                                <p className="text-white text-lg mb-6">You have 2 options:</p>

                                <div className="flex justify-center gap-8 mb-8">
                                    <button
                                        className={`cursor-pointer w-64 h-20 text-2xl rounded-2xl border-2 border-b-8
                                            border-PS-light-black hover:bg-orange-400 hover:border-none 
                                            bg-PS-dark-yellow font-black shadow-md text-PS-light-black
                                            focus:outline-none ${cherryBomb.className}`}
                                        onClick={takeSmallReward}
                                    >
                                        Take {score} points and leave
                                    </button>
                                    <div className="text-white text-2xl font-bold flex items-center">OR</div>
                                    <button
                                        className={`cursor-pointer w-64 h-20 text-2xl rounded-2xl border-2 border-b-8
                                            border-PS-light-black hover:bg-orange-400 hover:border-none 
                                            bg-PS-dark-yellow font-black shadow-md text-PS-light-black
                                            focus:outline-none ${cherryBomb.className}`}
                                        onClick={() => {}}
                                    >
                                        Try opening the safe (+100 points)
                                    </button>
                                </div>

                                <div className="bg-stone-600 p-6 rounded-lg">
                                    <h3 className="text-2xl font-bold text-white mb-4">Safe code</h3>
                                    <p className="text-white mb-4">Solve these operations to get the big prize:</p>

                                    <div className="flex justify-center gap-6 mb-6">
                                        {vaultCode.map((code, index) => (
                                            <div key={index} className="bg-stone-700 p-4 rounded-lg">
                                                <div className="text-xl font-bold text-yellow-400 mb-2">{code.text} = ?</div>
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
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-violet-700 text-white">
                            <h2 className="text-4xl font-bold mb-4">You Win!</h2>
                            <p className="text-2xl mb-6">{feedbackMessage}</p>
                            <p className="text-xl mb-8">Final score: {score}</p>
                            <Button
                                size={"large"}
                                onClick={restartGame}
                            >
                                Play Again
                            </Button>
                            <Link href={{pathname: "../GameSelectionPage", query: {Subject: "Math"}}} className="mt-2">
                                <Button size="small">Back</Button>
                            </Link>
                        </div>
                    )}

                    {!showStartScreen && gameState === 'lose' && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900 text-black">
                            <h2 className="text-4xl font-bold mb-4 text-white">Game Over!</h2>
                            <p className="text-2xl mb-6 text-white">No lives left...</p>
                            <p className="text-xl mb-8 text-white">Final score: {score}</p>
                            <Button
                                size={"large"}
                                onClick={restartGame}
                            >
                                Try Again
                            </Button>
                            <Link href={{pathname: "../GameSelectionPage", query: {Subject: "Math"}}} className="mt-2">
                                <Button size="small">Back</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </main>
            <Footer></Footer>
        </div>
    );
};

export default MisteryDoorsGame;