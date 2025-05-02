import { useState, useEffect } from 'react';
import Title from "@/components/Title";
import Header from "@/components/Header";
import Button from "@/components/Button";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function LetterSoup() {
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
                <div className="flex flex-row items-start justify-between p-4 max-w-6xl mx-auto bg-pink-50
                                rounded-lg shadow-lg h-full border-4 border-stone-700"
                     style={{ maxHeight: '625px', width: '1200px' }}
                >
                    <div className="w-3/5">
                        <div className="mb-2 text-lg font-medium text-green-600 text-center">{message}</div>

                    </div>
                    <div className="w-2/5 pl-6 flex flex-col h-full mt-2">
                        <div className="bg-white p-6 rounded-lg shadow mb-4"></div>

                        <div className="bg-white p-6 rounded-lg shadow flex flex-col items-center">
                        </div>
                    </div>
                </div>
                {foundWords.length === words.length && (
                    <Link href={{pathname: "../GameSelectionPage", query: {Subject: "English"}}}>
                        <div className="mt-4 mb-2 relative flex justify-center">
                            <Button size="small">Back</Button>
                        </div>
                    </Link>
                )}
            </main>
            <Footer></Footer>
        </div>
    );
}