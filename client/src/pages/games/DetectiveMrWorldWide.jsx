import React, {useState, useEffect, useRef} from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Lifes from "@/components/Lifes";
import Title from "@/components/Title";
import Button from "@/components/Button";
import {useRouter} from "next/router";
import ErrorReportModal from "@/components/ErrorModal";
import {useTranslation} from "react-i18next";
import CongratsModal from "@/components/CongratsModal";
import GameOverModal from "@/components/GameOverModal";

const MAX_CLIPPATHS = 6;

function fetchCountries(difficulty = 'easy') {
    return fetch(`http://localhost:8080/api/getCountries?` + new URLSearchParams({
        difficulty: difficulty.toLowerCase()
    }), {
        method: "GET",
        headers: {'Content-Type': 'application/json'},
    });
}

function DetectiveMrWorldWide() {
    const {t} = useTranslation();

    const [guess, setGuess] = useState("");
    let [gameCountries, setGameCountries] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(0);

    const [tries, setTries] = useState(5);
    const lifesRef = useRef(null);

    const [gameStatus, setGameStatus] = useState("playing");
    const [fullImage, setFullImage] = useState(false);
    const [clipPathIndex, setClipPathIndex] = useState(0);

    const router = useRouter();

    const fetchGameData = async () => {
        if (!router.isReady) return;
        let difficulty = router.query.Age || "easy";
        const response = await fetchCountries(difficulty);
        if (response.ok) {
            let fetchedCountries = await response.json();
            fetchedCountries.sort(() => 0.5 - Math.random());
            setGameCountries(fetchedCountries.slice(0,5));
        }

    }

    useEffect(() => {
        if (router.isReady) {
            fetchGameData().then(() => (console.log("Loaded game countries")));
        }
    }, [router.isReady, router.query.Age]);

    function getRandomNumber() {
        return Math.floor(Math.random() * MAX_CLIPPATHS);
    }

    function validatePicture() {
        if (gameStatus === "finished") return;

        setFullImage(true);
        if (isGuessCorrect()) {
            setScore(prevScore => prevScore + 5);
        } else {
            lifesRef.current.loseLife();
            setTries(prev => prev - 1);
        }

        if (currentIndex === gameCountries.length - 1) {
            setGameStatus("finished");
            setBestScore(Math.max(bestScore, score));
        } else {
            setGameStatus("waiting");
        }

    }

    function isGuessCorrect() { return gameCountries[currentIndex]?.name.trim().toLowerCase() === guess.trim().toLowerCase();}

    function getMessage() {
        if (!isGuessCorrect())
        return (
        <div className={"flex flex-col items-center justify-center gap-5"}>
            <p className={"flex flex-col text-red-600 text-2xl"}>Incorrect</p>
            <p className={"flex flex-col text-black text-xl"}>Actual Name:
                <span className={"font-bold text-2xl text-blue-600"}>{gameCountries[currentIndex]?.name}</span></p>
        </div>)
        else return(
            <div className={"flex flex-col items-center justify-center gap-5"}>
                <p className={"flex flex-col text-green-600 text-2xl"}>Correct</p>
                <p className={"flex flex-col text-black text-xl"}>Actual Name:
                    <span className={"font-bold text-2xl text-blue-600"}>{gameCountries[currentIndex]?.name}</span></p>
            </div>)
    }

    function nextGame() {
        setCurrentIndex(prev => prev + 1);
        setGuess("");
        setGameStatus("playing")
        setFullImage(false);
        setClipPathIndex(getRandomNumber());
    }

    function restartGame() {
        fetchGameData().then(() => {console.log("Countries' flags loaded")});
        setCurrentIndex(0);
        setFullImage(false);
        setTries(5);
        setScore(0);
        setGuess("");
        setClipPathIndex(getRandomNumber());
        setGameStatus("playing");
    }

    const getClipPathStyle = () => {
        if (fullImage) return {
            width: "100%",
            height: "100%",
            objectFit: "cover"
        };

        const cols = 3;
        const rows = 3;

        const clipPaths = [
            `inset(0% ${100 - (100/cols)}% 0% 0%)`,
            `inset(0% ${100 - (2*100/cols)}% 0% ${100/cols}%)`,
            `inset(0% 0% 0% ${2*100/cols}%)`,
            `inset(0% 0% ${100 - (100/rows)}% 0%)`,
            `inset(${2*100/rows}% 0% 0% 0%)`
        ];

        const clipPath = clipPaths[clipPathIndex];

        return {
            clipPath: clipPath,
            width: "100%",
            height: "100%",
            objectFit: "cover"
        };
    };

    const closeModal = () => {
        setGameStatus("playing");
        saveScore();
        setTimeout(() => {
            router.back();
        }, 0);
    };

    const playAgain = () => {
        saveScore();
        restartGame();
    }

    function saveScore() {
        try {
            const gameTitle = "Detective MrWorldWide";
            const age = router.query.Age;
            if (age) {
                const key = `${gameTitle}_${age}_bestScore`;
                const storesScore = parseInt(localStorage.getItem(key) || "0", 10);
                if (score > storesScore) {
                    localStorage.setItem(key, score.toString());
                }
            }

            const currentScore = parseInt(localStorage.getItem(`${gameTitle}_${age}_bestScore`) || "0", 10);
            const medalType = age === "easy"
                ? "BronzeMedal" : age === "medium" ? "SilverMedal" : "GoldMedal";
            const medalKey = `${gameTitle}_${medalType}`;
            const medalStatus = localStorage.getItem(medalKey) === "1";
            if (!medalStatus && currentScore > (gameCountries.length - 2 * 5)) {
                localStorage.setItem(medalKey, "1");
            }
        } catch (error) {
            console.error("Error processing score update: ", error);
        }
    }

    return (
        <div className="app min-h-screen flex flex-col bg-PS-main-purple">
            <Header></Header>
            <section className={"min-h-screen flex flex-col justify-evenly bg-PS-main-purple"}>

                <Title>Detective Mr. WorldWide</Title>
                <div className={"w-[50rem] max-w-6xl mx-auto"}>
                    {gameStatus !== "finished" && (
                        <div className="w-full relative mb-4 h-[2.5rem] flex items-center">
                            <div className="absolute left-0">
                                <Button size="small" onClick={() => router.back()}>
                                    {t("backButton")}
                                </Button>
                            </div>

                            <div className="absolute left-1/2 -translate-x-1/2">
                                <Lifes ref={lifesRef} />
                            </div>

                            <div className="absolute right-0">
                                <ErrorReportModal />
                            </div>
                        </div>
                    )}
                    <div className="h-150 flex flex-col self-center items-center justify-evenly border-4 rounded-2xl
            border-PS-dark-yellow bg-PS-light-yellow">

                        {gameStatus !== "finished" &&
                            <div className="w-100 h-60 flex justify-center items-center border-black border-4">
                                <img src={`/images/Games/Geography/${gameCountries[currentIndex]?.name || ""}.avif`}
                                     alt={gameCountries[currentIndex]?.name || ""}
                                     className="max-w-full max-h-full object-contain"
                                     style={getClipPathStyle()}/>
                            </div>
                        }


                        <div className="flex flex-row justify-center">
                            {gameStatus === "playing" ?
                                <div className={"flex flex-col items-center gap-6"}>
                                    <input className={"bg-[#E8B1EC] h-[50px] w-[350px] px-4 py-3 text-[20px] text-gray-600 outline-none rounded-lg border-2 transition-colors" +
                                        " duration-300 border-solid border-gray-500 focus:border-[black] focus:text-black"}
                                           placeholder={"Introduce the flag name..."} value={guess}
                                           onChange={(e) => setGuess(e.target.value)}
                                           onKeyDown={(e) => {if(e.key === "Enter") validatePicture(name,  guess);}
                                           }/>


                                    <button className={"cursor-pointer h-15 w-35 rounded-2xl " +
                                        "text-lg border-[#ED6EF6] bg-[#E8B1EC] text-black duration-300 hover:scale-110 " +
                                        "hover:bg-[#c450cc]"}
                                            onClick={() => validatePicture(name, guess)}>
                                        Resolve
                                    </button>
                                </div> : null}

                            {gameStatus === "waiting" ?
                                <div className={"flex flex-col items-center gap-6 text-center"}>
                                    {getMessage()}
                                    <button className={"cursor-pointer h-15 w-35 rounded-4xl duration-300 hover:scale-110 " +
                                        "hover:bg-[#c450cc] text-lg border-[#ED6EF6] bg-[#E8B1EC] text-black"}
                                            onClick={() => nextGame()}>
                                        Next
                                    </button>
                                </div> : null}

                            {gameStatus === "semiFinished" ?
                                <div>
                                    <div className={"flex flex-col items-center gap-6 text-center"}>
                                        {getMessage()}
                                        <Button onClick={() => setGameStatus("finished")}>Finish</Button>
                                    </div>

                                    <div>

                                    </div>


                                </div> : null}

                            {(gameStatus === "finished") &&
                                <CongratsModal
                                    points={score}
                                    onCloseMessage={closeModal}
                                    onRestart={playAgain}
                                />
                            }

                            {tries === 0 && (
                                <GameOverModal
                                    onCloseMessage={closeModal}
                                    onRestart={playAgain}
                                />
                            )}

                        </div>
                        {gameStatus !== "finished" ? (
                            <div className={"text-black text-2xl font-black flex justify-between"}>
                                <p className="text-gray-600 font-light">Score: {score}</p>
                            </div>) : null
                        }
                    </div>
                </div>

            </section>
            <Footer></Footer>
        </div>
    )
}

export default DetectiveMrWorldWide;