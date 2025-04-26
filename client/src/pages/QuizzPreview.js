import React, { useEffect, useState } from 'react'
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/pages/context/AuthContext";
import { useRouter } from "next/router";
import games from "../../../database/jsondata/Games.json";
import Lifes from "@/components/Lifes";
import Button from "@/components/Button";
import Title from "@/components/Title";
import {cherryBomb} from "@/styles/fonts";

function QuizzPreview() {
    const { isLoggedIn } = useAuth();
    const router = useRouter();

    const [subject, setSubject] = useState(null);
    const [subjectData, setSubjectData] = useState(null);

    const [game, setGame] = useState(null);
    const [gameData, setGameData] = useState(null);

    const [age, setAge] = useState(null);
    const [bestScore, setBestScore] = useState(0);

    useEffect(() => {
        if (router.isReady) {
            const querySubject = router.query.Subject;
            const queryGame = router.query.Game;
            const queryAge = router.query.Age;
            setSubject(querySubject);
            setGame(queryGame);
            setAge(queryAge);
        }
    }, [router.isReady, router.query]);

    async function fetchSubjectData() {
        if (subject) {
            const foundSubjectData = await fetch(`http://localhost:8080/api/gameSelectionAssets?` + new URLSearchParams({
                subject: subject
            }), {
                method: 'GET',
                headers: {'Content-Type': 'application/json'},
            });
            if (foundSubjectData) {
                const quizPreviewSubjectData = await foundSubjectData.json();
                setSubjectData(quizPreviewSubjectData);
            }
        }
    }

    async function fetchBestScore() {
        if (game) {
            const storedScore = localStorage.getItem(`${game}_bestScore`);
            if (storedScore) {
                setBestScore(parseInt(storedScore));
            }
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            await fetchSubjectData();
            await fetchBestScore();
        }
        fetchData();

        if (subject && game) {
            const subjectGames = games[subject.toLowerCase()];
            if (subjectGames) {
                const foundGameData = subjectGames.find(item => item.gameName === game);
                if (foundGameData) {
                    setGameData(foundGameData);
                }
            }
        }
    }, [game, subject]);

    const selectGameIcon = subjectData?.PreviewGameImage;
    const youtubeLink = gameData?.youtubePreview || "https://www.youtube.com/embed/dQw4w9WgXcQ";

    function startGame() {
        if (game) {
            const decodedGame = decodeURIComponent(game);
            const formattedGame = decodedGame.replace(/(?:^|\s)\w/g, (match) => match.toUpperCase()).replace(/\s+/g, '');
            window.location.href = `/games/${formattedGame}`;
        } else {
            console.log("The param 'Game' is not in the URL.");
        }
    }

    return (
        <div id={"QuizzPreviewComponent"} className="app flex min-h-screen flex-col bg-PS-main-purple">
            <Header />
            <div className="flex items-end justify-end">
                <Lifes />
            </div>

            <main className="flex-grow flex flex-col items-center justify-center p-6 space-y-16">
                <div className="flex flex-col items-center w-full space-y-8">
                    <Title className="text-white text-3xl font-bold">{game}</Title>

                    <div className="flex flex-col md:flex-row w-full max-w-7xl items-center justify-center gap-16 m-4">
                        <div className="w-full relative" style={{ paddingTop: '40%' }}>
                            <iframe
                                src={youtubeLink}
                                title="Game Preview Video"
                                allowFullScreen
                                className="absolute top-0 left-0 w-full h-full rounded-2xl shadow-lg"
                            ></iframe>
                        </div>

                        <div className="w-full md:w-1/2 flex justify-center flex-grow">
                            <img
                                id={"MascotImage"}
                                className="object-contain max-h-[1000px] w-auto"
                                src={selectGameIcon}
                                alt="Mascot"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-row items-center gap-16">
                    <div className={`w-64 h-12 text-2xl text-PS-dark-yellow bg-PS-light-black p-4 rounded-2xl shadow-md flex items-center justify-center font-black ${cherryBomb.className}`}>
                        🏆 Best Score: {bestScore}
                    </div>
                    <Button size="large" onClick={startGame}>Start</Button>
                </div>

            </main>

            <Footer />
        </div>
    )
}

export default QuizzPreview;
