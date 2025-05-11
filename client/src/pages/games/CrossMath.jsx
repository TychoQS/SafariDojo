import React, {useState, useEffect} from 'react';
import {useRouter} from 'next/router';
import Header from "@/components/Header";
import Title from "@/components/Title";
import Button from "@/components/Button";
import ErrorReportModal from "@/components/ErrorModal";
import Footer from "@/components/Footer";

export default function CrossMaths() {
    const router = useRouter();

    const generateRandomPuzzle = () => {
        const topLeft = Math.floor(Math.random() * 15) + 5;
        const topMiddle = Math.floor(Math.random() * 10);
        const topRight = topLeft + topMiddle;

        const verticalDiff = Math.floor(Math.random() * 5) + 3;
        const midLeft = topLeft - verticalDiff;

        if (midLeft <= 0) return generateRandomPuzzle();

        const horizontalResult = Math.floor(Math.random() * 5) + 4;
        const midMid = midLeft - horizontalResult;

        if (midMid <= 0) return generateRandomPuzzle();

        const bottomLeft = verticalDiff;
        const bottomMiddle = topMiddle + midMid;
        const bottomRight = bottomLeft + bottomMiddle;

        if (bottomMiddle <= 0 || bottomRight <= 0) return generateRandomPuzzle();

        return [
            [
                {value: '', solution: topLeft.toString(), isFixed: false},
                {value: '+', isFixed: true},
                {value: topMiddle.toString(), isFixed: true},
                {value: '=', isFixed: true},
                {value: '', solution: topRight.toString(), isFixed: false},
            ],
            [
                {value: '-', isFixed: true},
                {value: '', isFixed: true},
                {value: '+', isFixed: true},
                {value: '', isFixed: true},
                {value: '-', isFixed: true},
            ],
            [
                {value: '', solution: midLeft.toString(), isFixed: false},
                {value: '-', isFixed: true},
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
                {value: '+', isFixed: true},
                {value: bottomMiddle.toString(), isFixed: true},
                {value: '=', isFixed: true},
                {value: '', solution: bottomRight.toString(), isFixed: false},
            ],
        ];
    };

    const [puzzle, setPuzzle] = useState([]);
    const [message, setMessage] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        resetGame();
    }, []);

    const solutionCells = [
        [0, 0], [0, 4], [2, 0], [2, 2], [4, 4],
    ];

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
        if (isNaN(row0Left) || isNaN(row0Middle) || isNaN(row0Right) || (row0Left + row0Middle) !== row0Right) {
            errors.push('La fila 1 no es válida.');
        }

        const row2Left = parseInt(puzzle[2][0].value, 10);
        const row2Middle = parseInt(puzzle[2][2].value, 10);
        const row2Right = parseInt(puzzle[2][4].value, 10);
        if (isNaN(row2Left) || isNaN(row2Middle) || isNaN(row2Right) || (row2Left - row2Middle) !== row2Right) {
            errors.push('La fila 3 no es válida.');
        }

        const row4Left = parseInt(puzzle[4][0].value, 10);
        const row4Middle = parseInt(puzzle[4][2].value, 10);
        const row4Right = parseInt(puzzle[4][4].value, 10);
        if (isNaN(row4Left) || isNaN(row4Middle) || isNaN(row4Right) || (row4Left + row4Middle) !== row4Right) {
            errors.push('La fila 5 no es válida.');
        }

        const col0Top = parseInt(puzzle[0][0].value, 10);
        const col0Middle = parseInt(puzzle[2][0].value, 10);
        const col0Bottom = parseInt(puzzle[4][0].value, 10);
        if (isNaN(col0Top) || isNaN(col0Middle) || isNaN(col0Bottom) || (col0Top - col0Middle) !== col0Bottom) {
            errors.push('La columna 1 no es válida.');
        }

        const col2Top = parseInt(puzzle[0][2].value, 10);
        const col2Middle = parseInt(puzzle[2][2].value, 10);
        const col2Bottom = parseInt(puzzle[4][2].value, 10);
        if (isNaN(col2Top) || isNaN(col2Middle) || isNaN(col2Bottom) || (col2Top + col2Middle) !== col2Bottom) {
            errors.push('La columna 3 no es válida.');
        }

        if (errors.length > 0) {
            setMessage(errors.join(' '));
            return false;
        }

        return true;
    };

    const handleCellChange = (row, col, value) => {
        if (!/^\d*$/.test(value) || value.length > 2) return;

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
        return puzzle[row][col].value === puzzle[row][col].solution;
    };

    const resetGame = () => {
        const newPuzzle = generateRandomPuzzle();
        setPuzzle(newPuzzle);
        setMessage('');
        setIsComplete(false);
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
                                    !cell.isFixed && cell.value && !verifyCell(rowIndex, colIndex)
                                        ? 'border-red-500'
                                        : !cell.isFixed && cell.value
                                            ? 'border-green-500'
                                            : 'border-gray-400'
                                }`}
                            >
                                {cell.isFixed ? (
                                    <span className="font-bold text-xl">{cell.value}</span>
                                ) : (
                                    <input
                                        type="text"
                                        value={cell.value}
                                        onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                                        className="w-full h-full text-center bg-transparent outline-none text-xl"
                                        disabled={isComplete}
                                        aria-label={`Cell ${rowIndex}-${colIndex}`}
                                        maxLength={2}
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
                {isComplete && (
                    <button
                        onClick={resetGame}
                        className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
                    >
                        Jugar de nuevo
                    </button>
                )}
            </section>
            <Footer/>
        </div>
    );
}