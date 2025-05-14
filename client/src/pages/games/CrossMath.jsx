import React, {useState, useEffect} from 'react';
import {useRouter} from 'next/router';
import Header from "@/components/Header";
import Title from "@/components/Title";
import Button from "@/components/Button";
import ErrorReportModal from "@/components/ErrorModal";
import Footer from "@/components/Footer";
import CongratsModal from "@/components/CongratsModal";
import GameOverModal from "@/components/GameOverModal";
import saveGameData from "@/StorageServices/SaveDataFinishedGame";

export default function CrossMaths() {
    const router = useRouter();

    const getInitialDifficulty = () => {
        const previousURL = localStorage.getItem('previousURL');
        if (previousURL) {
            const urlParams = new URLSearchParams(new URL(previousURL).search);
            const ageParam = urlParams.get("Age");
            return ageParam || 'easy';
        }
        return 'easy';
    };

    const [puzzle, setPuzzle] = useState(null);
    const [message, setMessage] = useState('');
    const [isComplete, setIsComplete] = useState(false);
    const [difficulty] = useState(getInitialDifficulty);
    const [previousOperators, setPreviousOperators] = useState({
        topOperator: '',
        middleOperator: '',
        bottomOperator: ''
    });
    const [lives, setLives] = useState(3);
    const [cellStatuses, setCellStatuses] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [points, setPoints] = useState(0);

    useEffect(() => {
        resetGame();
    }, [difficulty]);

    const ranges = {
        easy: {min: 1, max: 9, operators: ['+', '-']},
        medium: {min: 10, max: 99, operators: ['+', '-']},
        hard: {min: 1, max: 31, operators: ['*', '/']}
    };


    const generateRandomPuzzle = () => {
        const {min, max, operators} = ranges[difficulty] || ranges.easy;

        const getRandomOperator = (prevOperator) => {
            if (operators.length <= 2) return operators[Math.floor(Math.random() * operators.length)];
            const availableOperators = operators.filter(op => op !== prevOperator);
            return availableOperators[Math.floor(Math.random() * availableOperators.length)];
        };

        const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

        const getDivisiblePair = (maxValue) => {
            const divisor = getRandomNumber(2, Math.min(10, maxValue));
            const result = getRandomNumber(1, Math.min(15, Math.floor(maxValue / divisor)));
            const dividend = divisor * result;
            return {dividend, divisor, result};
        };

        const maxAttempts = 5000;
        let attempts = 0;

        const topOperator = getRandomOperator(previousOperators.topOperator);
        const middleOperator = getRandomOperator(previousOperators.middleOperator);
        const bottomOperator = getRandomOperator(previousOperators.bottomOperator);

        while (attempts < maxAttempts) {
            attempts++;
            try {
                let topLeft, topMiddle, topRight;
                if (topOperator === '+') {
                    topLeft = getRandomNumber(min, max);
                    topMiddle = getRandomNumber(min, max);
                    topRight = topLeft + topMiddle;
                } else if (topOperator === '-') {
                    topRight = getRandomNumber(min, max);
                    topMiddle = getRandomNumber(min, max);
                    topLeft = topRight + topMiddle;
                } else if (topOperator === '*') {
                    topLeft = getRandomNumber(1, Math.min(9, max));
                    topMiddle = getRandomNumber(1, Math.min(9, max));
                    topRight = topLeft * topMiddle;
                } else if (topOperator === '/') {
                    const division = getDivisiblePair(max);
                    topLeft = division.dividend;
                    topMiddle = division.divisor;
                    topRight = division.result;
                }

                if (topRight > max * 3) continue;

                const verticalDiff = getRandomNumber(1, Math.min(5, Math.floor(topLeft / 2)));
                const midLeft = topLeft - verticalDiff;
                const bottomLeft = verticalDiff;

                if (bottomLeft <= 0) continue;

                let midMid, bottomMiddle;
                if (middleOperator === '+') {
                    midMid = getRandomNumber(min, max);
                    bottomMiddle = topMiddle + midMid;
                } else if (middleOperator === '-') {
                    midMid = getRandomNumber(min, Math.min(topMiddle - 1, max));
                    bottomMiddle = topMiddle - midMid;
                } else if (middleOperator === '*') {
                    midMid = getRandomNumber(1, 9);
                    bottomMiddle = topMiddle * midMid;
                } else if (middleOperator === '/') {
                    if (topMiddle <= 1) continue;
                    const divisors = [];
                    for (let i = 1; i <= topMiddle; i++) {
                        if (topMiddle % i === 0) divisors.push(i);
                    }
                    if (divisors.length <= 1) continue;
                    midMid = divisors[getRandomNumber(1, divisors.length - 1)];
                    bottomMiddle = topMiddle / midMid;
                }

                if (bottomMiddle <= 0 || midMid <= 0) continue;
                if (difficulty !== 'hard' && (bottomMiddle > max * 2 || midMid > max)) continue;

                let horizontalResult;
                if (middleOperator === '+') {
                    horizontalResult = midLeft + midMid;
                } else if (middleOperator === '-') {
                    horizontalResult = midLeft - midMid;
                    if (horizontalResult <= 0) continue;
                } else if (middleOperator === '*') {
                    horizontalResult = midLeft * midMid;
                } else if (middleOperator === '/') {
                    if (midLeft % midMid !== 0) continue;
                    horizontalResult = midLeft / midMid;
                }

                if (horizontalResult <= 0) continue;
                if (difficulty !== 'hard' && horizontalResult > max) continue;

                let bottomRight;
                if (middleOperator === '+') {
                    bottomRight = topRight + horizontalResult;
                } else if (middleOperator === '-') {
                    bottomRight = topRight - horizontalResult;
                    if (bottomRight <= 0) continue;
                } else if (middleOperator === '*') {
                    bottomRight = topRight * horizontalResult;
                } else if (middleOperator === '/') {
                    if (topRight % horizontalResult !== 0) continue;
                    bottomRight = topRight / horizontalResult;
                }

                if (bottomRight <= 0) continue;

                let fifthRowValid = false;
                if (bottomOperator === '+') {
                    fifthRowValid = bottomLeft + bottomMiddle === bottomRight;
                } else if (bottomOperator === '-') {
                    fifthRowValid = bottomLeft - bottomMiddle === bottomRight;
                } else if (bottomOperator === '*') {
                    fifthRowValid = bottomLeft * bottomMiddle === bottomRight;
                } else if (bottomOperator === '/') {
                    fifthRowValid = bottomLeft / bottomMiddle === bottomRight && Number.isInteger(bottomRight);
                }

                if (!fifthRowValid) continue;

                if (difficulty === 'hard' && (
                    bottomRight > 200 || horizontalResult > 100 ||
                    bottomMiddle > 100 || midMid > 15 ||
                    topRight > 100
                )) {
                    continue;
                }

                setPreviousOperators({
                    topOperator,
                    middleOperator,
                    bottomOperator
                });

                return [
                    [
                        {value: '', solution: topLeft.toString(), isFixed: false},
                        {value: topOperator, isFixed: true},
                        {value: topMiddle.toString(), isFixed: true},
                        {value: '=', isFixed: true},
                        {value: '', solution: topRight.toString(), isFixed: false},
                    ],
                    [
                        {value: '-', isFixed: true},
                        {value: '', isFixed: true},
                        {value: middleOperator, isFixed: true},
                        {value: '', isFixed: true},
                        {value: middleOperator, isFixed: true},
                    ],
                    [
                        {value: '', solution: midLeft.toString(), isFixed: false},
                        {value: middleOperator, isFixed: true},
                        {value: '', solution: midMid.toString(), isFixed: false},
                        {value: '=', isFixed: true},
                        {value: horizontalResult.toString(), isFixed: true},
                    ],
                    [
                        {value: '=', isFixed: true},
                        {value: '', isFixed: true},
                        {value: '=', isFixed: true},
                        {value: '', isFixed: true},
                        {value: '=', isFixed: true},
                    ],
                    [
                        {value: bottomLeft.toString(), solution: bottomLeft.toString(), isFixed: true},
                        {value: bottomOperator, isFixed: true},
                        {value: bottomMiddle.toString(), isFixed: true},
                        {value: '=', isFixed: true},
                        {value: '', solution: bottomRight.toString(), isFixed: false},
                    ],
                ];
            } catch (error) {
                console.log(`Intento ${attempts} fallido: ${error.message}`);
                continue;
            }
        }

        console.warn(`No se pudo generar puzzle para dificultad ${difficulty} después de ${maxAttempts} intentos`);
        if (difficulty === 'hard') {
            console.warn('Generando puzzle simple para modo hard');
            return generateSimpleHardPuzzle();
        } else {
            setMessage('No se pudo generar un puzzle válido. Intenta de nuevo.');
            return null;
        }
    };

    const handleCellChange = (row, col, value) => {
        const cleanedValue = value.trim().replace(/[^0-9]/g, '');
        if (cleanedValue.length > 3) return;

        const newPuzzle = puzzle.map(r => r.map(c => ({...c})));
        newPuzzle[row][col].value = cleanedValue;
        setPuzzle(newPuzzle);
    };

    const verifyPuzzle = () => {
        const newCellStatuses = {};
        let incorrectCount = 0;
        let correctCount = 0;
        let pointsChange = 0;

        solutionCells.forEach(([r, c]) => {
            const userValue = puzzle[r][c].value.trim();
            const correctValue = puzzle[r][c].solution.trim();
            const isCorrect = userValue === correctValue;

            if (userValue !== '') {
                newCellStatuses[`${r}-${c}`] = isCorrect;
                if (isCorrect) {
                    correctCount++;
                    if (cellStatuses[`${r}-${c}`] !== true) {
                        pointsChange += cellStatuses[`${r}-${c}`] === false ? 1 : 10;
                    }
                } else {
                    incorrectCount++;
                    pointsChange -= 5;
                    newCellStatuses[`${r}-${c}`] = false;
                }
            }
        });

        const newPoints = Math.max(0, points + pointsChange);
        setPoints(newPoints);
        setCellStatuses(newCellStatuses);

        if (incorrectCount > 0) {
            const newLives = Math.max(0, lives - incorrectCount);
            setLives(newLives);
            setMessage(`Incorrect cells: ${incorrectCount}. Lives remaining: ${newLives}. Points: ${newPoints}`);
            if (newLives === 0) {
                setMessage(`Game Over! No lives remaining. Final Points: ${newPoints}`);
                setShowModal(true);
                setIsComplete(true);
            }
        } else {
            const allFilled = solutionCells.every(([r, c]) => puzzle[r][c].value !== '');
            if (allFilled && Object.values(newCellStatuses).every(status => status)) {
                setMessage(`Congratulations! You completed the CrossMaths correctly. Points: ${newPoints}`);
                setShowModal(true);
                setIsComplete(true);
            } else {
                setMessage(`All cells correct so far. Fill in all cells to complete. Points: ${newPoints}`);
            }
        }
    };

    const solutionCells = [
        [0, 0], [0, 4], [2, 0], [2, 2], [4, 4],
    ];

    const resetGame = () => {
        saveGameData();
        let attempts = 0;
        const maxAttempts = 3;

        const tryGeneratePuzzle = () => {
            try {
                const newPuzzle = generateRandomPuzzle();
                if (newPuzzle) {
                    setPuzzle(newPuzzle);
                    setMessage('');
                    setIsComplete(false);
                    setPoints(0);
                    setCellStatuses({});
                    setLives(3);
                } else {
                    throw new Error('Puzzle generation failed');
                }
            } catch (error) {
                console.error(error);
                attempts++;

                if (attempts < maxAttempts) {
                    setTimeout(tryGeneratePuzzle, 500);
                } else {
                    setMessage('Error al generar el puzzle. Inténtalo de nuevo.');
                }
            }
        };
        tryGeneratePuzzle();
    };

    function solveSystem(a, d, e) {
        const b = a - e;
        if (!Number.isInteger(b) || b <= 0) return null;
        const c = a * b;
        if (e === 1) {
            return null;
        }
        const denominator = e - 1;
        if (a % denominator !== 0) {
            return null;
        }
        const wCandidate = a / denominator;
        if (wCandidate < ranges.hard.min || wCandidate > ranges.hard.max || !Number.isInteger(wCandidate)) {
            return null;
        }
        const w = Math.floor(wCandidate);
        const y = d * w;
        const x = b * w;
        const z = e * x;
        return {a, b, c, d, e, w, x, y, z};
    }

    const generateSimpleHardPuzzle = () => {
        const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

        const topLeft = getRandomNumber(ranges.hard.min, ranges["hard"].max);

        const verticalDiff = getRandomNumber(1, Math.min(5, Math.floor(topLeft / 2)));
        const midLeft = topLeft - verticalDiff;
        const bottomLeft = verticalDiff;

        const {b:topMiddle, c: topRight, w:midMid, y:horizontalResult, x:bottomMiddle, z:bottomRight} = solveSystem(topLeft, midLeft, bottomLeft);

        const topOperator = '*';
        const middleOperator = '*';
        const bottomOperator = '*';

        setPreviousOperators({
            topOperator,
            middleOperator,
            bottomOperator
        });
        return [
            [
                {value: '', solution: topLeft.toString(), isFixed: false},
                {value: topOperator, isFixed: true},
                {value: topMiddle.toString(), isFixed: true},
                {value: '=', isFixed: true},
                {value: '', solution: topRight.toString(), isFixed: false},
            ],
            [
                {value: '-', isFixed: true},
                {value: '', isFixed: true},
                {value: middleOperator, isFixed: true},
                {value: '', isFixed: true},
                {value: '+', isFixed: true},
            ],
            [
                {value: '', solution: midLeft.toString(), isFixed: false},
                {value: middleOperator, isFixed: true},
                {value: '', solution: midMid.toString(), isFixed: false},
                {value: '=', isFixed: true},
                {value: horizontalResult.toString(), isFixed: true},
            ],
            [
                {value: '=', isFixed: true},
                {value: '', isFixed: true},
                {value: '=', isFixed: true},
                {value: '', isFixed: true},
                {value: '=', isFixed: true},
            ],
            [
                {value: bottomLeft.toString(), isFixed: true},
                {value: bottomOperator, isFixed: true},
                {value: bottomMiddle.toString(), isFixed: true},
                {value: '=', isFixed: true},
                {value: '', solution: bottomRight.toString(), isFixed: false},
            ],
        ];
    };

    if (!puzzle) {
        return <div className="min-h-screen flex items-center justify-center text-white">Cargando...</div>;
    }

    const closeModal = () => {
        setShowModal(false);
        saveScore();
        setTimeout(() => {
            router.back();
        }, 0);
    };

    return (
        <div className="min-h-screen flex flex-col bg-PS-main-purple text-white">
            <Header/>
            <section className="flex flex-col items-center py-10 flex-grow">
                <Title>Cross Math</Title>
                <div className="mt-4 mb-2 w-full max-w-3xl flex justify-between px-4">
                    <Button size="small" onClick={() => router.back()}>
                        Back
                    </Button>
                    <ErrorReportModal/>
                </div>

                <div className="mt-4 mb-2 w-full max-w-3xl flex justify-between px-4">
                    <div className="text-2xl">Score: {points}</div>
                    <div className="flex items-center">
                        {[...Array(lives)].map((_, i) => (
                            <span key={i} className="text-3xl mx-1">❤️</span>
                        ))}
                        {[...Array(3 - lives)].map((_, i) => (
                            <span key={i + lives} className="text-3xl mx-1 text-gray-500">🖤</span>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-5 gap-1 mb-4 w-[500px] mt-6">
                    {puzzle.map((row, rowIndex) =>
                        row.map((cell, colIndex) => {
                            const cellKey = `${rowIndex}-${colIndex}`;
                            const isCorrect = cellStatuses[cellKey] === true;
                            const isIncorrect = cellStatuses[cellKey] === false;
                            const border = isCorrect
                                ? 'border-green-500 border-6'
                                : isIncorrect
                                    ? 'border-red-500 border-6'
                                    : 'border-gray-400 border-2';

                            return (
                                <div
                                    key={cellKey}
                                    className={`w-24 h-24 flex items-center justify-center rounded
                                ${cell.isFixed ? 'bg-gray-700 text-white' : 'bg-white text-black'}
                                ${border}`}
                                >
                                    {cell.isFixed ? (
                                        <span className="font-bold text-4xl">{cell.value}</span>
                                    ) : (
                                        <input
                                            type="text"
                                            value={cell.value}
                                            onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                                            className="w-full h-full text-center bg-transparent outline-none text-4xl"
                                            disabled={isComplete}
                                            aria-label={`Cell ${rowIndex}-${colIndex}`}
                                            maxLength={3}
                                        />
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
                {message && showModal && message.includes('Congratulations') && (
                    <CongratsModal
                        points={points}
                        onCloseMessage={closeModal}
                        onRestart={resetGame}
                    />
                )}
                {lives === 0 && showModal && (
                    <GameOverModal
                        points={points}
                        onCloseMessage={closeModal}
                        onRestart={resetGame}
                    />
                )}

                <div className="flex flex-col gap-2 mt-4">
                    {!isComplete && (
                        <Button size="small" onClick={() => verifyPuzzle()}>
                            Verify
                        </Button>
                    )}
                </div>
            </section>
            <Footer/>
        </div>
    );
}