import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from "@/components/Header";
import Title from "@/components/Title";
import Button from "@/components/Button";
import ErrorReportModal from "@/components/ErrorModal";
import Footer from "@/components/Footer";

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

    useEffect(() => {
        resetGame();
    }, [difficulty]);

    const generateRandomPuzzle = () => {
        const ranges = {
            easy: { min: 1, max: 9, operators: ['+', '-'] },
            medium: { min: 10, max: 99, operators: ['+', '-'] },
            hard: { min: 1, max: 15, operators: ['*', '/'] }
        };

        const { min, max, operators } = ranges[difficulty] || Ranges.easy;

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
            return { dividend, divisor, result };
        };

        const maxAttempts = 5000;
        let attempts = 0;

        const topOperator = getRandomOperator(previousOperators.topOperator);
        const middleOperator = getRandomOperator(previousOperators.middleOperator);
        const bottomOperator = getRandomOperator(previousOperators.bottomOperator);

        // Log operators to verify correct selection (Fix for Issue 1)
        console.log(`Operators for ${difficulty}: top=${topOperator}, middle=${middleOperator}, bottom=${bottomOperator}`);

        while (attempts < maxAttempts) {
            attempts++;
            try {
                // PASO 1: Generar la primera fila
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

                // PASO 2: Generar la primera columna (progresión aritmética)
                const verticalDiff = getRandomNumber(1, Math.min(5, Math.floor(topLeft / 2)));
                const midLeft = topLeft - verticalDiff;
                const bottomLeft = midLeft - verticalDiff;

                if (bottomLeft <= 0) continue;

                // Log first column to verify arithmetic progression (Fix for Issue 2)
                console.log(`Primera columna generada: topLeft=${topLeft}, midLeft=${midLeft}, bottomLeft=${bottomLeft}, verticalDiff=${verticalDiff}`);
                console.log(`Verificación: topLeft - midLeft = ${topLeft - midLeft}, midLeft - bottomLeft = ${midLeft - bottomLeft}`);

                // PASO 3: Generar la columna del medio
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

                // PASO 4: Calcular el resultado horizontal de la fila del medio
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

                // PASO 5: Calcular el resultado de la columna derecha
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

                // PASO 6: Verificar la fila inferior
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

        // Fix for Issue 1: Only use generateSimpleHardPuzzle for hard mode
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
        // Fix for Issue 2: Ensure clean numeric input
        const cleanedValue = value.trim().replace(/[^0-9]/g, '');
        if (cleanedValue.length > 3) return;

        const newPuzzle = puzzle.map(r => r.map(c => ({...c})));
        newPuzzle[row][col].value = cleanedValue;
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

    const validatePuzzle = (puzzle) => {
        let errors = [];

        const allFilled = solutionCells.every(([r, c]) => puzzle[r][c].value !== '');
        if (!allFilled) {
            setMessage('Por favor, completa todas las celdas.');
            return false;
        }

        // Validate first row
        const row0Left = parseInt(puzzle[0][0].value, 10);
        const row0Middle = parseInt(puzzle[0][2].value, 10);
        const row0Right = parseInt(puzzle[0][4].value, 10);
        const row0Operator = puzzle[0][1].value;
        let row0Valid = false;

        if (row0Operator === '+') row0Valid = row0Left + row0Middle === row0Right;
        else if (row0Operator === '-') row0Valid = row0Left - row0Middle === row0Right;
        else if (row0Operator === '*') row0Valid = row0Left * row0Middle === row0Right;
        else if (row0Operator === '/') row0Valid = Math.abs(row0Left / row0Middle - row0Right) < 0.0001;

        if (isNaN(row0Left) || isNaN(row0Middle) || isNaN(row0Right) || !row0Valid) {
            errors.push('La fila 1 no es válida.');
        }

        // Validate fifth row
        const row4Left = parseInt(puzzle[4][0].value, 10);
        const row4Middle = parseInt(puzzle[4][2].value, 10);
        const row4Right = parseInt(puzzle[4][4].value, 10);
        const row4Operator = puzzle[4][1].value;
        let row4Valid = false;

        if (row4Operator === '+') row4Valid = row4Left + row4Middle === row4Right;
        else if (row4Operator === '-') row4Valid = row4Left - row4Middle === row4Right;
        else if (row4Operator === '*') row4Valid = row4Left * row4Middle === row4Right;
        else if (row4Operator === '/') row4Valid = Math.abs(row4Left / row4Middle - row4Right) < 0.0001;

        if (isNaN(row4Left) || isNaN(row4Middle) || isNaN(row4Right) || !row4Valid) {
            errors.push('La fila 5 no es válida.');
        }

        // Validate first column (Fix for Issue 2: Simplified and enhanced logging)
        const col0Top = parseInt(puzzle[0][0].value, 10);
        const col0Middle = parseInt(puzzle[2][0].value, 10);
        const col0Bottom = parseInt(puzzle[4][0].value, 10);
        const col0Diff1 = col0Top - col0Middle;
        const col0Diff2 = col0Middle - col0Bottom;

        console.log(`Validating first column: top=${col0Top}, middle=${col0Middle}, bottom=${col0Bottom}`);
        console.log(`Differences: top-middle=${col0Diff1}, middle-bottom=${col0Diff2}`);

        if (isNaN(col0Top) || isNaN(col0Middle) || isNaN(col0Bottom)) {
            console.log('NaN detected in first column');
            errors.push('La columna 1 contiene valores no numéricos.');
        } else if (col0Diff1 !== col0Diff2) {
            console.log(`Arithmetic progression invalid: ${col0Diff1} !== ${col0Diff2}`);
            errors.push('La columna 1 no sigue una progresión aritmética.');
        }

        // Validate third column
        const col2Top = parseInt(puzzle[0][2].value, 10);
        const col2Middle = parseInt(puzzle[2][2].value, 10);
        const col2Bottom = parseInt(puzzle[4][2].value, 10);
        const col2Operator = puzzle[1][2].value;
        let col2Valid = false;

        if (col2Operator === '+') col2Valid = col2Top + col2Middle === col2Bottom;
        else if (col2Operator === '-') col2Valid = col2Top - col2Middle === col2Bottom;
        else if (col2Operator === '*') col2Valid = col2Top * col2Middle === col2Bottom;
        else if (col2Operator === '/') col2Valid = Math.abs(col2Top / col2Middle - col2Bottom) < 0.0001;

        if (isNaN(col2Top) || isNaN(col2Middle) || isNaN(col2Bottom) || !col2Valid) {
            errors.push('La columna 3 no es válida.');
        }

        // Validate fifth column
        const col4Top = parseInt(puzzle[0][4].value, 10);
        const col4Middle = parseInt(puzzle[2][4].value, 10);
        const col4Bottom = parseInt(puzzle[4][4].value, 10);
        const col4Operator = puzzle[1][4].value;
        let col4Valid = false;

        if (col4Operator === '+') col4Valid = col4Top + col4Middle === col4Bottom;
        else if (col4Operator === '-') col4Valid = col4Top - col4Middle === col4Bottom;
        else if (col4Operator === '*') col4Valid = col4Top * col4Middle === col4Bottom;
        else if (col4Operator === '/') col4Valid = Math.abs(col4Top / col4Middle - col4Bottom) < 0.0001;

        if (isNaN(col4Top) || isNaN(col4Middle) || isNaN(col4Bottom) || !col4Valid) {
            errors.push('La columna 5 no es válida.');
        }

        const row2Left = parseInt(puzzle[2][0].value, 10);
        const row2Middle = parseInt(puzzle[2][2].value, 10);
        const row2Right = parseInt(puzzle[2][4].value, 10);
        const row2Operator = puzzle[2][1].value;
        let row2Valid = false;

        if (row2Operator === '+') row2Valid = row2Left + row2Middle === row2Right;
        else if (row2Operator === '-') row2Valid = row2Left - row2Middle === row2Right;
        else if (row2Operator === '*') row2Valid = row2Left * row2Middle === row2Right;
        else if (row2Operator === '/') row2Valid = Math.abs(row2Left / row2Middle - row2Right) < 0.0001;

        if (isNaN(row2Left) || isNaN(row2Middle) || isNaN(row2Right) || !row2Valid) {
            errors.push('La fila 3 no es válida.');
        }

        if (errors.length > 0) {
            setMessage(errors.join(' '));
            return false;
        }

        return true;
    };

    const solutionCells = [
        [0, 0], [0, 4], [2, 0], [2, 2], [4, 4],
    ];

    const logSolutions = () => {
        solutionCells.forEach(([r, c]) => {
            console.log(`Celda [${r},${c}]: valor=${puzzle[r][c].value}, solución=${puzzle[r][c].solution}`);
        });
    };

    const verifyCell = (row, col) => {
        if (!puzzle[row][col].solution) return true;
        const userValue = puzzle[row][col].value.trim();
        const correctValue = puzzle[row][col].solution.trim();
        return userValue === correctValue;
    };

    const resetGame = () => {
        let attempts = 0;
        const maxAttempts = 3;

        const tryGeneratePuzzle = () => {
            try {
                const newPuzzle = generateRandomPuzzle();
                if (newPuzzle) {
                    setPuzzle(newPuzzle);
                    setMessage('');
                    setIsComplete(false);
                } else {
                    throw new Error('Puzzle generation failed');
                }
            } catch (error) {
                console.error(error);
                attempts++;

                if (attempts < maxAttempts) {
                    setMessage(`Intentando generar puzzle (intento ${attempts + 1})...`);
                    setTimeout(tryGeneratePuzzle, 500);
                } else {
                    setMessage('Error al generar el puzzle. Inténtalo de nuevo.');
                }
            }
        };

        tryGeneratePuzzle();
    };

    const generateSimpleHardPuzzle = () => {
        const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

        const topLeft = getRandomNumber(2, 6);
        const topMiddle = getRandomNumber(2, 6);
        const topRight = topLeft * topMiddle;

        const midLeft = topLeft - 1;
        const bottomLeft = midLeft - 1;

        const topOperator = '*';
        const middleOperator = '*';
        const bottomOperator = '*';

        const midMid = getRandomNumber(2, 5);
        const bottomMiddle = topMiddle * midMid;
        const horizontalResult = midLeft * midMid;
        const bottomRight = bottomLeft * bottomMiddle;

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

    return (
        <div className="min-h-screen flex flex-col bg-PS-main-purple text-white">
            <Header/>
            <section className="flex flex-col items-center py-10 flex-grow">
                <Title>Cross Math</Title>
                <div className="mt-4 mb-2 w-full max-w-3xl flex justify-between px-4">
                    <Button size="small" onClick={() => router.back()}>
                        Back
                    </Button>
                    <div className="text-center">
                        <p className="font-medium">Dificultad: {difficulty === 'easy' ? 'Fácil' : difficulty === 'medium' ? 'Media' : 'Difícil'}</p>
                    </div>
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
                                        ? 'border-red-500' : !cell.isFixed && cell.solution && cell.value && verifyCell(rowIndex, colIndex)
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
                    <button
                        onClick={resetGame}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
                    >
                        Nuevo puzzle
                    </button>
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