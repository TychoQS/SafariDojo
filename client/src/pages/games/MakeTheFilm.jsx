import React, {useState, useEffect, useRef} from 'react';
import { Trophy, RefreshCcw } from 'lucide-react';
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Lifes from "@/components/Lifes";
import Link from "next/link";
import Button from "@/components/Button";
import Title from "@/components/Title";
import {cherryBomb} from "@/styles/fonts";
import Piece from "@/pages/games/modules/CookTheBook/Piece";

const stories = [
    {
        id: 1,
        title: "Little Red Riding Hood",
        pieces: [
            { id: 1, text: "Once upon a time, there was a little girl who went to visit her grandmother.", color: "bg-red-200" },
            { id: 2, text: "On her way, she met a wicked wolf.", color: "bg-gray-200" },
            { id: 3, text: "The wolf arrived at grandmother's house before her.", color: "bg-purple-200" },
            { id: 4, text: "A hunter rescued Little Red Riding Hood and her grandmother.", color: "bg-green-200" }
        ]
    },
    {
        id: 2,
        title: "The Three Little Pigs",
        pieces: [
            { id: 1, text: "Three little pigs decided to build their own houses.", color: "bg-pink-200" },
            { id: 2, text: "The first pig built a house of straw.", color: "bg-yellow-200" },
            { id: 3, text: "The second pig built a house of sticks.", color: "bg-orange-200" },
            { id: 4, text: "The third pig built a house of bricks that withstood the wolf.", color: "bg-red-200" }
        ]
    },
    {
        id: 3,
        title: "Hansel and Gretel",
        pieces: [
            { id: 1, text: "Two siblings were abandoned in the forest by their parents.", color: "bg-blue-200" },
            { id: 2, text: "They found a house made of candy.", color: "bg-pink-200" },
            { id: 3, text: "The witch locked Hansel in a cage to eat him.", color: "bg-purple-200" },
            { id: 4, text: "Gretel pushed the witch into the oven and they escaped with her treasures.", color: "bg-yellow-200" }
        ]
    }
];

