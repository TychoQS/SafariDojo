import React, { useState, useEffect } from 'react';
import Title from "@/components/Title";
import Button from "@/components/Button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import gameData from "../../../../database/jsondata/PinThePlace.json";

const calculateSVGDistance = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

const calculateScore = (distance) => {
    const maxScore = 500;
    const maxDistance = 500;
    let baseScore = Math.max(0, maxScore - (distance / maxDistance * maxScore));

    if (distance < 20) {
        baseScore += 100 * (1 - distance/20);
    }

    if (distance > 20) {
        baseScore = -100;
    }

    return Math.round(baseScore);
};

const EuropeGeographyGame = () => {
    const [selectedCountries, setSelectedCountries] = useState([]);
    const [markers, setMarkers] = useState([]);
    const [currentCountryIndex, setCurrentCountryIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [gameFinished, setGameFinished] = useState(false);


    useEffect(() => {
        const shuffled = [...gameData.EUROPEAN_COUNTRIES].sort(() => 0.5 - Math.random());
        setSelectedCountries(shuffled.slice(0, 10));
    }, []);

    const handleMapClick = (event) => {
        if (gameFinished) return;

        const mapRect = event.target.getBoundingClientRect();
        const x = (event.clientX - mapRect.left) / mapRect.width * 1000;
        const y = (event.clientY - mapRect.top) / mapRect.height * 600;

        const targetCountry = selectedCountries[currentCountryIndex];

        const distance = calculateSVGDistance(
            x,
            y,
            targetCountry.svgCoords.x,
            targetCountry.svgCoords.y
        );

        const roundScore = calculateScore(distance);
        setScore(prevScore => prevScore + roundScore);

        setMarkers(prevMarkers => [...prevMarkers, {
            id: prevMarkers.length,
            x: x / 1000,
            y: y / 600
        }]);

        if (currentCountryIndex < selectedCountries.length - 1) {
            setCurrentCountryIndex(prevIndex => prevIndex + 1);
        } else {
            setGameFinished(true);
        }
    };

    const restartGame = () => {
        const shuffled = [...gameData.EUROPEAN_COUNTRIES].sort(() => 0.5 - Math.random());
        setSelectedCountries(shuffled.slice(0, 10));
        setMarkers([]);
        setCurrentCountryIndex(0);
        setScore(0);
        setGameFinished(false);
    };

    if (selectedCountries.length === 0) {
        return null;
    }

    return (
        <div className="app min-h-screen flex flex-col bg-PS-main-purple ">
            <Header></Header>
            <div className="flex flex-col items-center p-4 bg-PS-main-purple min-h-screen">
                <Title>Pin The Place</Title>
                {!gameFinished ? (
                    <div className="mt-2 mb-2 text-center bg-PS-light-yellow rounded-full w-70 h-20 flex flex-col justify-center items-center border-black border-4">
                        <p className="text-xl text-black">Search:
                            <span className="font-bold text-blue-600 ml-2">
                                {selectedCountries[currentCountryIndex].name}
                            </span>
                        </p>
                        <p className="text-sm text-gray-600">Score: {Math.round(score)} </p>
                    </div>
                ) : (
                    <div className="mb-2 text-center w-full max-w-md mx-auto">
                        <h2 className="text-2xl font-bold text-green-600">¡Game Over!</h2>
                        <p className="text-xl mb-4">Final score: {Math.round(score)}</p>
                        <Button
                            size="large"
                            onClick={restartGame}
                            className="mt-10 mb-10"
                        >
                            Restart
                        </Button>
                    </div>
                )}

                <Link href={{pathname: "../GameSelectionPage", query: {Subject: "Geography"}}}>
                    <div className="mb-2 relative flex justify-start">
                        <Button size="small" >Back</Button>
                    </div>
                </Link>
                <div className="relative w-full max-w-4xl h-[600px] bg-PS-geography-color border-4 border-black">
                    <svg
                        viewBox="0 0 1000 600"
                        onClick={handleMapClick}
                        className="w-full h-full cursor-pointer"
                    >
                        <image
                            href="/images/Games/Geography/europe.svg"
                            width="1000"
                            height="600"
                        />

                        {markers.map((marker, index) => (
                            <React.Fragment key={index}>
                                <circle
                                    cx={marker.x * 1000}
                                    cy={marker.y * 600}
                                    r="8"
                                    fill="red"
                                    opacity="0.7"
                                />
                                <line
                                    x1={selectedCountries[index].svgCoords.x}
                                    y1={selectedCountries[index].svgCoords.y}
                                    x2={marker.x * 1000}
                                    y2={marker.y * 600}
                                    stroke="green"
                                    strokeWidth="2"
                                    strokeDasharray="5,5"
                                />
                            </React.Fragment>
                        ))}
                    </svg>
                </div>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default EuropeGeographyGame;