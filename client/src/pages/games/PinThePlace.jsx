import React, {useState, useEffect, useRef} from 'react';
import Title from "@/components/Title";
import Button from "@/components/Button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Lifes from "@/components/Lifes";
import EuropeMap from "@/pages/games/modules/PinThePlace/EuropeMap";
import AfricaMap from "@/pages/games/modules/PinThePlace/AfricaMap";
import AsiaMap from "@/pages/games/modules/PinThePlace/AsiaMap";
import {useRouter} from "next/router";
import ErrorReportModal from "@/components/ErrorModal";
import {useTranslation} from "react-i18next";
import CongratsModal from "@/components/CongratsModal";
import GameOverModal from "@/components/GameOverModal";

const maps = {
    EUROPEAN_COUNTRIES: EuropeMap,
    AFRICAN_COUNTRIES: AfricaMap,
    ASIAN_COUNTRIES: AsiaMap,
}

function fetchCountries(difficulty = 'easy') {
    return fetch(`http://localhost:8080/api/getCountries?` + new URLSearchParams({
        difficulty: difficulty.toLowerCase()
    }), {
        method: "GET",
        headers: {'Content-Type': 'application/json'},
    });
}

const EuropeGeographyGame = () => {
    const {t} = useTranslation();

    let [selectedCountries, setSelectedCountries] = useState([]);
    const [currentCountryIndex, setCurrentCountryIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [gameFinished, setGameFinished] = useState(false);
    const [clickedCountries, setClickedCountries] = useState([]);
    const [map, setMap] = useState(null);

    const lifesRef = useRef(null);
    const [tries, setTries] = useState(5);

    const router = useRouter();
    const fetchGameData = async () => {
        if (!router.isReady) return;
        let difficulty = router.query.Age || "easy";
        const response = await fetchCountries(difficulty);
        if (response.ok) {
            let fetchedCountries = await response.json();
            fetchedCountries.sort(() => 0.5 - Math.random());
            setSelectedCountries(fetchedCountries.slice(0,10));
        }

    }

    useEffect(() => {
        if (router.isReady) {
            const selectedMap = "EUROPEAN_COUNTRIES"
            setMap(selectedMap);
            fetchGameData().then(r => (console.log("Loaded game countries")));
        }

    }, [router.isReady, router.query.Age]);

    const MapComponent = map ? maps[map] : null;
    const isCorrect = (countryId) => {
        return countryId === selectedCountries[currentCountryIndex].id;

    }
    const handleCountryClick = (countryId) => {
        if (gameFinished) return;

        if (isCorrect(countryId)) {
            setScore(prev => prev + 5);
        } else {
            lifesRef.current.loseLife();
            setTries(prev => prev - 1);
        }

        setClickedCountries(prev => ({...prev, [countryId]: isCorrect(countryId) ? "correct" : "incorrect"}));
        if (currentCountryIndex < selectedCountries.length - 1) {
            setCurrentCountryIndex(prev => prev + 1);
        } else if (currentCountryIndex >= selectedCountries.length -1 || tries <= 0) {
            setGameFinished(true);
        }

    };

    const restartGame = () => {
        fetchGameData().then(r => {console.log("Loaded game countries")})
        setCurrentCountryIndex(0);
        setScore(0);
        setTries(5);
        setClickedCountries([]);
        setGameFinished(false);
    }

    if (selectedCountries.length === 0) return null;

    const getCountryColor = (countryId) => {
        if (!clickedCountries[countryId]) return "#ECECEC";
        return clickedCountries[countryId] === "correct" ? "green" : "red";
    };

    const closeModal = () => {
        saveScore();
        setTimeout(() => {
            router.back();
        }, 0);
    };

    function saveScore() {
        try {
            const gameTitle = "Pin The Place";
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
            if (!medalStatus && currentScore > (selectedCountries.length - 2 * 5)) {
                localStorage.setItem(medalKey, "1");
            }
        } catch (error) {
            console.error("Error processing score update: ", error);
        }
    }

    return (<div className="app min-h-screen flex flex-col bg-PS-main-purple ">
        <Header></Header>
        <div className="flex flex-col items-center p-4 bg-PS-main-purple min-h-screen">
            <Title>Pin The Place</Title>
            <div className="w-[100rem] max-w-6xl mx-auto flex flex-col mt-8">
                {!gameFinished && (
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

                <div className="w-full flex flex-col">
                    <div className="relative flex justify-center items-center bg-blue-700 text-[#eaeaea] h-[4rem] border-4 border-b-0 border-black font-bold text-[1rem]">
                        {gameFinished ? (
                            <div className="flex flex-col justify-center items-center">
                                <h2 className="text-2xl font-bold">Game Over!</h2>
                                <p className="text-sm">Final score: <span className="font-bold"> {Math.round(score)}</span></p>
                            </div>
                        ) : (
                            <div className="flex items-center w-full">
                                <p className="absolute left-0 p-[2rem]">{currentCountryIndex+1}/{selectedCountries.length}</p>
                                <div className="flex flex-col justify-center items-center text-xl mx-auto">
                                    <p>Search:</p>
                                    <p className="font-bold text-PS-dark-yellow text-[1.5rem]">{selectedCountries[currentCountryIndex].name}</p>
                                </div>
                                <p className="absolute right-0 text-[1rem] p-[2rem]">Score: {Math.round(score)} </p>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-center items-center bg-blue-400 border-4 border-t-0 border-black">
                        {MapComponent && <MapComponent
                            getCountryColor={getCountryColor}
                            handleCountryClick={handleCountryClick}/>}
                    </div>

                    {(gameFinished && tries > 0) && (
                        <CongratsModal
                            points={score}
                            onCloseMessage={closeModal}
                            onRestart={restartGame}
                        />
                    )}
                    {(tries === 0) && (
                        <GameOverModal
                            onCloseMessage={closeModal}
                            onRestart={restartGame}
                        />
                    )}
                </div>
            </div>
        </div>
        <Footer></Footer>
    </div>);
};


export default EuropeGeographyGame;