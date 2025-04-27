import React, { useEffect, useState } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/pages/context/AuthContext";
import { useRouter } from "next/router";
import Lifes from "@/components/Lifes";
import Button from "@/components/Button";
import Title from "@/components/Title";
import { cherryBomb } from "@/styles/fonts";

function QuizzPreview() {
    const { isLoggedIn, user } = useAuth();
    const router = useRouter();

    const [subject, setSubject] = useState(null);
    const [subjectData, setSubjectData] = useState(null);
    const [gameData, setGameData] = useState(null);
    const [age, setDifficulty] = useState(null); // Dificultad
    const [bestScore, setBestScore] = useState(0);

    useEffect(() => {
        if (router.isReady) {
            const querySubject = router.query.Subject;
            const queryGame = router.query.Game;
            const queryDifficulty = router.query.Age;
            setSubject(querySubject);
            setGameData(queryGame);
            setDifficulty(queryDifficulty);
        }
    }, [router.isReady, router.query]);

    async function fetchSubjectData() {
        if (subject) {
            const response = await fetch(`http://localhost:8080/api/gameSelectionAssets?subject=${subject}`);
            if (response.ok) {
                const data = await response.json();
                setSubjectData(data);
            } else {
                console.error("Error fetching subject data");
            }
        }
    }

    async function fetchBestScore() {
        if (gameData && subject && age) {
            const storedScore = localStorage.getItem(`${gameData}_${age}_bestScore`);
            if (storedScore) {
                setBestScore(parseInt(storedScore));
            } else {
                const response = await fetch(`http://localhost:8080/api/getBestScore?userId=${user.userId}&quizId=${gameData}&difficulty=${age}`);
                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem(`${gameData}_${age}_bestScore`, data.bestScore)
                    setBestScore(data.bestScore);
                }
            }
        }
    }

    async function updateBestScore(newScore) {
        if (gameData && subject && age) {
            const response = await fetch('http://localhost:8080/api/updateBestScore', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.userId,
                    quizId: gameData,
                    difficulty: age,
                    bestScore: newScore
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data.message);
            } else {
                console.log("Error updating best score");
            }
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            await fetchSubjectData();
            await fetchBestScore();
        };
        fetchData();
    }, [gameData, subject, age]);

    const selectGameIcon = subjectData?.PreviewGameImage;
    const youtubeLink = gameData?.youtubePreview || "https://www.youtube.com/embed/dQw4w9WgXcQ";

    function startGame() {
        if (gameData) {
            const decodedGame = decodeURIComponent(gameData);
            const formattedGame = decodedGame.replace(/(?:^|\s)\w/g, (match) => match.toUpperCase()).replace(/\s+/g, '');
            window.location.href = `/games/${formattedGame}`;
        } else {
            console.log("The param 'Game' is not in the URL.");
        }
    }

    function finishGame(score) {
        if (score > bestScore) {
            setBestScore(score);
            localStorage.setItem(`${gameData}_${age}_bestScore`, score);
            updateBestScore(score);
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
                    <Title className="text-white text-3xl font-bold">{gameData}</Title>

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
                    {isLoggedIn && (
                        <div className={`w-64 h-12 text-2xl text-PS-dark-yellow bg-PS-light-black p-4 rounded-2xl shadow-md flex items-center justify-center font-black ${cherryBomb.className}`}>
                            🏆 Best Score: {bestScore}
                        </div>
                    )}
                    <Button size="large" onClick={startGame}>Start</Button>
                </div>

            </main>

            <Footer />
        </div>
    )
}

export default QuizzPreview;
