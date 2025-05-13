import React, {useState, useEffect, useRef} from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Lifes from "@/components/Lifes";
import {useRouter} from "next/router";
import {useTranslation} from "react-i18next";
import CongratsModal from "@/components/CongratsModal";
import GameOverModal from "@/components/GameOverModal";


function fetchPaintings(difficulty = 'easy') {
    return fetch(`http://localhost:8080/api/getPaintings?` + new URLSearchParams({
        difficulty: difficulty.toLowerCase()
    }), {
        method: "GET",
        headers: {'Content-Type': 'application/json'},
    });
}

function DetectiveLupin() {
    const {t} = useTranslation();

    const [guess, setGuess] = useState("");

    const [waiting, setWaiting] = useState(false);
    const [score, setScore] = useState(0);

    const [bestScore, setBestScore] = useState(0);
    const [tries, setTries] = useState(5);

    const [gameFinished, setGameFinished] = useState(false);
    const [gamePaintings, setGamePaintings] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const lifesRef = useRef(null);

    let currentPainting = gamePaintings[currentIndex];

    const router = useRouter();
    const fetchGameData = async () => {
        if (!router.isReady) return;
        let difficulty = router.query.Age || "easy";
        const response = await fetchPaintings(difficulty);
        if (response.ok) {
            let fetchedPaintings = await response.json();
            fetchedPaintings.sort(() => 0.5 - Math.random());
            setGamePaintings(fetchedPaintings.slice(0,7));
        }
    }

    useEffect(() => {
        if (router.isReady) {
            fetchGameData().then(() => (console.log("Loaded game countries")));
            setCurrentIndex(0);
        }
    }, [router.isReady, router.query.Age]);


    function isGuessCorrect() {
        return currentPainting?.name.trim().toLowerCase() === guess.trim().toLowerCase();
    }

    function validatePicture() {
        if (gameFinished) return;

        if (isGuessCorrect()) {
            setScore(prevScore => prevScore + 5);
        } else {
            lifesRef.current.loseLife();
            setTries(prev => prev - 1);
        }

        if (currentIndex === gamePaintings.length - 1) {
            setGameFinished(true);
            setBestScore(Math.max(bestScore, score));
            setWaiting(false);
        } else {
            setWaiting(true);
        }
    }

    function getMessage() {
        if (!isGuessCorrect())
            return (
                <div className={"flex flex-col items-center justify-center text-center gap-5"}>
                    <p className={"flex flex-col text-red-600 text-2xl"}>Incorrect</p>
                    <p className={"flex flex-col text-black text-xl"}>Actual Name:
                        <span className={"font-bold text-2xl text-blue-600"}>{gamePaintings[currentIndex]?.name}</span></p>
                </div>)
        else return(
            <div className={"flex flex-col items-center justify-center gap-5"}>
                <p className={"flex flex-col text-green-600 text-2xl"}>Correct</p>
            </div>)
    }

    function nextGame() {
        setCurrentIndex(prev => prev + 1);
        setGuess("");
        setMessage("");
        setWaiting(false);
    }

    function restartGame() {
        fetchGameData().then(() => {console.log("Game paintings loaded")});
        setCurrentIndex(0);
        setTries(5);
        setScore(0);
        setGuess("");
        if (lifesRef.current) lifesRef.current.resetHearts();
        setGameFinished(false);
    }

    const closeModal = () => {
        saveScore();
        setTimeout(() => {
            router.back();
        }, 0);
    };

    function saveScore() {
        try {
            const gameTitle = "Detective Lupin";
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
            if (!medalStatus && currentScore > (gamePaintings.length - 2 * 5)) {
                localStorage.setItem(medalKey, "1");
            }
        } catch (error) {
            console.error("Error processing score update: ", error);
        }
    }

    return (
        <div className="app min-h-screen flex flex-col bg-PS-main-purple ">
            <Header></Header>
            <section className={"min-h-screen flex flex-col justify-evenly bg-PS-main-purple"}>

                <div className="flex items-end justify-end">
                    <Lifes ref={lifesRef} />
                </div>

                <div className="h-150 w-175 flex flex-col self-center items-center justify-evenly border-4 rounded-2xl
            border-PS-dark-yellow bg-PS-light-yellow">

                    <div className="max-w-80 max-h-80 min-h-50 flex justify-center items-center">
                        <img src={`${currentPainting?.image}`} alt={`${currentPainting?.name}`} className="max-w-full max-h-full object-contain"/>
                    </div>

                    <div className="flex flex-col justify-center items-center gap-10">
                        {!waiting && (
                            <input className={"bg-[#F2C1BB] h-[50px] w-[350px] px-4 py-3 text-[20px] text-gray-600 outline-none rounded-lg border-2 transition-colors" +
                                " duration-300 border-solid border-[#F67C6E] focus:border-[black] focus:text-black"}
                                   placeholder={"Introduce the painting name..."} value={guess}
                                   onChange={(e) => setGuess(e.target.value)}
                                   onKeyDown={(e) => {if(e.key === "Enter") validatePicture();}
                                   }/>
                        )}

                        {(!waiting && !gameFinished) ?
                            <button className={"cursor-pointer h-15 w-35 rounded-2xl " +
                                "text-lg border-2 border-[#F67C6E] bg-[#F2C1BB] text-black duration-300 hover:scale-110 " +
                                "hover:bg-[#F67C6E]"}
                                    onClick={() => validatePicture()}>
                                Resolve
                            </button> : null}

                        {(waiting && !gameFinished) ?
                            <div className={"flex flex-col items-center gap-6"}>
                                {getMessage()}
                                <button className={"cursor-pointer h-15 w-35 rounded-2xl " +
                                    "text-lg border-2 border-[#F67C6E] bg-[#F2C1BB] text-black duration-300 hover:scale-110 " +
                                    "hover:bg-[#F67C6E]"}
                                        onClick={() => nextGame()}>
                                    Next
                                </button>
                            </div>
                            : null}
                    </div>
                        {(gameFinished) &&
                            <CongratsModal
                                points={score}
                                onCloseMessage={closeModal}
                                onRestart={restartGame}
                            />
                        }

                        {tries === 0 && (
                            <GameOverModal
                                onCloseMessage={closeModal}
                                onRestart={restartGame}
                            />
                        )}

                    <div className={"text-black text-2xl font-black"}>{score}</div>
                </div>
            </section>
            <Footer></Footer>
        </div>
    )
}


export default DetectiveLupin;