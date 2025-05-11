import React, {useState, useEffect} from 'react';
import {useRouter} from 'next/router';
import Header from "@/components/Header";
import Title from "@/components/Title";
import Button from "@/components/Button";
import ErrorReportModal from "@/components/ErrorModal";
import Footer from "@/components/Footer";

export default function CrossMaths() {
    const router = useRouter();
    const [puzzle, setPuzzle] = useState([]);
    const [message, setMessage] = useState('');
    const [isComplete, setIsComplete] = useState(false);
    const [difficulty, setDifficulty] = useState('easy');

    useEffect(() => {
        fetchDifficulty();
    }, []);

    useEffect(() => {
        resetGame();
    }, [difficulty]);

    async function fetchDifficulty() {
        const previousURL = localStorage.getItem('previousURL');
        if (previousURL) {
            const urlParams = new URLSearchParams(new URL(previousURL).search);
            const ageParam = urlParams.get("Age");
            setDifficulty(ageParam || 'easy');
        } else {
            setDifficulty('easy');
        }
    }

    const generateRandomPuzzle = () => {
        const ranges = {
            easy: {min: 1, max: 9, operators: ['+', '-']},
            medium: {min: 1, max: 99, operators: ['+', '-']},
            hard: {min: 1, max: 99, operators: ['*', '/']},
        };

        const {min, max, operators} = ranges[difficulty] || ranges.easy;
        const getRandomOperator = () => operators[Math.floor(Math.random() * operators.length)];
        const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

        const getDivisionNumbers = (maxResult) => {
            let numerator, denominator;
            const useTwoDigit = Math.random() < 0.5;
            if (useTwoDigit) {
                denominator = getRandomNumber(1, 9);
                numerator = denominator * getRandomNumber(1, Math.floor(maxResult / denominator));
            } else {
                denominator = getRandomNumber(1, 9);
                numerator = denominator * getRandomNumber(1, 9);
            }
            if (numerator <= max && numerator % denominator === 0) {
                return {numerator, denominator, result: numerator / denominator};
            }
            return null;
        };

        let attempts = 0;
        const maxAttempts = 500;

        while (attempts < maxAttempts) {
            attempts++;

            const topOperator = getRandomOperator();
            let topLeft, topMiddle, topRight;

            if (topOperator === '+') {
                topMiddle = getRandomNumber(min, Math.floor(max / 2));
                topLeft = getRandomNumber(topMiddle, max - topMiddle);
                topRight = topLeft + topMiddle;
            } else if (topOperator === '-') {
                topRight = getRandomNumber(min, Math.floor(max / 2));
                topLeft = getRandomNumber(topRight + 1, max);
                topMiddle = topLeft - topRight;
            } else if (topOperator === '*') {
                topMiddle = getRandomNumber(1, 9);
                topLeft = getRandomNumber(1, Math.floor(max / topMiddle));
                topRight = topLeft * topMiddle;
            } else if (topOperator === '/') {
                const division = getDivisionNumbers(max);
                if (!division) continue;
                topLeft = division.numerator;
                topMiddle = division.denominator;
                topRight = division.result;
            }

            if (topRight <= 0 || topRight > max * 2 || topMiddle <= 0 || isNaN(topRight)) continue;

            const verticalDiff = getRandomNumber(1, Math.floor(topLeft / 2));
            const midLeft = topLeft - verticalDiff;
            const bottomLeft = midLeft - verticalDiff;

            if (bottomLeft <= 0 || midLeft <= 0) continue;

            const middleOperator = getRandomOperator();
            let midMid, horizontalResult;

            if (middleOperator === '+') {
                horizontalResult = getRandomNumber(1, Math.floor(max / 2));
                midMid = midLeft + horizontalResult;
            } else if (middleOperator === '-') {
                horizontalResult = getRandomNumber(1, midLeft - 1);
                midMid = midLeft - horizontalResult;
            } else if (middleOperator === '*') {
                horizontalResult = getRandomNumber(1, 9);
                midMid = midLeft * horizontalResult;
            } else if (middleOperator === '/') {
                const denominator = getRandomNumber(1, 9);
                const result = getRandomNumber(1, Math.floor(max / denominator));
                const numerator = result * denominator;
                if (numerator !== midLeft || numerator > max || result > max) {
                    continue;
                }
                horizontalResult = denominator;
                midMid = result;
            }
            if (midMid <= 0 || midMid > max || isNaN(midMid)) continue;

            let bottomMiddle;
            if (topOperator === '+') {
                bottomMiddle = topMiddle + midMid;
            } else if (topOperator === '-') {
                bottomMiddle = topMiddle - midMid;
            } else if (topOperator === '*') {
                bottomMiddle = topMiddle * midMid;
            } else if (topOperator === '/') {
                const division = getDivisionNumbers(max * 2);
                if (!division) continue;
                topMiddle = division.numerator;
                midMid = division.denominator;
                bottomMiddle = division.result;
            }

            if (bottomMiddle <= 0 || bottomMiddle > max * 2 || isNaN(bottomMiddle)) continue;

            const bottomOperator = getRandomOperator();
            let bottomRight;

            if (topOperator === '+') {
                bottomRight = topRight + horizontalResult;
            } else if (topOperator === '-') {
                bottomRight = topRight - horizontalResult;
            } else if (topOperator === '*') {
                bottomRight = topRight * horizontalResult;
            } else if (topOperator === '/') {
                const division = getDivisionNumbers(max * 2);
                if (!division) continue;
                topRight = division.numerator;
                horizontalResult = division.denominator;
                bottomRight = division.result;
            }

            if (bottomRight <= 0 || bottomRight > max * 2 || isNaN(bottomRight)) continue;

            let adjustedBottomMiddle;
            if (bottomOperator === '+') {
                adjustedBottomMiddle = bottomRight - bottomLeft;
            } else if (bottomOperator === '-') {
                adjustedBottomMiddle = bottomLeft - bottomRight;
            } else if (bottomOperator === '*') {
                if (bottomRight % bottomLeft !== 0) continue;
                adjustedBottomMiddle = bottomRight / bottomLeft;
            } else if (bottomOperator === '/') {
                adjustedBottomMiddle = bottomLeft / bottomRight;
                if (!Number.isInteger(adjustedBottomMiddle)) continue;
            }

            if (adjustedBottomMiddle <= 0 || adjustedBottomMiddle > max * 2 || isNaN(adjustedBottomMiddle)) continue;

            bottomMiddle = adjustedBottomMiddle;

            const isFirstRowValid =
                (topOperator === '+' && topLeft + topMiddle === topRight) ||
                (topOperator === '-' && topLeft - topMiddle === topRight) ||
                (topOperator === '*' && topLeft * topMiddle === topRight) ||
                (topOperator === '/' && topLeft / topMiddle === topRight);


            const isFifthRowValid =
                (bottomOperator === '+' && bottomLeft + bottomMiddle === bottomRight) ||
                (bottomOperator === '-' && bottomLeft - bottomMiddle === bottomRight) ||
                (bottomOperator === '*' && bottomLeft * bottomMiddle === bottomRight) ||
                (bottomOperator === '/' && bottomLeft / bottomMiddle === bottomRight);

            const isFirstColumnValid = topLeft - midLeft === verticalDiff && midLeft - bottomLeft === verticalDiff;

            const isThirdColumnValid =
                (topOperator === '+' && topMiddle + midMid === bottomMiddle) ||
                (topOperator === '-' && topMiddle - midMid === bottomMiddle) ||
                (topOperator === '*' && topMiddle * midMid === bottomMiddle) ||
                (topOperator === '/' && topMiddle / midMid === bottomMiddle);

            const isFifthColumnValid =
                (topOperator === '+' && topRight + horizontalResult === bottomRight) ||
                (topOperator === '-' && topRight - horizontalResult === bottomRight) ||
                (topOperator === '*' && topRight * horizontalResult === bottomRight) ||
                (topOperator === '/' && topRight / horizontalResult === bottomRight);

            if (isFirstRowValid && isFifthRowValid && isFirstColumnValid && isThirdColumnValid && isFifthColumnValid) {
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
                        {value: topOperator, isFixed: true},
                        {value: '', isFixed: true},
                        {value: topOperator, isFixed: true},
                    ],
                    [
                        {value: '', solution: midLeft.toString(), isFixed: false},
                        {value: '', isFixed: true},
                        {value: '', solution: midMid.toString(), isFixed: false},
                        {value: '', isFixed: true},
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
            }
        }

        throw new Error(`No se pudo generar un puzzle válido tras ${maxAttempts} intentos para la dificultad ${difficulty}.`);
    };

    const solutionCells = [
        [0, 0], [0, 4], [2, 0], [2, 2], [4, 4],
    ];

    const logSolutions = () => {
        solutionCells.forEach(([r, c]) => {
            console.log(`Celda [${r},${c}]: valor=${puzzle[r][c].value}, solución=${puzzle[r][c].solution}`);
        });
    };

    const validatePuzzle = (puzzle) => {
        let errors = [];

        const allFilled = solutionCells.every(([r, c]) => puzzle[r][c].value !== '');
        if (!allFilled) {
            setMessage('Por favor, completa todas las celdas.');
            return false;
        }

        const row0Left = parseInt(puzzle[0][0].value, 10);
        const row0Middle = parseInt(puzzle[0][2].value, 10);
        const row0Right = parseInt(puzzle[0][4].value, 10);
        const row0Operator = puzzle[0][1].value;
        let row0Valid = false;

        if (row0Operator === '+') row0Valid = row0Left + row0Middle === row0Right;
        else if (row0Operator === '-') row0Valid = row0Left - row0Middle === row0Right;
        else if (row0Operator === '*') row0Valid = row0Left * row0Middle === row0Right;
        else if (row0Operator === '/') row0Valid = row0Left / row0Middle === row0Right;

        if (isNaN(row0Left) || isNaN(row0Middle) || isNaN(row0Right) || !row0Valid) {
            errors.push('La fila 1 no es válida.');
        }

        const row4Left = parseInt(puzzle[4][0].value, 10);
        const row4Middle = parseInt(puzzle[4][2].value, 10);
        const row4Right = parseInt(puzzle[4][4].value, 10);
        const row4Operator = puzzle[4][1].value;
        let row4Valid = false;

        if (row4Operator === '+') row4Valid = row4Left + row4Middle === row4Right;
        else if (row4Operator === '-') row4Valid = row4Left - row4Middle === row4Right;
        else if (row4Operator === '*') row4Valid = row4Left * row4Middle === row4Right;
        else if (row4Operator === '/') row4Valid = row4Left / row4Middle === row4Right;

        if (isNaN(row4Left) || isNaN(row4Middle) || isNaN(row4Right) || !row4Valid) {
            errors.push('La fila 5 no es válida.');
        }

        const col0Top = parseInt(puzzle[0][0].value, 10);
        const col0Middle = parseInt(puzzle[2][0].value, 10);
        const col0Bottom = parseInt(puzzle[4][0].value, 10);
        const col0Diff1 = col0Top - col0Middle;
        const col0Diff2 = col0Middle - col0Bottom;

        if (isNaN(col0Top) || isNaN(col0Middle) || isNaN(col0Bottom) || col0Diff1 !== col0Diff2 || col0Diff1 <= 0) {
            errors.push('La columna 1 no es válida.');
        }

        const col2Top = parseInt(puzzle[0][2].value, 10);
        const col2Middle = parseInt(puzzle[2][2].value, 10);
        const col2Bottom = parseInt(puzzle[4][2].value, 10);
        const col2Operator = puzzle[1][2].value;
        let col2Valid = false;

        if (col2Operator === '+') col2Valid = col2Top + col2Middle === col2Bottom;
        else if (col2Operator === '-') col2Valid = col2Top - col2Middle === col2Bottom;
        else if (col2Operator === '*') col2Valid = col2Top * col2Middle === col2Bottom;
        else if (col2Operator === '/') col2Valid = col2Top / col2Middle === col2Bottom;

        if (isNaN(col2Top) || isNaN(col2Middle) || isNaN(col2Bottom) || !col2Valid) {
            errors.push('La columna 3 no es válida.');
        }

        const col4Top = parseInt(puzzle[0][4].value, 10);
        const col4Middle = parseInt(puzzle[2][4].value, 10);
        const col4Bottom = parseInt(puzzle[4][4].value, 10);
        const col4Operator = puzzle[1][4].value;
        let col4Valid = false;

        if (col4Operator === '+') col4Valid = col4Top + col4Middle === col4Bottom;
        else if (col4Operator === '-') col4Valid = col4Top - col4Middle === col4Bottom;
        else if (col4Operator === '*') col4Valid = col4Top * col4Middle === col4Bottom;
        else if (col4Operator === '/') col4Valid = col4Top / col4Middle === col4Bottom;

        if (isNaN(col4Top) || isNaN(col4Middle) || isNaN(col4Bottom) || !col4Valid) {
            errors.push('La columna 5 no es válida.');
        }

        if (errors.length > 0) {
            setMessage(errors.join(' '));
            return false;
        }

        return true;
    };

    const handleCellChange = (row, col, value) => {
        if (!/^\d*$/.test(value) || value.length > 3) return;

        const newPuzzle = puzzle.map(r => r.map(c => ({...c})));
        newPuzzle[row][col].value = value;
        setPuzzle(newPuzzle);

        const allFilled = solutionCells.every(([r, c]) => newPuzzle[r][c].value !== '');

        if (allFilled) {
            const isValid = validatePuzzle(newPuzzle);
            if (isValid) {
                setMessage('¡Felicidades! Has completado el CrossMaths correctamente.');
                setIsComplete(true);
            }
        } else {
            setMessage('');
        }
    };

    const verifyCell = (row, col) => {
        if (!puzzle[row][col].solution) return true;
        const userValue = puzzle[row][col].value.trim();
        const correctValue = puzzle[row][col].solution.trim();
        return userValue === correctValue;
    };

    const resetGame = () => {
        try {
            const newPuzzle = generateRandomPuzzle();
            setPuzzle(newPuzzle);
            setMessage('');
            setIsComplete(false);
        } catch (error) {
            console.error(error);
            setMessage('Error al generar el puzzle. Por favor, intenta de nuevo.');
        }
    };

    if (!puzzle || puzzle.length === 0) {
        return <div>Cargando...</div>;
    }

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

                <div className="grid grid-cols-5 gap-1 mb-4 w-[500px] mt-6">
                    {puzzle.map((row, rowIndex) =>
                        row.map((cell, colIndex) => (
                            <div
                                key={`${rowIndex}-${colIndex}`}
                                className={`w-24 h-24 flex items-center justify-center border-2 rounded
                                    ${cell.isFixed ? 'bg-gray-700 text-white' : 'bg-white text-black'}
                                    ${
                                    !cell.isFixed && cell.solution && cell.value && !verifyCell(rowIndex, colIndex)
                                        ? 'border-red-500'
                                        : !cell.isFixed && cell.solution && cell.value && verifyCell(rowIndex, colIndex)
                                            ? 'border-green-500'
                                            : 'border-gray-400'
                                }`}
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
                        ))
                    )}
                </div>
                {message && (
                    <div
                        className={`mt-4 p-3 rounded text-center w-full max-w-md ${
                            message.includes('Felicidades') ? 'bg-green-600 text-white' : 'bg-orange-600 text-white'
                        }`}
                    >
                        {message}
                    </div>
                )}
                <div className="flex flex-col gap-2 mt-4">
                    {isComplete && (
                        <button
                            onClick={resetGame}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
                        >
                            Jugar de nuevo
                        </button>
                    )}
                    {!isComplete && (
                        <button
                            onClick={() => {
                                logSolutions();
                                const solvedPuzzle = puzzle.map(row =>
                                    row.map(cell => ({
                                        ...cell,
                                        value: cell.solution ? cell.solution : cell.value
                                    }))
                                );
                                setPuzzle(solvedPuzzle);
                                setMessage('Solución mostrada para depuración.');
                            }}
                            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded text-sm"
                        >
                            Mostrar solución (depuración)
                        </button>
                    )}
                </div>
            </section>
            <Footer/>
        </div>
    );
}