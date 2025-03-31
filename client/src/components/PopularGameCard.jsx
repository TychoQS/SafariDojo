import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import subjects from "../../../database/jsondata/Subject.json";
import gamesData from "../../../database/jsondata/Games.json";
import {patrickHand, cherryBomb} from "@/styles/fonts";
import {useAuth} from "@/pages/context/AuthContext";

const Card = ({gameSubject, gameNumber, medalType}) => {
    const {isLoggedIn, user} = useAuth();
    const router = useRouter();

    const subject = subjects.find(subject => subject.subjectName === gameSubject);
    const {subjectName, baseIcon, borderColor} = subject || {};

    const gamesList = gamesData[gameSubject.toLowerCase()] || [];
    const gameName = gamesList[gameNumber - 1]?.gameName;

    const difficultyMap = {
        bronze: "easy",
        silver: "medium",
        gold: "hard"
    };
    const selectedDifficulty = difficultyMap[medalType];

    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        if (isLoggedIn && user) {
            const storedGames = JSON.parse(localStorage.getItem(`completedGames_${user.id}`)) || [];
            setIsCompleted(storedGames.some(game =>
                game.subject === gameSubject &&
                game.gameName === gameName &&
                game.difficulty === selectedDifficulty
            ));
        }
    }, [isLoggedIn, user, gameSubject, gameName, selectedDifficulty]);

    const handleClick = () => {
        if (!isLoggedIn && (gameNumber !== 1 || selectedDifficulty !== "easy")) {
            alert("You must log in");
            router.push("/LogIn");
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

            router.push({
                pathname: "/QuizzPreview",
                query: {Subject: gameSubject, Game: gameName, Age: selectedDifficulty}
            });
        }
    };

    return (
        <div
            className="relative flex items-center w-150 h-15 bg-white border-3 border-PS-light-black rounded-lg overflow-hidden shadow-lg cursor-pointer"
            onClick={handleClick}
        >
            <div className="flex items-center px-4 py-2 w-full">
                <div className="flex flex-col justify-center items-center w-20">
                    <span className={`text-PS-light-black text-xs ${patrickHand.className}`}>
                        {subjectName}
                    </span>
                    <div className="w-5 h-5 rounded-full" style={{backgroundColor: borderColor}}/>
                </div>

                <div className={`text-3xl text-PS-light-black mr-2 ${cherryBomb.className}`}>
                    <span>{gameName}</span>
                </div>

                <div
                    className="absolute right-25 -translate-x-1/2 top-1/2 transform -translate-y-1/2 w-10 h-10 flex justify-center items-center">
                    <img
                        src={`/images/Medals/${medalType}Medal.png`}
                        alt={`${medalType} medal`}
                        className="w-full h-full object-contain"
                    />
                    <img
                        src={baseIcon}
                        alt="Base Icon"
                        className="absolute mb-1 left-[20%] transform -translate-x-1/2 w-4 h-4 object-contain"
                    />
                    <span className={`ml-2 text-lg font-bold text-PS-light-black ${patrickHand.className}`}>+1</span>
                </div>
            </div>

            <div
                className={`absolute right-0 -translate-x-1/2 top-1/2 transform -translate-y-1/2 w-10 h-10 flex justify-center items-center text-lg rounded-full ${isCompleted ? 'bg-green-500' : 'bg-gray-400'}`}
            >
                {isCompleted ? '✓' : '♦'}
            </div>
        </div>
    );
};

export default Card;
