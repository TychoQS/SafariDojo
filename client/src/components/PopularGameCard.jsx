import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {cherryBomb, patrickHand} from "@/styles/fonts";
import {useAuth} from "@/pages/context/AuthContext";
import BaseModal from "@/components/BaseModal";
import {useTranslation} from 'react-i18next';
import { X, CheckCheck} from 'lucide-react';

const Card = ({gameSubject, gameNumber, isCompleted: isCompletedProp = null}) => {
    const {isLoggedIn, user} = useAuth();
    const router = useRouter();
    const {t} = useTranslation();
    const [gameName, setGameName] = useState(null);
    const [selectedDifficulty, setSelectedDifficulty] = useState(null);
    const [isCompleted, setIsCompleted] = useState(isCompletedProp);
    const [primaryColor, setPrimaryColor] = useState(null);
    const [showModalDifficulty, setShowModalDifficulty] = useState(false);
    const [showModalLogin, setShowModalLogin] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [colorRes, nameRes] = await Promise.all([
                    fetch(`http://localhost:8080/api/getPrimaryColor?subjectName=${gameSubject}`),
                    fetch(`http://localhost:8080/api/getQuizName?quizId=${gameNumber}`)
                ]);

                if (colorRes.ok) {
                    const {primaryColor} = await colorRes.json();
                    setPrimaryColor(primaryColor);
                }
                if (nameRes.ok) {
                    const {quizName} = await nameRes.json();
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
            setShowModalDifficulty(true);
            return;
        }

        if (!isLoggedIn && (gameNumber !== 1 || selectedDifficulty !== "easy")) {
            setShowModalLogin(true);
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
                    //setIsCompleted(true);
                }
            }

            await router.push({
                pathname: "/QuizzPreview",
                query: {Subject: gameSubject, Game: gameName, Age: selectedDifficulty}
            });
        }
    };

    useEffect(() => {
        const EasyKey = `_BronzeMedal`;
        const HardKey = `_GoldMedal`;
        const MediumKey = `_SilverMedal`;
        const COMPLETED = '1';
        switch (selectedDifficulty) {
            case "Easy":
                console.log("easy");
                if (localStorage.getItem(`${gameName}${EasyKey}`) === COMPLETED) setIsCompleted(true);
                else setIsCompleted(false);
                break;
            case 'Medium':
                console.log("medium");
                if (localStorage.getItem(`${gameName}${MediumKey}`) === COMPLETED) setIsCompleted(true);
                else setIsCompleted(false);
                break;
            case 'Hard':
                console.log("hard");
                if (localStorage.getItem(`${gameName}${HardKey}`) === COMPLETED) setIsCompleted(true);
                else setIsCompleted(false);
                break;
            default:
                setIsCompleted(null);
                break;
        }
    }, [selectedDifficulty]);

    const handleDifficultyChange = (difficulty) => {
        if (selectedDifficulty === difficulty) {
            setSelectedDifficulty(null);
        } else {
            setSelectedDifficulty(difficulty);
        }
    };

    const closeModalDifficulty = () => {
        setShowModalDifficulty(false);
    };

    const closeModalLogin = () => {
        setShowModalLogin(false);
    };

    const handleLoginRedirect = () => {
        closeModalLogin();
        router.push("/LogIn");
    };

    return (
        <div
            className="relative flex items-center justify-between w-150 h-20 bg-white border-2 border-PS-light-black rounded-lg overflow-hidden shadow-md p-4 cursor-pointer"
            onClick={handleClick}
        >
            <div className="flex items-center gap-4">
                <div className="flex flex-col justify-center items-center w-10">
                    <span className={`text-PS-light-black text-xs ${patrickHand.className}`}>
                        {t(`subjects.${gameSubject}`)}
                    </span>
                    <div className="w-5 h-5 rounded-full" style={{backgroundColor: `#${primaryColor}`}}/>
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
                            {t(`difficulty.${difficulty.toLowerCase()}`)}
                        </button>
                    );
                })}
            </div>

            <div id={"completed-mark"}
                className={`flex justify-center items-center w-8 h-8 rounded-full text-lg ${isCompleted !== null ? isCompleted ? 'bg-green-500' : 'bg-red-600' : 'bg-gray-400'}`}
            >

                {   isCompleted !== null ?
                    isCompleted ? <CheckCheck className={"text-white"}/> : <X className={"text-white"}/>
                    :
                    '♦'
                }
            </div>

            {showModalDifficulty && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/20"
                     onClick={closeModalDifficulty}>
                    <div onClick={(e) => e.stopPropagation()}>
                        <BaseModal
                            title={t('modal.select_difficulty')}
                            buttons={[
                                {text: t('modal.got_it'), color: "gray", onClick: closeModalDifficulty},
                            ]}
                        />
                    </div>
                </div>
            )}

            {showModalLogin && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/20"
                     onClick={closeModalLogin}>
                    <div onClick={(e) => e.stopPropagation()}>
                        <BaseModal
                            title={t('modal.must_login')}
                            buttons={[
                                {text: t('modal.login'), color: "green", onClick: handleLoginRedirect},
                                {text: t('modal.cancel'), color: "gray", onClick: closeModalLogin},
                            ]}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Card;