import React, {useState, useEffect, useRef} from 'react';
import Title from "@/components/Title";
import Button from "@/components/Button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Lifes from "@/components/Lifes";
import Link from "next/link";
import gameData from "../../../../database/jsondata/PinThePlace.json";
import EuropeMap from "@/pages/games/modules/PinThePlace/EuropeMap";
import AfricaMap from "@/pages/games/modules/PinThePlace/AfricaMap";
import AsiaMap from "@/pages/games/modules/PinThePlace/AsiaMap";
import {useRouter} from "next/router";

const maps = {
    EUROPEAN_COUNTRIES: EuropeMap,
    AFRICAN_COUNTRIES: AfricaMap,
    ASIAN_COUNTRIES: AsiaMap,
}
const continents = ["EUROPEAN_COUNTRIES", "AFRICAN_COUNTRIES", "ASIAN_COUNTRIES"]

const EuropeGeographyGame = () => {
    const [selectedCountries, setSelectedCountries] = useState([]);
    const [currentCountryIndex, setCurrentCountryIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [gameFinished, setGameFinished] = useState(false);
    const [clickedCountries, setClickedCountries] = useState([]);
    const [map, setMap] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const selectedMap = "EUROPEAN_COUNTRIES"
        setMap(selectedMap);

        const fetchCountries = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/getCountries");
                const data = await response.json();

                const shuffled = [...data].sort(() => 0.5 - Math.random());
                setSelectedCountries(shuffled.slice(0, 10));
            } catch (error) {
                console.error("Error fetching countries:", error);
            }
        };

        fetchCountries();
    }, [map]);

    const selectRandomMap = () => {
        return continents[Math.floor(Math.random() * continents.length)];
    };

    const MapComponent = map ? maps[map] : null;

    const isCorrect = (countryId) => {
        return countryId === selectedCountries[currentCountryIndex].id;
    }

    const handleCountryClick = (countryId) => {
        if (gameFinished) return;

        setScore(prev => prev + (isCorrect(countryId) ? 5 : -3))
        setClickedCountries(prev => ({...prev, [countryId]: isCorrect(countryId) ? "correct" : "incorrect"}));

        if (currentCountryIndex < selectedCountries.length - 1) {
            setCurrentCountryIndex(prev => prev + 1);
        } else {
            setGameFinished(true);
        }
    };

    const lifesRef = useRef(null);
    const restartFull = () => {
        if (score < 500) {
            if (lifesRef.current) {
                lifesRef.current.loseLife();
            }
        }
        restartGame();
    }

    const restartGame = () => {
        // const selectedMap = selectRandomMap();
        const selectedMap = "EUROPEAN_COUNTRIES"
        setMap(selectedMap);
        const shuffled = [...gameData[selectedMap]].sort(() => 0.5 - Math.random());
        setSelectedCountries(shuffled.slice(0, 10));
        setCurrentCountryIndex(0);
        setScore(0);
        setClickedCountries([]);
        setGameFinished(false);
    }

    if (selectedCountries.length === 0) return null;

    const getCountryColor = (countryId) => {
        if (!clickedCountries[countryId]) return "#ECECEC";
        return clickedCountries[countryId] === "correct" ? "green" : "red";
    };

    return (<div className="app min-h-screen flex flex-col bg-PS-main-purple ">
        <Header></Header>
        <div className={"flex items-center w-full m-2 mt-[2rem] relative h-full"}>
            <div className="absolute left-0">
                {!gameFinished && (
                    <Link href={{pathname: "../GameSelectionPage", query: {Subject: "Geography"}}}>
                        <div className="mb-2 mt-2 flex justify-start">
                            <Button size="small">Back</Button>
                        </div>
                    </Link>
                )}
            </div>
            <div className="absolute right-0">
                <Lifes ref={lifesRef}/>
            </div>
        </div>
        <div className="flex flex-col items-center p-4 bg-PS-main-purple min-h-screen">
            <Title>Pin The Place</Title>

            <div className="w-[100rem] max-w-6xl mx-auto">
                <div className="relative flex justify-center items-center bg-blue-700 text-[#eaeaea] h-[4rem] border-4 border-b-0 border-black font-bold text-[1rem]">
                    {gameFinished ? (
                        <div className="flex flex-col justify-center items-center">
                            <h2 className="text-2xl font-bold">Game Over!</h2>
                            <p className="text-sm">Final score: <span className="font-bold"> {Math.round(score)}</span></p>
                        </div>
                    ) : (
                        <div className="flex items-center">
                            <p className="absolute left-0 p-[2rem]">{currentCountryIndex+1}/{selectedCountries.length}</p>
                            <div className="flex flex-col justify-center items-center text-xl">
                                <p>Search:</p>
                                <p className="font-bold text-PS-dark-yellow text-[1.5rem]">{selectedCountries[currentCountryIndex].name}</p>
                            </div>
                            <p className="absolute right-0 text-[1rem] p-[2rem]">Score: {Math.round(score)} </p>
                        </div>
                    )}
                </div>
                <div className="flex justify-center items-center  bg-blue-400 border-4 border-t-0 border-black">
                    {MapComponent && <MapComponent
                        getCountryColor={getCountryColor}
                        handleCountryClick={handleCountryClick}/>}
                </div>
                {gameFinished && (
                    <div className="flex justify-center items-center mt-2">
                        <div className="m-2">
                            <Link href={{pathname: "../GameSelectionPage", query: {Subject: "Geography"}}}>
                                <Button size="small">Back</Button>
                            </Link>
                        </div>
                        <div className="m-2">
                            <Button
                                size="large"
                                onClick={restartFull}>
                                Restart
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
        <Footer></Footer>
    </div>);
};

export default EuropeGeographyGame;