const MakeTheFilm = () => {
    const [score, setScore] = useState(0);
    const [currentLevel, setCurrentLevel] = useState(0);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [shuffledPieces, setShuffledPieces] = useState([]);
    const [timelinePieces, setTimelinePieces] = useState(Array(4).fill(null));
    const [message, setMessage] = useState("");
    const [animation, setAnimation] = useState("");
    const [verifyEnabled, setVerifyEnabled] = useState(false);
    const lifesRef = useRef(null);

    useEffect(() => {
        if (currentLevel < stories.length) {
            initLevel(currentLevel);
        } else {
            setGameCompleted(true);
        }
    }, [currentLevel]);

    const initLevel = (level) => {
        const levelPieces = [...stories[level].pieces];
        for (let i = levelPieces.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [levelPieces[i], levelPieces[j]] = [levelPieces[j], levelPieces[i]];
        }
        setShuffledPieces(levelPieces);
        setTimelinePieces(Array(levelPieces.length).fill(null));
        setMessage("");
        setAnimation("");
        setVerifyEnabled(false);
    };


    const handleDragOver = (e, index) => {
        e.preventDefault();
    };


    const handleTimelineDrop = (e, position) => {
        e.preventDefault();
        const pieceId = parseInt(e.dataTransfer.getData('pieceId'));
        const pieceIndex = parseInt(e.dataTransfer.getData('pieceIndex'));

        const newShuffledPieces = [...shuffledPieces];
        const piece = newShuffledPieces[pieceIndex];

        if (piece) {

            const newTimelinePieces = [...timelinePieces];

            if (newTimelinePieces[position] !== null) {
                newShuffledPieces.push(newTimelinePieces[position]);
            }

            newShuffledPieces.splice(pieceIndex, 1);
            newTimelinePieces[position] = piece;

            setShuffledPieces(newShuffledPieces);
            setTimelinePieces(newTimelinePieces);

            setVerifyEnabled(!newTimelinePieces.includes(null));
        }
    };


    const handlePoolDrop = (e) => {
        e.preventDefault();
        const pieceId = parseInt(e.dataTransfer.getData('pieceId'));
        const pieceIndex = parseInt(e.dataTransfer.getData('pieceIndex'));


        if (pieceIndex < 0) {
            const timelineIndex = -pieceIndex - 1;
            const piece = timelinePieces[timelineIndex];

            if (piece) {

                const newTimelinePieces = [...timelinePieces];
                newTimelinePieces[timelineIndex] = null;

                setShuffledPieces([...shuffledPieces, piece]);
                setTimelinePieces(newTimelinePieces);
                setVerifyEnabled(false);
            }
        }
    };


    const verifyOrder = () => {

        const isCorrectOrder = timelinePieces.every((piece, index) => piece?.id === index + 1);

        if (isCorrectOrder) {

            setMessage("Correct! You've ordered the story perfectly!");
            setAnimation("animate-bounce");
            setScore(score + 10);


            setTimeout(() => {
                setCurrentLevel(currentLevel + 1);
            }, 2500);
        } else {
            setMessage("The order is not correct. Try again!");
            setAnimation("animate-shake");

            setTimeout(() => {
                setAnimation("");
            }, 1000);
        }
    };


    const resetLevel = () => {
        initLevel(currentLevel);
    };


    const resetGame = () => {
        setScore(0);
        setCurrentLevel(0);
        setGameCompleted(false);
    };


    const renderPuzzlePiece = (piece, index, isOnTimeline = false) => {
        if (!piece) return null;
        return <Piece piece={piece} index={index} isOnTimeline={isOnTimeline}></Piece>;
    };

    return (
        <>
            <div className="app flex flex-col h-screen bg-PS-main-purple">
                <Header></Header>
                <section id={"lives-section"} className={"flex flex-row items-center justify-between"}>
                    <Link href={{pathname: "../GameSelectionPage", query: {Subject: 'Art'}}}>
                        <div className="mb-2 mt-2">
                            <Button size="small">Back</Button>
                        </div>
                    </Link>
                    <div className="">
                        <Lifes ref={lifesRef}/>
                    </div>
                </section>
                <main id={"main-section"} className={"flex flex-col flex-1 items-center justify-start bg-PS-main-purple pb-12"}>
                    { gameCompleted ? (
                        <>
                            <div className="flex flex-col justify-between items-center">
                                <section id={"title-section"} className="w-full max-w-4xl rounded-lg">
                                    <div className="flex justify-center">
                                        <Title>Make The Film</Title>
                                    </div>
                                </section>
                                <section id={"scoreboard"} className={"pb-4"}>
                                    <div className="flex items-center space-x-6">
                                        <div id={"score-board"} className="bg-PS-light-yellow border-PS-dark-yellow border-1 text-PS-art-color px-3 py-1 rounded-full font-bold text-2xl">
                                            Score: {score}/30
                                        </div>
                                        <div id={"level-board"} className="bg-PS-light-yellow border-PS-dark-yellow border-2 text-PS-art-color px-3 py-1 rounded-full font-bold text-2xl">
                                            Level: {currentLevel + 1}/{stories.length}
                                        </div>
                                    </div>
                                </section>
                            </div>
                        <section id={"game-section"} className="bg-PS-light-yellow border-PS-dark-yellow border-4 rounded-lg shadow-lg p-6 w-full max-w-4xl">
                            <h1 className={`text-2xl font-bold mb-6 text-center ${cherryBomb.className} text-PS-art-color`}>{stories[currentLevel]?.title}</h1>
                            {message && (
                                <div className={`mb-4 p-3 rounded-lg text-center font-bold ${message.includes('Correct') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}  ${cherryBomb.className}`}>
                                    {message}
                                </div>
                            )}

                            <section id={"time-line-section"} className="mb-8">
                                <h2 className={`text-center text-lg font-semibold mb-2 text-PS-art-color ${cherryBomb.className}`}>Timeline</h2>
                                <div id={"game-time-line"} className="relative">
                                    <div id={"time-line-line"} className="absolute h-1 bg-red-400 top-1/2 left-0 right-0 transform -translate-y-1/2 z-0"></div>
                                    <section id={"missing-pieces-section"} className="relative z-10 flex justify-between items-center py-8">
                                        {timelinePieces.map((piece, index) => (
                                            <div
                                                key={index}
                                                onDragOver={(e) => handleDragOver(e, index)}
                                                onDrop={(e) => handleTimelineDrop(e, index)}
                                                className={`${piece ? "" : "border-2 border-dashed border-PS-art-color"} 
                                ${piece ? "" : "bg-PS-light-yellow"} 
                                rounded-lg flex items-center justify-center
                                transform transition-transform duration-200
                                ${animation}`}
                                                style={{
                                                    width: '180px',
                                                    height: '110px',
                                                    margin: '0 5px',
                                                }}
                                            >
                                                {piece ?
                                                    renderPuzzlePiece(piece, index, true) :
                                                    <span className=" text-PS-art-color text-center text-sm px-2">Place piece {index + 1} here</span>
                                                }
                                            </div>
                                        ))}
                                    </section>

                                    <div id={"time-line-points"} className="flex justify-between items-center relative z-20">
                                        {timelinePieces.map((_, index) => (
                                            <div key={index} className="bg-PS-art-color rounded-full w-4 h-4 border-2 border-white"></div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                            <section
                                id={"pieces-section"}
                                className="bg-PS-gray p-4 rounded-lg"
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handlePoolDrop}
                            >
                                <div className="flex flex-wrap justify-center">
                                    {shuffledPieces.map((piece, index) => renderPuzzlePiece(piece, index))}
                                    {shuffledPieces.length === 0 && (
                                        <p className="text-gray-500 py-8">No more pieces available</p>
                                    )}
                                </div>
                            </section>

                            <section id={"buttons-section"} className="mt-6 flex justify-center space-x-4">
                                <Button size={"large"} onClick={verifyOrder}>Verify Order</Button>
                                <Button size={"large"} onClick={resetLevel}>Reset Level</Button>
                            </section>
                        </section>
                            </>
                    ) : (
                        <div className="bg-white rounded-lg shadow-xl p-8 text-center max-w-lg">
                            <h1>Game Completed</h1>
                        </div>
                    )}
                </main>
                <Footer></Footer>
            </div>
        </>
    );
};

export default MakeTheFilm;