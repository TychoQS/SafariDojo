import { useState, useEffect } from 'react';
import Title from "@/components/Title";
import Header from "@/components/Header";
import Button from "@/components/Button";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function LetterSoup() {
    const words = ["BIRD", "GIRLFRIEND", "HAMSTER", "HUSBAND", "KEYS", "LEAVES", "PET", "TOOTH", "TURTLE", "WIFE"];

    const rows = 11;
    const cols = 11;

    const initialGrid = [
        ["G", "L", "B", "K", "F", "X", "Y", "V", "O", "I", "I"],
        ["U", "I", "I", "L", "T", "B", "A", "Z", "O", "I", "G"],
        ["P", "X", "R", "J", "E", "S", "J", "W", "C", "J", "U"],
        ["H", "H", "D", "L", "T", "A", "M", "I", "Q", "P", "S"],
        ["U", "G", "A", "H", "F", "M", "V", "F", "Q", "F", "B"],
        ["S", "R", "J", "M", "W", "R", "K", "E", "Y", "S", "T"],
        ["B", "U", "K", "Y", "S", "C", "I", "Y", "S", "T", "I"],
        ["A", "P", "T", "U", "R", "T", "L", "E", "P", "G", "E"],
        ["N", "K", "D", "J", "X", "P", "E", "G", "N", "S", "F"],
        ["D", "X", "D", "H", "M", "E", "E", "R", "D", "D", "U"],
        ["U", "A", "L", "E", "T", "O", "O", "T", "H", "V", "S"]
    ];

    const directions = [
        [1, 0],
        [0, 1],
        [1, 1],
        [-1, 0],
        [0, -1],
        [-1, -1],
        [1, -1],
        [-1, 1]
    ];

    const [grid, setGrid] = useState(initialGrid);
    const [selectedCells, setSelectedCells] = useState([]);
    const [foundWords, setFoundWords] = useState([]);
    const [foundWordCells, setFoundWordCells] = useState([]);
    const [isSelecting, setIsSelecting] = useState(false);
    const [currentWord, setCurrentWord] = useState("");
    const [message, setMessage] = useState("");
    const [currentDirection, setCurrentDirection] = useState(null);

    const isWordFound = (word) => {
        return foundWords.includes(word);
    };

    const getSelectedText = () => {
        return selectedCells.map(([row, col]) => grid[row][col]).join("");
    };

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

            setMessage(`Great! You found: '${selectedText}'`);
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

    useEffect(() => {
        if (foundWords.length === words.length) {
            setMessage("Congrats! You found all the words.");
        }
    }, [foundWords]);

    const handleMouseDown = (row, col) => {
        startSelection(row, col);
    };

    const handleMouseEnter = (row, col) => {
        continueSelection(row, col);
    };

    const handleMouseUp = () => {
        endSelection();
    };

    const isCellSelected = (row, col) => {
        return selectedCells.some(([r, c]) => r === row && c === col);
    };

    const isCellInFoundWord = (row, col) => {
        return foundWordCells.some(([r, c]) => r === row && c === col);
    };

    return (
        <div className="app min-h-screen flex flex-col bg-PS-main-purple">
            <Header></Header>
            <main className="bg-PS-main-purple w-dvw h-[768px] mb-7 flex flex-col justify-center items-center">
                <Title>Letter Soup</Title>
                <Link href={{pathname: "../GameSelectionPage", query: {Subject: "English"}}}>
                    <div className="mt-4 mb-2 relative w-[1150px] flex justify-start">
                        <Button size="small">Back</Button>
                    </div>
                </Link>
                <div className="flex flex-row items-start justify-between p-4 max-w-6xl mx-auto bg-pink-50
                                rounded-lg shadow-lg h-full border-4 border-stone-700"
                     style={{ maxHeight: '620px', width: '1200px' }}
                >
                    <div className="w-3/5">
                        <div
                            className="grid grid-cols-11 gap-2 mt-2 mb-6 bg-white p-4 rounded-lg shadow"
                        >
                            {grid.map((row, rowIndex) => (
                                row.map((letter, colIndex) => (
                                    <div
                                        key={`${rowIndex}-${colIndex}`}
                                        className={`w-9 h-9 flex items-center justify-center rounded cursor-pointer 
                                                    select-none text-lg text-white font-medium
                                            ${ isCellSelected(rowIndex, colIndex) ? 'bg-blue-400 text-white' :
                                            isCellInFoundWord(rowIndex, colIndex) ? 'bg-green-300 line-through' :
                                                'bg-blue-200'
                                        }
                                        `}
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
                            <h2 className="text-2xl text-center font-semibold mb-4 text-pink-800">Words to find</h2>

                            <div className="grid grid-cols-2 gap-3">
                                {words.map((word, index) => (
                                    <div
                                        key={index}
                                        className={`px-3 py-2 rounded-full text-center ${
                                            isWordFound(word)
                                                ? 'bg-green-500 text-white line-through animate-found-pulse'
                                                : 'bg-gray-200 text-gray-700'
                                        }`}
                                    >
                                        {word}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow flex flex-col items-center">
                            <div className="text-2xl text-gray-600 font-bold mb-2">Your progress</div>
                            <div className="text-2xl font-bold text-pink-800">
                                {foundWords.length} <span className="text-gray-600 font-medium">out of</span> {words.length}
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-4 mt-3">
                                <div
                                    className="bg-pink-600 h-4 rounded-full transition-all duration-500 ease-in-out shadow-md"
                                    style={{ width: `${(foundWords.length / words.length) * 100}%` }}
                                ></div>
                            </div>

                            {foundWords.length === words.length && (
                                <div className="animate-fade-in mt-4 p-1 bg-green-100 text-green-800 rounded-lg text-center font-bold">
                                    Good job!
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer></Footer>
        </div>
    );
}