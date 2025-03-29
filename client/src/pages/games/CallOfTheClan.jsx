import React, { useState, useEffect, useCallback } from 'react';
import Title from "@/components/Title";
import Button from "@/components/Button";

const AnimalClassificationGame = () => {
    // Game configuration
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [gameActive, setGameActive] = useState(true);
    const [message, setMessage] = useState('Move your animal to the correct group!');
    const [gameWon, setGameWon] = useState(false);

    // Player position
    const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 50 });

    // Level definitions
    const levels = [
        {
            player: { type: 'dog', name: 'Dog', classification: 'mammal', emoji: '🐕' },
            groups: [
                { type: 'frogs', name: 'Frogs', classification: 'amphibian', emoji: '🐸', position: { x: 20, y: 20 } },
                { type: 'fish', name: 'Fish', classification: 'fish', emoji: '🐠', position: { x: 80, y: 20 } },
                { type: 'cats', name: 'Cats', classification: 'mammal', emoji: '🐈', position: { x: 20, y: 80 } },
                { type: 'birds', name: 'Birds', classification: 'bird', emoji: '/images/Games/Science/bird.png', position: { x: 80, y: 80 } },
            ]
        },
        {
            player: { type: 'eagle', name: 'Eagle', classification: 'bird', emoji: '🦅' },
            groups: [
                { type: 'butterflies', name: 'Butterflies', classification: 'insect', emoji: '🦋', position: { x: 20, y: 20 } },
                { type: 'birds', name: 'Birds', classification: 'bird', emoji: '🐦', position: { x: 80, y: 20 } },
                { type: 'bats', name: 'Bats', classification: 'mammal', emoji: '🦇', position: { x: 20, y: 80 } },
                { type: 'frogs', name: 'Frogs', classification: 'amphibian', emoji: '🐸', position: { x: 80, y: 80 } },
            ]
        },
        {
            player: { type: 'turtle', name: 'Turtle', classification: 'reptile', emoji: '🐢' },
            groups: [
                { type: 'snakes', name: 'Snakes', classification: 'reptile', emoji: '🐍', position: { x: 20, y: 20 } },
                { type: 'dolphins', name: 'Dolphins', classification: 'mammal', emoji: '🐬', position: { x: 80, y: 20 } },
                { type: 'crabs', name: 'Crabs', classification: 'crustacean', emoji: '🦀', position: { x: 20, y: 80 } },
                { type: 'butterflies', name: 'Butterflies', classification: 'insect', emoji: '🦋', position: { x: 80, y: 80 } },
            ]
        }
    ];

    // Get current level
    const currentLevel = levels[Math.min(level - 1, levels.length - 1)];

    // Handle player movement
    const handleKeyDown = useCallback((e) => {
        if (!gameActive) return;

        const speed = 10;
        setPlayerPosition(prev => {
            let newX = prev.x;
            let newY = prev.y;

            // WASD or arrow keys
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

            return { x: newX, y: newY };
        });
    }, [gameActive]);

    // Set up event listeners
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    // Check for collisions
    useEffect(() => {
        if (!gameActive) return;

        currentLevel.groups.forEach(group => {
            const distance = Math.sqrt(
                Math.pow(playerPosition.x - group.position.x, 2) +
                Math.pow(playerPosition.y - group.position.y, 2)
            );

            if (distance < 10) { // Distance to consider collision
                setGameActive(false);

                if (group.classification === currentLevel.player.classification) {
                    setMessage(`Correct! ${currentLevel.player.name} and ${group.name} are ${group.classification}s.`);
                    setScore(prev => prev + 100);

                    if (level === levels.length) {
                        setGameWon(true);
                    } else {
                        setTimeout(() => {
                            setLevel(prev => prev + 1);
                            setPlayerPosition({ x: 50, y: 50 });
                            setGameActive(true);
                            setMessage('Move your animal to the correct group!');
                        }, 2000);
                    }
                } else {
                    setMessage(`Incorrect! ${currentLevel.player.name} is a ${currentLevel.player.classification}, but ${group.name} are ${group.classification}s.`);
                    setTimeout(() => {
                        setPlayerPosition({ x: 50, y: 50 });
                        setGameActive(true);
                        setMessage('Try again! Find the correct group.');
                    }, 2000);
                }
            }
        });
    }, [playerPosition, gameActive, currentLevel, level, levels.length]);

    const restartGame = () => {
        setLevel(1);
        setScore(0);
        setPlayerPosition({ x: 50, y: 50 });
        setGameActive(true);
        setMessage('Move your animal to the correct group!');
        setGameWon(false);
    };

    return (
        <main className="bg-PS-main-purple w-dvw h-dvh flex flex-col justify-center items-center">
            <Title className="">Call Of The Clan</Title>
            <div className="relative w-[1200px] h-[800px] bg-PS-science-color rounded-lg overflow-hidden border-4 border-green-900">
                <div className="absolute top-0 left-0 w-full bg-green-600 bg-opacity-70 p-2 flex justify-between">
                    <div>Level: {level}/{levels.length}</div>
                    <div>Score: {score}</div>
                </div>

                <div className="absolute top-12 left-0 w-full text-center bg-green-600 bg-opacity-70 p-2">
                    {message}
                </div>

                {/* Player */}
                <div
                    className="absolute text-5xl transition-all duration-100 transform -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${playerPosition.x}%`, top: `${playerPosition.y}%` }}
                >
                    {currentLevel.player.emoji}
                </div>

                {/* Animal groups */}
                {currentLevel.groups.map((group, index) => (
                    <div
                        key={index}
                        className="absolute text-5xl transform -translate-x-1/2 -translate-y-1/2"
                        style={{ left: `${group.position.x}%`, top: `${group.position.y}%` }}
                    >
                        <div className="flex flex-col items-center text-black">
                            <span className="text-6xl mb-2">{group.emoji}</span>
                            <span className="bg-white bg-opacity-70 px-2 py-1 rounded text-sm">
                  {group.name}
                </span>
                        </div>
                    </div>
                ))}

                {/* Game won screen */}
                {gameWon && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-PS-science-color bg-opacity-80 text-black">
                        <h2 className="text-4xl font-bold mb-4">Congratulations!</h2>
                        <p className="text-2xl mb-6">All levels completed.</p>
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
    );
};

export default AnimalClassificationGame;