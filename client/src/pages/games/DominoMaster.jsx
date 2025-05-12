import React, { useState, useEffect } from 'react';
import Header from "@/components/Header";
import Title from "@/components/Title";
import Button from "@/components/Button";
import ErrorReportModal from "@/components/ErrorModal";
import {useTranslation} from "react-i18next";

const shapes = [
    { name: "Circle", shape: "circle" },
    { name: "Square", shape: "square" },
    { name: "Triangle", shape: "triangle" },
    { name: "Rectangle", shape: "rectangle" },
    { name: "Pentagon", shape: "pentagon" },
    { name: "Hexagon", shape: "hexagon" },
    { name: "Star", shape: "star" }
];

const Shape = ({ type }) => {
    switch (type) {
        case 'circle':
            return <div className="w-12 h-12 rounded-full bg-blue-500"></div>;
        case 'square':
            return <div className="w-12 h-12 bg-red-500"></div>;
        case 'triangle':
            return (
                <div className="w-0 h-0 border-l-[24px] border-r-[24px] border-b-[42px] border-l-transparent border-r-transparent border-b-green-500"></div>
            );
        case 'rectangle':
            return <div className="w-16 h-8 bg-yellow-500"></div>;
        case 'pentagon':
            return (
                <div className="relative w-12 h-12 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        <polygon points="50,5 95,35 80,95 20,95 5,35" fill="purple" />
                    </svg>
                </div>
            );
        case 'hexagon':
            return (
                <div className="relative w-12 h-12 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        <polygon points="50,3 100,28 100,72 50,97 0,72 0,28" fill="teal" />
                    </svg>
                </div>
            );
        case 'star':
            return (
                <div className="relative w-12 h-12 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        <polygon points="50,5 61,40 95,40 67,60 79,95 50,75 21,95 33,60 5,40 39,40" fill="orange" />
                    </svg>
                </div>
            );
        default:
            return <div className="w-12 h-12 bg-gray-300"></div>;
    }
};

