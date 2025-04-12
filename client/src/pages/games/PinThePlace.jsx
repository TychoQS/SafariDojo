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

    useEffect(() => {
        const selectedMap = mapSelector();
        setMap(selectedMap);

        const shuffled = [...gameData[selectedMap]].sort(() => 0.5 - Math.random());
        setSelectedCountries(shuffled.slice(0, 10));
    }, [map]);

    const mapSelector = () => {
        return continents[Math.floor(Math.random() * continents.length)];
    };

    const MapComponent = map ? maps[map] : null;

    const isCorrect = (countryId) => {
        return countryId === selectedCountries[currentCountryIndex].id;
    }

    const handleCountryClick = (countryId) => {
        if (gameFinished) return;

        setScore(prev => prev + (isCorrect(countryId) ? 100 : -50))
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
        const selectedMap = mapSelector();
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
        <div className="flex items-end justify-end">
            <Lifes ref={lifesRef}/>
        </div>
        <div className="flex flex-col items-center p-4 bg-PS-main-purple min-h-screen">
            <Title>Pin The Place</Title>

            {!gameFinished ? (<div
                className="mt-2 mb-2 text-center bg-PS-light-yellow rounded-full w-70 h-20 flex flex-col justify-center items-center border-black border-4">
                <p className="text-xl text-black">Search:
                    <span className="font-bold text-blue-600 ml-2">
                                {selectedCountries[currentCountryIndex].name}
                            </span>
                </p>
                <p className="text-sm text-gray-600">Score: {Math.round(score)} </p>
            </div>) : (<div className="mb-2 text-center w-full max-w-md mx-auto">
                <h2 className="text-2xl font-bold text-green-600">¡Game Over!</h2>
                <p className="text-xl mb-2">Final score: {Math.round(score)}</p>
                <Button
                    size="large"
                    onClick={restartFull}
                >
                    Restart
                </Button>
            </div>)}

            <Link href={{pathname: "../GameSelectionPage", query: {Subject: "Geography"}}}>
                <div className="mb-2 mt-2 relative flex justify-start">
                    <Button size="small">Back</Button>
                </div>
            </Link>

            <div
                className="flex justify-center items-center w-full max-w-6xl mx-auto bg-blue-700 border-4 border-black">
                {MapComponent && <MapComponent
                    getCountryColor={getCountryColor}
                    handleCountryClick={handleCountryClick}/>}
            </div>
        </div>
        <Footer></Footer>
    </div>);
};

export default EuropeGeographyGame;