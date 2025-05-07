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
import {router} from "next/client";
import {useRouter} from "next/router";

let Stories = [];

function fetchStories(difficulty = 'easy') {
    return fetch(`http://localhost:8080/api/cookTheBookStories?` + new URLSearchParams({
        difficulty: difficulty.toLowerCase()
    }), {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    });
}

const CookTheBook = () => {
    const [score, setScore] = useState(0);
    const [currentLevel, setCurrentLevel] = useState(0);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [shuffledPieces, setShuffledPieces] = useState([]);
    const [timelinePieces, setTimelinePieces] = useState(Array(4).fill(null));
    const [message, setMessage] = useState("");
    const [animation, setAnimation] = useState("");
    const [verifyEnabled, setVerifyEnabled] = useState(false);
    const lifesRef = useRef(null);
    const [lifesAvailable, setLifesAvailable] = useState(true);
    const [areStoriesFetched, setAreStoriesFetched] = useState(false);
    const [remainingLives, setRemainingLives] = useState(5);
    const router = useRouter();

    const fetchData = async () => {
        if (!router.isReady) return
        let difficulty = router.query.Age;
        const response = await fetchStories(difficulty);
        if (response.ok) {
            let fetchedStories = await response.json();
            Stories = fetchedStories['Stories'];
            setAreStoriesFetched(true);
            setGameCompleted(false);
        }
    };

    function handleFinalScore() {
        try {
            const gameData = "Cook The Book"
            const age = router.query.Age;
            if (gameData && age) {
                const key = `${gameData}_${age}_bestScore`;
                console.log(key);
                const storedScore = parseInt(localStorage.getItem(key) || "0", 10);
                if (score > storedScore) {
                    localStorage.setItem(key, score.toString());
                }
            }

        } catch (error) {
            console.error("Error processing score update:", error);
        }
    }

    useEffect(() => {
        handleFinalScore();
    }, [gameCompleted]);

    useEffect(() => {
        fetchData().then(r => initLevel(currentLevel));
    }, [router.isReady]);

    useEffect(() => {
        if (!areStoriesFetched) return;
        if (currentLevel < Stories.length) {
            initLevel(currentLevel);
        } else {
            setGameCompleted(true);
        }
    }, [currentLevel]);

    const initLevel = (level) => {
        if (Stories.length <= 0) return;
        const bgColors = [
            "bg-red-50", "bg-red-100", "bg-red-200", "bg-red-300", "bg-red-400",
            "bg-orange-50", "bg-orange-100", "bg-orange-200", "bg-orange-300", "bg-orange-400",
            "bg-amber-50", "bg-amber-100", "bg-amber-200", "bg-amber-300", "bg-amber-400",
            "bg-yellow-50", "bg-yellow-100", "bg-yellow-200", "bg-yellow-300", "bg-yellow-400",
            "bg-lime-50", "bg-lime-100", "bg-lime-200", "bg-lime-300", "bg-lime-400",
            "bg-green-50", "bg-green-100", "bg-green-200", "bg-green-300", "bg-green-400",
            "bg-emerald-50", "bg-emerald-100", "bg-emerald-200", "bg-emerald-300", "bg-emerald-400",
            "bg-teal-50", "bg-teal-100", "bg-teal-200", "bg-teal-300", "bg-teal-400",
            "bg-cyan-50", "bg-cyan-100", "bg-cyan-200", "bg-cyan-300", "bg-cyan-400",
            "bg-sky-50", "bg-sky-100", "bg-sky-200", "bg-sky-300", "bg-sky-400",
            "bg-blue-50", "bg-blue-100", "bg-blue-200", "bg-blue-300", "bg-blue-400",
            "bg-indigo-50", "bg-indigo-100", "bg-indigo-200", "bg-indigo-300", "bg-indigo-400",
            "bg-violet-50", "bg-violet-100", "bg-violet-200", "bg-violet-300", "bg-violet-400",
            "bg-purple-50", "bg-purple-100", "bg-purple-200", "bg-purple-300", "bg-purple-400",
            "bg-fuchsia-50", "bg-fuchsia-100", "bg-fuchsia-200", "bg-fuchsia-300", "bg-fuchsia-400",
            "bg-pink-50", "bg-pink-100", "bg-pink-200", "bg-pink-300", "bg-pink-400",
            "bg-rose-50", "bg-rose-100", "bg-rose-200", "bg-rose-300", "bg-rose-400",
            "bg-gray-50", "bg-gray-100", "bg-gray-200", "bg-gray-300", "bg-gray-400",
            "bg-zinc-50", "bg-zinc-100", "bg-zinc-200", "bg-zinc-300", "bg-zinc-400",
            "bg-neutral-50", "bg-neutral-100", "bg-neutral-200", "bg-neutral-300", "bg-neutral-400",
            "bg-stone-50", "bg-stone-100", "bg-stone-200", "bg-stone-300", "bg-stone-400"
        ];

        const levelPieces = [...Stories[level].pieces].map(piece => ({
            ...piece,
            color: bgColors[Math.floor(Math.random() * bgColors.length)]
        }));
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

        if (pieceIndex < 0) {
            const timelineIndex = -pieceIndex - 1;
            const piece = timelinePieces[timelineIndex];
            if (piece) {
                const newTimelinePieces = [...timelinePieces];
                if (newTimelinePieces[position] !== null) {
                    newTimelinePieces[timelineIndex] = newTimelinePieces[position];
                } else {
                    newTimelinePieces[timelineIndex] = null;
                }
                newTimelinePieces[position] = piece;
                setTimelinePieces(newTimelinePieces);
                setVerifyEnabled(!newTimelinePieces.includes(null));
            }
        }
        else {
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
        const isCorrectOrder = timelinePieces.every((piece, index) => piece?.order === index + 1);
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
            setScore(score - 2);
            setRemainingLives(prev => {
                const newLives = prev - 1;
                lifesRef.current.loseLife();
                if (newLives <= 0) setLifesAvailable(false);
                return newLives;
            });
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

    const replayGame = () => {
        fetchData().then(_ => resetGame());
    }

    const currentlyPlaying = () => {
        return !gameCompleted;
    }


    const renderPuzzlePiece = (piece, index, isOnTimeline = false) => {
        if (!piece) return null;
        return <Piece piece={piece} index={index} isOnTimeline={isOnTimeline} isEmpty={!currentlyPlaying()}></Piece>
    };


    return (
        <>
            <div className="app flex flex-col bg-PS-main-purple min-h-screen">
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
                <main id={"main-section"} className={"flex flex-col flex-1 items-center justify-start bg-PS-main-purple"}>
                    { currentlyPlaying() && lifesAvailable ? (
                        <>
                            <div className="flex flex-col justify-between items-center">
                                <section id={"title-section"} className="w-full max-w-4xl rounded-lg">
                                    <div className="flex justify-center">
                                        <Title>Cook The Book</Title>
                                    </div>
                                </section>
                                <section id={"scoreboard"} className={"pb-4"}>
                                    <div className="flex items-center space-x-6">
                                        <div id={"score-board"} className="bg-PS-light-yellow border-PS-dark-yellow border-1 text-PS-art-color px-9 py-3 rounded-full font-bold text-3xl">
                                            Score: {score}/30
                                        </div>
                                        <div id={"level-board"} className="bg-PS-light-yellow border-PS-dark-yellow border-2 text-PS-art-color px-9 py-3 rounded-full font-bold text-3xl">
                                            Level: {currentLevel + 1}/{Stories.length}
                                        </div>
                                    </div>
                                </section>
                            </div>
                        <section id={"game-section"} className="bg-PS-light-yellow border-PS-dark-yellow border-4 rounded-lg shadow-lg p-12 w-full max-w-7xl">
                            <h1 className={`text-4xl font-bold mb-6 text-center ${cherryBomb.className} text-PS-art-color`}>{Stories[currentLevel]?.title}</h1>
                            {message && (
                                <div className={`mb-4 p-6 text-3xl rounded-lg text-center font-bold ${message.includes('Correct') ? 'text-green-700' : 'text-red-700'}  ${cherryBomb.className}`}>
                                    {message}
                                </div>
                            )}

                            <section id={"time-line-section"} className="mb-8 p-10">
                                <h2 className={`text-center text-4xl font-semibold mb-2 text-PS-art-color ${cherryBomb.className}`}>Timeline</h2>
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
                                                    width: '210px',
                                                    height: '130px',
                                                    margin: '0 3px',
                                                }}
                                            >
                                                {piece ?
                                                    renderPuzzlePiece(piece, index, true) :
                                                    <span className=" text-PS-art-color text-center text-lg p-2">Place piece {index + 1} here</span>
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
                                className="bg-PS-gray p-8 rounded-lg"
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handlePoolDrop}
                            >
                                <div className="flex flex-wrap justify-center">
                                    {shuffledPieces.map((piece, index) => renderPuzzlePiece(piece, index))}
                                    {shuffledPieces.length === 0 && (
                                        <p className="text-gray-900 text-2xl">No more pieces available</p>
                                    )}
                                </div>
                            </section>
                        </section>
                            </>
                    ) : (
                        <>
                            <div className="flex flex-col justify-between items-center">
                                <section id={"title-section"} className="w-full max-w-4xl rounded-lg">
                                    <div className="flex justify-center">
                                        <Title>Cook The Book</Title>
                                    </div>
                                </section>
                                <section id={"scoreboard"} className={"pb-4"}>
                                    <div className="flex items-center space-x-6">
                                        <div id={"score-board"} className="bg-PS-light-yellow border-PS-dark-yellow border-1 text-PS-art-color px-9 py-3 rounded-full font-bold text-3xl">
                                            Score: {score}/30
                                        </div>
                                    </div>
                                </section>
                            </div>
                            <section id={"game-section"} className="bg-PS-light-yellow border-PS-dark-yellow border-4 rounded-lg shadow-lg p-6 w-full max-w-7xl">
                                <h1 className={`text-2xl font-bold mb-6 text-center ${cherryBomb.className} text-PS-art-color`}>{ lifesAvailable ? "Game completed!" : "You don't have lifes to keep playing"}</h1>
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
                                            <p className="text-gray-500 py-8"></p>
                                        )}
                                    </div>
                                </section>
                            </section>

                        </>
                    )}
                </main>
                {
                    lifesAvailable &&
                    <section id={"buttons-section"} className="flex justify-center space-x-36 p-4">
                        { currentlyPlaying() ? (
                            <>
                                <Button size={"large"} onClick={verifyOrder}>Verify Order</Button>
                                <Button size={"large"} onClick={resetLevel}>Reset Level</Button>
                            </>
                        ) : (
                            <Button size={"large"} onClick={replayGame}>Play Again</Button>
                        )}

                    </section>
                }
                <Footer></Footer>
            </div>
        </>
    );
};

export default CookTheBook;