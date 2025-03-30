import React, {useState, useEffect, useCallback} from 'react';
import Title from "@/components/Title";
import Button from "@/components/Button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import levelsData from "../../../../database/jsondata/CallOfTheClan.json"

const AnimalClassificationGame = () => {
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [gameActive, setGameActive] = useState(true);
    const [message, setMessage] = useState('Move your animal to the correct group!');
    const [gameWon, setGameWon] = useState(false);

    const [playerPosition, setPlayerPosition] = useState({x: 50, y: 50});
    const allLevels = levelsData.allLevels;
    const [randomLevels, setRandomLevels] = useState([]);

    const selectRandomLevels = () => {
        const shuffled = [...allLevels].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 5);
    };

    useEffect(() => {
        setRandomLevels(selectRandomLevels());
    }, []);

    const currentLevel = randomLevels[Math.min(level - 1, randomLevels.length - 1)] || allLevels[0];

    const handleKeyDown = useCallback((e) => {
        if (!gameActive) return;

        const speed = 10;
        setPlayerPosition(prev => {
            let newX = prev.x;
            let newY = prev.y;

            switch (e.key.toLowerCase()) {
                case 'w':
                case 'arrowup':
                    newY = Math.max(0, prev.y - speed);
                    break;
                case 's':
                case 'arrowdown':
                    newY = Math.min(100, prev.y + speed);
                    break;
                case 'a':
                case 'arrowleft':
                    newX = Math.max(0, prev.x - speed);
                    break;
                case 'd':
                case 'arrowright':
                    newX = Math.min(100, prev.x + speed);
                    break;
                default:
                    break;
            }

            return {x: newX, y: newY};
        });
    }, [gameActive]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    useEffect(() => {
        if (!gameActive || !currentLevel) return;

        currentLevel.groups.forEach(group => {
            const distance = Math.sqrt(
                Math.pow(playerPosition.x - group.position.x, 2) +
                Math.pow(playerPosition.y - group.position.y, 2)
            );

            if (distance < 10) {
                setGameActive(false);

                if (group.classification === currentLevel.player.classification) {
                    setMessage(`Correct! ${currentLevel.player.name} and ${group.name} are ${group.classification}s.`);
                    setScore(prev => prev + 100);

                    if (level === randomLevels.length) {
                        setGameWon(true);
                    } else {
                        setTimeout(() => {
                            setLevel(prev => prev + 1);
                            setPlayerPosition({x: 50, y: 50});
                            setGameActive(true);
                            setMessage('Move your animal to the correct group!');
                        }, 2000);
                    }
                } else {
                    setMessage(`Incorrect! ${currentLevel.player.name} is a ${currentLevel.player.classification}, but ${group.name} are ${group.classification}s.`);
                    setTimeout(() => {
                        setPlayerPosition({x: 50, y: 50});
                        setGameActive(true);
                        setMessage('Try again! Find the correct group.');
                        setScore(prev => prev - 50)
                    }, 2000);
                }
            }
        });
    }, [playerPosition, gameActive, currentLevel, level, randomLevels.length]);

    const restartGame = () => {
        const newRandomLevels = selectRandomLevels();
        setRandomLevels(newRandomLevels);
        setLevel(1);
        setScore(0);
        setPlayerPosition({x: 50, y: 50});
        setGameActive(true);
        setMessage('Move your animal to the correct group!');
        setGameWon(false);
    };

    if (randomLevels.length === 0) {
        return <div>Loading game...</div>;
    }

    return (
        <div className="app min-h-screen flex flex-col bg-PS-main-purple ">
            <Header></Header>
            <main className="bg-PS-main-purple w-dvw h-dvh flex flex-col justify-center items-center">
                <Title className="">Call Of The Clan</Title>
                <Link href={{pathname: "../GameSelectionPage", query: {Subject: "Science"}}}>
                <div className="mt-4 mb-2 relative w-[1200px] flex justify-start">
                    <Button size="small" >Back</Button>
                </div>
                </Link>
                <div
                    className="relative w-[1200px] h-[800px] bg-PS-science-color rounded-lg overflow-hidden border-4 border-green-900 mb-2">
                    <div
                        className="absolute text-2xl top-0 left-0 w-full bg-green-600 bg-opacity-70 p-2 flex justify-between">
                        <div>Level: {level}/{randomLevels.length}</div>
                        <div>Score: {score}</div>
                    </div>

                    <div className="absolute text-xl top-12 left-0 w-full text-center bg-green-600 bg-opacity-70 p-2">
                        {message}
                    </div>

                    <div
                        className="absolute text-5xl transition-all duration-100 transform -translate-x-1/2 -translate-y-1/2"
                        style={{left: `${playerPosition.x}%`, top: `${playerPosition.y}%`}}
                    >
                        {currentLevel.player.emoji}
                    </div>

                    {currentLevel.groups.map((group, index) => (
                        <div
                            key={index}
                            className="absolute text-5xl transform -translate-x-1/2 -translate-y-1/2"
                            style={{left: `${group.position.x}%`, top: `${group.position.y}%`}}
                        >
                            <div className="flex flex-col items-center text-black">
                                <span className="text-6xl mb-2">{group.emoji}</span>
                                <span className="bg-white bg-opacity-70 px-2 py-1 rounded text-sm">
                                {group.name}
                            </span>
                            </div>
                        </div>
                    ))}

                    {gameWon && (
                        <div
                            className="absolute inset-0 flex flex-col items-center justify-center bg-PS-science-color text-black">
                            <h2 className="text-4xl font-bold mb-4">Game Over!</h2>
                            <p className="text-2xl mb-6">You've completed all 5 levels!</p>
                            <p className="text-xl mb-8">Final score: {score}</p>
                            <Button
                                size={"large"}
                                onClick={restartGame}
                            >
                                Play Again
                            </Button>
                        </div>
                    )}

                    <div className="absolute bottom-4 right-4 bg-white bg-opacity-70 p-2 rounded text-black">
                        Use WASD or Arrow keys to move
                    </div>
                </div>
            </main>
            <Footer></Footer>
        </div>
    );
};

export default AnimalClassificationGame;