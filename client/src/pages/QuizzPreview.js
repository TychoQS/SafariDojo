import React, {useEffect, useState} from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {useAuth} from "@/pages/context/AuthContext";
import {useRouter} from "next/router";
import Lifes from "@/components/Lifes";
import Button from "@/components/Button";
import Title from "@/components/Title";
import {cherryBomb} from "@/styles/fonts";
import {useProfile} from "@/pages/context/ProfileContext";
import ModalButton from "@/components/ModalButton";
import Link from "next/link";

function QuizzPreview() {
    const {isLoggedIn, user} = useAuth();
    const {profile, updateProfile} = useProfile();
    const router = useRouter();

    const [subject, setSubject] = useState(null);
    const [subjectData, setSubjectData] = useState(null);
    const [gameData, setGameData] = useState(null);
    const [age, setDifficulty] = useState(null);
    const [bestScore, setBestScore] = useState();
    const [gamePremium, setGamePremium] = useState(false);
    const [showPremiumModal, setShowPremiumModal] = useState(false);
    const [gameRequiresRegister, setGameRequiresRegister] = useState(false);
    const [youtubeLink, setYoutubeLink] = useState("https://www.youtube.com/embed/dQw4w9WgXcQ");

    useEffect(() => {
        if (router.isReady) {
            const querySubject = router.query.Subject;
            const queryGame = router.query.Game;
            const queryDifficulty = router.query.Age;
            setSubject(querySubject);
            setGameData(queryGame);
            setDifficulty(queryDifficulty);
        }
        localStorage.setItem('previousURL', window.location.href);
    }, [router.isReady, router.query]);

    async function fetchIsPremium() {
        if (gameData) {
            const response = await fetch(`http://localhost:8080/api/isPremiumGame?quizName=${gameData}`);
            if (response.ok) {
                const data = await response.json();
                setGamePremium(data.isPremium);
            } else {
                console.error("Error fetching premium status");
            }
        }
    }

    async function fetchIsRegisterGame() {
        if (gameData) {
            const response = await fetch(`http://localhost:8080/api/isRegisterGame?quizName=${gameData}`);
            if (response.ok) {
                const data = await response.json();
                setGameRequiresRegister(data.isRegister);
            } else {
                console.error("Error fetching register status");
            }
        }
    }

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

    async function fetchTutorialVideo() {
        if (gameData) {
            const response = await fetch(`http://localhost:8080/api/getTutorialVideo?quizName=${gameData}`);
            if (response.ok) {
                const data = await response.json();
                if (data.tutorialVideo) {
                    const embedUrl = convertToEmbedUrl(data.tutorialVideo);
                    setYoutubeLink(embedUrl);
                }
            } else {
                console.warn("No tutorial video found for this quiz.");
            }
        }
    }

    function convertToEmbedUrl(url) {
        const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/);
        if (match && match[1]) {
            return `https://www.youtube.com/embed/${match[1]}`;
        }
        return url;
    }

    useEffect(() => {
        const fetchData = async () => {
            await fetchSubjectData();
            await fetchIsPremium();
            await fetchIsRegisterGame();
            await fetchTutorialVideo();

            if (isLoggedIn && (!gamePremium || (gamePremium && profile.isPremium))) {
                await fetchBestScore();
            }
        };
        fetchData();
    }, [gameData, subject, age]);

    const selectGameIcon = subjectData?.PreviewGameImage;

    const handlePremiumToggle = async () => {
        setShowPremiumModal(false);
        {
            await router.push("/BillingForm");
        }
    };

    async function startGame() {
        if (!gameData) {
            console.log("The param 'Game' is not in the URL.");
            return;
        }

        const isGamePremium = gamePremium;
        const isUserPremium = profile?.isPremium;

        if (( gamePremium || gameRequiresRegister ) && !isLoggedIn) {
            sessionStorage.setItem("loginRedirectFrom", "quizGamePreview");
            await router.push("/LogIn");
            return;
        }

        if (isGamePremium && !isUserPremium && isLoggedIn) {
            setShowPremiumModal(true);
            return;
        }

        const decodedGame = decodeURIComponent(gameData);
        const formattedGame = decodedGame
            .replace(/(?:^|\s)\w/g, (match) => match.toUpperCase())
            .replace(/\s+/g, '');
        window.location.href = `/games/${formattedGame}?Age=${age}`;
    }

    return (
        <div id={"QuizzPreviewComponent"} className="app flex min-h-screen flex-col bg-PS-main-purple">
            <Header/>
            <div className="flex items-end justify-end">
                <Lifes/>
            </div>

            <main className="flex-grow flex flex-col items-center justify-center p-6 space-y-16">
                <div className="flex flex-col items-center w-full space-y-8">
                    <Title className="text-white text-3xl font-bold">{gameData}</Title>

                    <div className="w-full flex justify-start ml-8">
                        <Button size="small" onClick={() => router.back()}>
                            Back
                        </Button>
                    </div>


                    <div className="flex flex-col md:flex-row w-full max-w-7xl items-center justify-center gap-16 m-4">
                        <div className="w-full relative" style={{paddingTop: '40%'}}>
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
                        <div
                            className={`w-64 h-12 text-2xl text-PS-dark-yellow bg-PS-light-black p-4 rounded-2xl shadow-md flex items-center justify-center font-black ${cherryBomb.className}`}>
                            🏆 Best Score: {bestScore}
                        </div>
                    )}
                    <Button size="large" onClick={startGame}>Start</Button>
                </div>

                {showPremiumModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/20">
                        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md mx-auto">
                            <h2 className="text-2xl font-semibold text-gray-800">Do you want to join the elite?</h2>
                            <p className="text-lg text-gray-600 mt-2">
                                The subscription price is €14.99 per month.
                            </p>
                            <div className="flex justify-center gap-6 mt-6">
                                <ModalButton
                                    text="Yes"
                                    color="green"
                                    onClick={handlePremiumToggle}
                                />
                                <ModalButton
                                    text="No"
                                    color="gray"
                                    onClick={() => setShowPremiumModal(false)}
                                />
                            </div>
                        </div>
                    </div>
                )}


            </main>

            <Footer/>
        </div>
    )
}

export default QuizzPreview;