export default function GeoDomino() {
    const [board, setBoard] = useState([]);
    const [hand, setHand] = useState([]);
    const [score, setScore] = useState(0);
    const [timer, setTimer] = useState(60);
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(true);
    const [message, setMessage] = useState("");
    const {t} = useTranslation();

    const startGame = () => {
        let pieces = [];

        for (let i = 0; i < shapes.length; i++) {
            for (let j = 0; j < shapes.length; j++) {
                pieces.push({
                    id: `${i}-${j}`,
                    left: { type: 'name', value: shapes[i].name },
                    right: { type: 'shape', value: shapes[j].shape }
                });
            }
        }

        pieces = shuffleArray(pieces);

        const playerHand = pieces.slice(0, 7);

        const initialBoard = [pieces[7]];

        setBoard(initialBoard);
        setHand(playerHand);
        setScore(0);
        setTimer(60);
        setGameOver(false);
        setGameStarted(true);
        setMessage("");
    };

    const shuffleArray = (array) => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    useEffect(() => {
        startGame();
    }, []);

    useEffect(() => {
        let interval;
        if (gameStarted && !gameOver && timer > 0) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        } else if (timer === 0 && !gameOver) {
            setGameOver(true);
            setMessage("You ran out of time...");
        }

        return () => clearInterval(interval);
    }, [gameStarted, gameOver, timer]);

    const canPlacePiece = (piece) => {
        if (board.length === 0) return true;

        const firstPiece = board[0];
        const lastPiece = board[board.length - 1];

        if (firstPiece.left.type !== piece.right.type) {
            if (
                (firstPiece.left.type === 'shape' && piece.right.type === 'name' && getShapeName(firstPiece.left.value) === piece.right.value) ||
                (firstPiece.left.type === 'name' && piece.right.type === 'shape' && firstPiece.left.value === getShapeName(piece.right.value))
            ) {
                return "start";
            }
        }

        if (firstPiece.left.type !== piece.left.type) {
            if (
                (firstPiece.left.type === 'shape' && piece.left.type === 'name' && getShapeName(firstPiece.left.value) === piece.left.value) ||
                (firstPiece.left.type === 'name' && piece.left.type === 'shape' && firstPiece.left.value === getShapeName(piece.left.value))
            ) {
                return "start";
            }
        }

        if (lastPiece.right.type !== piece.left.type) {
            if (
                (lastPiece.right.type === 'shape' && piece.left.type === 'name' && getShapeName(lastPiece.right.value) === piece.left.value) ||
                (lastPiece.right.type === 'name' && piece.left.type === 'shape' && lastPiece.right.value === getShapeName(piece.left.value))
            ) {
                return "end";
            }
        }

        if (lastPiece.right.type !== piece.right.type) {
            if (
                (lastPiece.right.type === 'shape' && piece.right.type === 'name' && getShapeName(lastPiece.right.value) === piece.right.value) ||
                (lastPiece.right.type === 'name' && piece.right.type === 'shape' && lastPiece.right.value === getShapeName(piece.right.value))
            ) {
                return "end";
            }
        }

        return false;
    };

    const getShapeName = (shapeType) => {
        const shape = shapes.find(s => s.shape === shapeType);
        return shape ? shape.name : "";
    };

    const playPiece = (piece, index) => {
        if (gameOver) return;

        const placement = canPlacePiece(piece);

        if (placement) {
            let newBoard = [...board];
            let newPiece = {...piece};

            if (placement === "start") {
                if (piece.right.type !== board[0].left.type &&
                    ((piece.right.type === 'name' && board[0].left.type === 'shape' && getShapeName(board[0].left.value) === piece.right.value) ||
                        (piece.right.type === 'shape' && board[0].left.type === 'name' && getShapeName(piece.right.value) === board[0].left.value))) {
                } else {
                    [newPiece.left, newPiece.right] = [newPiece.right, newPiece.left];
                }
                newBoard.unshift(newPiece);
            }
            else if (placement === "end") {
                if (piece.left.type !== board[board.length-1].right.type &&
                    ((piece.left.type === 'name' && board[board.length-1].right.type === 'shape' && getShapeName(board[board.length-1].right.value) === piece.left.value) ||
                        (piece.left.type === 'shape' && board[board.length-1].right.type === 'name' && getShapeName(piece.left.value) === board[board.length-1].right.value))) {
                } else {
                    [newPiece.left, newPiece.right] = [newPiece.right, newPiece.left];
                }
                newBoard.push(newPiece);
            }

            setBoard(newBoard);
            const newHand = [...hand];
            newHand.splice(index, 1);
            setHand(newHand);

            setScore(score + 5);
            setMessage("Good job! + 5 points");

            if (newHand.length === 0) {
                setGameOver(true);
                setMessage("Congrats! You filled the board.");
            }
        } else {
            setScore(Math.max(0, score - 3));
            setMessage("Invalid move... - 3 points penalty.");
        }
    };

    const renderDominoHalf = (half) => {
        if (half.type === 'name') {
            return <div className="flex items-center justify-center h-16 text-center font-medium">{half.value}</div>;
        } else {
            return <div className="flex items-center justify-center h-16"><Shape type={half.value} /></div>;
        }
    };

    return (
        <div className="app flex flex-col bg-PS-main-purple">
            <Header></Header>
            <section className="justify-center items-center mb-7 flex flex-col py-10 bg-PS-main-purple">
                <Title>Domino Master</Title>
                <div className="mt-4 mb-2 relative w-[1150px] flex justify-between">
                    <Button size="small" onClick={() => router.back()}> {t("backButton")} </Button>
                    <ErrorReportModal></ErrorReportModal>
                </div>
                <div className="flex flex-row items-start justify-between p-4 max-w-6xl mx-auto bg-pink-50
                                rounded-lg shadow-lg h-full border-4 border-stone-700"
                     style={{maxHeight: 'auto', width: '1200px'}}
                >
                    <div className="flex flex-col w-full bg-blue-100 rounded-lg p-2" style={{height:'500px', width:'100%'}}>
                        <div className="max-w-5xl mx-auto">
                            <div className="flex justify-between mt-8 mb-4">
                                <div className="p-2 text-black bg-white rounded shadow">
                                    <p className="font-bold">Score: {score}</p>
                                </div>
                                {message && (
                                    <div className={`p-2 mb-0 text-center text-white font-bold rounded 
                                                 ${message.includes("time") || message.includes("Invalid") ? 'bg-red-300' : 'bg-green-300'}
                                                 animate-fade-in-out`}
                                    >{message}
                                    </div>
                                )}
                                <div className="p-2 bg-white rounded shadow">
                                    <p
                                        className={` font-bold ${timer <= 20 ? 'text-amber-500' : 'text-gray-700'}
                                                    ${timer <= 10 ? 'text-red-500' : 'text-gray-700'} `}
                                    >
                                        Time: {timer}s
                                    </p>
                                </div>
                            </div>

                            <div className="mb-8">
                                <div className="flex items-center justify-items-center overflow-x-auto p-4 bg-green-200 rounded-lg min-h-30 border-2 border-stone-400">
                                    {board.length > 0 ? (
                                        <div className="flex flex-nowrap">
                                            {board.map((piece, index) => (
                                                <div
                                                    key={index}
                                                    className="flex border-2 border-gray-700 rounded bg-white text-black mx-1 h-18"
                                                >
                                                    <div className="w-24 border-r border-gray-700">
                                                        {renderDominoHalf(piece.left)}
                                                    </div>
                                                    <div className="w-24">
                                                        {renderDominoHalf(piece.right)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-center w-full italic">The board is empty!</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h2 className="text-xl text-gray-700 font-bold mb-2">Inventory:</h2>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {hand.map((piece, index) => (
                                        <div
                                            key={index}
                                            className={`flex border-2 border-gray-700 rounded bg-white text-black 
                                                        cursor-pointer transform transition hover:shadow-lg hover:scale-105`}
                                            onClick={() => playPiece(piece, index)}
                                        >
                                            <div className="w-24 border-r border-gray-700">
                                                {renderDominoHalf(piece.left)}
                                            </div>
                                            <div className="w-24">
                                                {renderDominoHalf(piece.right)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}