import React, { useState, useEffect } from 'react';
import Header from "@/components/Header";
import Title from "@/components/Title";
import Button from "@/components/Button";
import ErrorReportModal from "@/components/ErrorModal";
import {useTranslation} from "react-i18next";

const shapes = [
    { name: "Circle", shape: "circle" },
    { name: "Cone", shape: "cone" },
    { name: "Cube", shape: "cube" },
    { name: "Cylinder", shape: "cylinder" },
    { name: "Diamond", shape: "diamond" },
    { name: "Square", shape: "square" },
    { name: "Triangle", shape: "triangle" },
    { name: "Rectangle", shape: "rectangle" },
    { name: "Pentagon", shape: "pentagon" },
    { name: "Hexagon", shape: "hexagon" },
    { name: "Octagon", shape: "octagon" },
    { name: "Parallelogram", shape: "parallelogram" },
    { name: "Polyhedron", shape: "polyhedron" },
    { name: "Pyramid", shape: "pyramid" },
    { name: "Sphere", shape: "sphere" },
    { name: "Star", shape: "star" }
];

const shapeImages = {
    circle: '/images/Games/Art/DominoMaster/circle.svg',
    cone: '/images/Games/Art/DominoMaster/cone.svg',
    cube: '/images/Games/Art/DominoMaster/cube.svg',
    cylinder: '/images/Games/Art/DominoMaster/cylinder.svg',
    diamond: '/images/Games/Art/DominoMaster/diamond.svg',
    square: '/images/Games/Art/DominoMaster/square.svg',
    triangle: '/images/Games/Art/DominoMaster/triangle.svg',
    rectangle: '/images/Games/Art/DominoMaster/rectangle.svg',
    pentagon: '/images/Games/Art/DominoMaster/pentagon.svg',
    hexagon: '/images/Games/Art/DominoMaster/hexagon.svg',
    octagon: '/images/Games/Art/DominoMaster/octagon.svg',
    parallelogram: '/images/Games/Art/DominoMaster/parallelogram.svg',
    polyhedron: '/images/Games/Art/DominoMaster/polyhedron.svg',
    pyramid: '/images/Games/Art/DominoMaster/pyramid.svg',
    sphere: '/images/Games/Art/DominoMaster/sphere.svg',
    star: '/images/Games/Art/DominoMaster/star.svg'
};

const Shape = ({ type }) => {
    const imageSrc = shapeImages[type];

    if (!imageSrc) {
        console.warn(`No image found for shape type: ${type}`);
        return <div className="w-12 h-12 bg-gray-300"></div>;
    }

    return (
        <img
            src={imageSrc}
            alt={type}
            className="w-12 h-12 object-contain"
            onError={(e) => {
                console.error(`Failed to load image: ${imageSrc}`);
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
            }}
        />
    );
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

        const initialPiece = pieces[0];
        const initialBoard = [initialPiece];

        let playerHand = [];
        let remainingPieces = pieces.filter(p => p.id !== initialPiece.id);

        let currentRight = initialPiece.right;
        while (playerHand.length < 7 && remainingPieces.length > 0) {
            const nextPiece = remainingPieces.find(p =>
                p.left.type === 'name' && getShapeName(currentRight.value) === p.left.value
            );

            if (nextPiece) {
                playerHand.push(nextPiece);
                currentRight = nextPiece.right;
                remainingPieces = remainingPieces.filter(p => p.id !== nextPiece.id);
            } else {
                const invertiblePiece = remainingPieces.find(p =>
                    p.right.type === 'shape' && getShapeName(p.right.value) === getShapeName(currentRight.value)
                );
                if (invertiblePiece) {
                    playerHand.push(invertiblePiece);
                    currentRight = invertiblePiece.left;
                    remainingPieces = remainingPieces.filter(p => p.id !== invertiblePiece.id);
                } else {
                    const randomPiece = remainingPieces[0];
                    playerHand.push(randomPiece);
                    currentRight = randomPiece.right;
                    remainingPieces = remainingPieces.filter(p => p.id !== randomPiece.id);
                }
            }
        }

        playerHand = shuffleArray(playerHand.slice(0, 7));

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

    useEffect(() => {
        let timeout;
        if (message && !message.includes("Congrats") && !message.includes("time")) {
            timeout = setTimeout(() => {
                setMessage("");
            }, 2000);
        }
        return () => clearTimeout(timeout);
    }, [message]);

    const canPlacePiece = (piece) => {
        if (board.length === 0) return true;

        const lastPiece = board[board.length - 1];

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

            if (placement === "end") {
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
            return (
                <div className="flex items-center justify-center h-16 relative">
                    <Shape type={half.value} />
                    <div className="w-12 h-12 bg-gray-300 absolute" style={{ display: 'none' }}></div>
                </div>
            );
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
                                    <div
                                        key={message}
                                        className={`p-2 mb-0 text-center text-white font-bold rounded 
                                                   ${message.includes("time") || message.includes("Invalid") ? 'bg-red-300' : 'bg-green-300'}
                                                   animate-fade-in-out z-10`}
                                    >{message}
                                    </div>
                                )}
                                <div className="p-2 bg-white rounded shadow">
                                    <p
                                        className={`font-bold ${timer <= 20 ? 'text-amber-500' : 'text-gray-700'}
                                                    ${timer <= 10 ? 'text-red-500' : 'text-gray-700'}`}
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
                                                    <div className="w-28 border-r border-gray-700">
                                                        {renderDominoHalf(piece.left)}
                                                    </div>
                                                    <div className="w-28">
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
                                            <div className="w-28 border-r border-gray-700">
                                                {renderDominoHalf(piece.left)}
                                            </div>
                                            <div className="w-28">
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