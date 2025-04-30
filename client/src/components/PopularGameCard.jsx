import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {patrickHand, cherryBomb} from "@/styles/fonts";
import {useAuth} from "@/pages/context/AuthContext";

const Card = ({ gameSubject, gameNumber, isCompleted: isCompletedProp = null }) => {
    const {isLoggedIn, user} = useAuth();
    const router = useRouter();
    const [gameName, setGameName] = useState(null);

    const [selectedDifficulty, setSelectedDifficulty] = useState(null);
    const [isCompleted, setIsCompleted] = useState(isCompletedProp);
    const [primaryColor, setPrimaryColor] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [colorRes, nameRes] = await Promise.all([
                    fetch(`http://localhost:8080/api/getPrimaryColor?subjectName=${gameSubject}`),
                    fetch(`http://localhost:8080/api/getQuizName?quizId=${gameNumber}`)
                ]);

                if (colorRes.ok) {
                    const { primaryColor } = await colorRes.json();
                    setPrimaryColor(primaryColor);
                }
                if (nameRes.ok) {
                    const { quizName } = await nameRes.json();
                    setGameName(quizName);
                }
            } catch (err) {
                console.error(err);
            }
        };

        if (gameSubject && gameNumber) fetchData();
    }, [gameSubject, gameNumber]);


    const handleClick = async () => {
        if (selectedDifficulty === null) {
            alert("Please select a difficulty before proceeding.");
            return;
        }

        if (!isLoggedIn && (gameNumber !== 1 || selectedDifficulty !== "easy")) {
            alert("You must log in");
            await router.push("/LogIn");
        } else {
            if (isLoggedIn) {
                const storedGames = JSON.parse(localStorage.getItem(`completedGames_${user.id}`)) || [];
                const newGame = {subject: gameSubject, gameName, difficulty: selectedDifficulty};

                if (!storedGames.some(game =>
                    game.subject === gameSubject &&
                    game.gameName === gameName &&
                    game.difficulty === selectedDifficulty
                )) {
                    storedGames.push(newGame);
                    localStorage.setItem(`completedGames_${user.id}`, JSON.stringify(storedGames));
                    setIsCompleted(true);
                }
            }

            await router.push({
                pathname: "/QuizzPreview",
                query: {Subject: gameSubject, Game: gameName, Age: selectedDifficulty}
            });
        }
    };

    const handleDifficultyChange = (difficulty) => {
        if (selectedDifficulty === difficulty) {
            setSelectedDifficulty(null);
        } else {
            setSelectedDifficulty(difficulty);
        }
    };

    return (
        <div
            className="relative flex items-center justify-between w-150 h-20 bg-white border-2 border-PS-light-black rounded-lg overflow-hidden shadow-md p-4 cursor-pointer"
            onClick={handleClick}
        >
            <div className="flex items-center gap-4">
                <div className="flex flex-col justify-center items-center w-10">
                    <span className={`text-PS-light-black text-xs ${patrickHand.className}`}>
                        {gameSubject}
                    </span>
                    <div className="w-5 h-5 rounded-full" style={{backgroundColor: `#${primaryColor}`}} />
                </div>

                <div className={`text-2xl text-PS-light-black ${cherryBomb.className}`}>
                    {gameName}
                </div>
            </div>

            <div className="absolute right-18 flex items-center gap-2">
                {["Easy", "Medium", "Hard"].map((difficulty) => {
                    const buttonColors = {
                        Easy: "bg-green-50 hover:bg-green-300",
                        Medium: "bg-yellow-50 hover:bg-yellow-300",
                        Hard: "bg-red-50 hover:bg-red-300",
                    };

                    const activeColors = {
                        Easy: "bg-green-500",
                        Medium: "bg-yellow-500",
                        Hard: "bg-red-500",
                    };

                    return (
                        <button
                            key={difficulty}
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDifficultyChange(difficulty);
                            }}
                            className={`px-2 py-1 rounded-full text-xs border transition duration-300 ease-in-out ${
                                selectedDifficulty === difficulty
                                    ? `${activeColors[difficulty]} text-white`
                                    : `${buttonColors[difficulty]} text-gray-600`
                            }`}
                        >
                            {difficulty}
                        </button>
                    );
                })}
            </div>

            <div
                className={`flex justify-center items-center w-8 h-8 rounded-full text-lg ${isCompleted ? 'bg-green-500' : 'bg-gray-400'}`}
            >
                {isCompleted ? '✓' : '♦'}
            </div>
        </div>
    );
};

export default Card;
