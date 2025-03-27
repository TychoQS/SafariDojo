import React, { useState, useEffect } from 'react';
import Title from "@/components/Title";
import Button from "@/components/Button";

const EUROPEAN_COUNTRIES = [
    {
        name: 'Spain',
        realCoords: [40.4637, -3.7492],
        svgCoords: { x: 350, y: 490 }
    },
    {
        name: 'France',
        realCoords: [46.2276, 2.2137],
        svgCoords: { x: 430, y: 410 }
    },
    {
        name: 'Germany',
        realCoords: [51.1657, 10.4515],
        svgCoords: { x: 520, y: 350 }
    },
    {
        name: 'Italy',
        realCoords: [41.8719, 12.5674],
        svgCoords: { x: 550, y: 450 }
    },
    {
        name: 'UK',
        realCoords: [55.3781, -3.4360],
        svgCoords: { x: 380, y: 320 }
    },
    {
        name: 'Portugal',
        realCoords: [39.3999, -8.2245],
        svgCoords: { x: 300, y: 500 }
    },
    {
        name: 'Netherlands',
        realCoords: [52.1326, 5.2913],
        svgCoords: { x: 470, y: 330 }
    },
    {
        name: 'Belgium',
        realCoords: [50.5039, 4.4699],
        svgCoords: { x: 460, y: 350 }
    },
    {
        name: 'Switzerland',
        realCoords: [46.8182, 8.2275],
        svgCoords: { x: 500, y: 405 }
    },
    {
        name: 'Austria',
        realCoords: [47.5162, 14.5501],
        svgCoords: { x: 575, y: 395 }
    },
    {
        name: 'Poland',
        realCoords: [51.9194, 19.1451],
        svgCoords: { x: 620, y: 330 }
    },
    {
        name: 'Czech Republic',
        realCoords: [49.8175, 15.4730],
        svgCoords: { x: 580, y: 370 }
    },
    {
        name: 'Greece',
        realCoords: [39.0742, 21.8243],
        svgCoords: { x: 680, y: 500 }
    },
    {
        name: 'Norway',
        realCoords: [60.4720, 8.4689],
        svgCoords: { x: 495, y: 215 }
    },
    {
        name: 'Sweden',
        realCoords: [60.1282, 18.6435],
        svgCoords: { x: 570, y: 220 }
    },
    {
        name: 'Denmark',
        realCoords: [56.2639, 9.5018],
        svgCoords: { x: 510, y: 280 }
    },
    {
        name: 'Ireland',
        realCoords: [53.1424, -7.6921],
        svgCoords: { x: 305, y: 320 }
    },
    {
        name: 'Finland',
        realCoords: [61.9241, 25.7482],
        svgCoords: { x: 670, y: 200 }
    },
    {
        name: 'Romania',
        realCoords: [45.9432, 24.9668],
        svgCoords: { x: 710, y: 420 }
    },
    {
        name: 'Hungary',
        realCoords: [47.1625, 19.5033],
        svgCoords: { x: 630, y: 400 }
    }
];

const calculateSVGDistance = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

const calculateScore = (distance) => {
    const maxScore = 1000;
    const maxDistance = 500; // Distancia máxima en pixeles del SVG
    return Math.max(0, maxScore - (distance / maxDistance * maxScore));
};

const EuropeGeographyGame = () => {
    const [selectedCountries, setSelectedCountries] = useState([]);
    const [markers, setMarkers] = useState([]);
    const [currentCountryIndex, setCurrentCountryIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [gameFinished, setGameFinished] = useState(false);

    // Función para seleccionar 10 países aleatorios
    useEffect(() => {
        const shuffled = [...EUROPEAN_COUNTRIES].sort(() => 0.5 - Math.random());
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
        const shuffled = [...EUROPEAN_COUNTRIES].sort(() => 0.5 - Math.random());
        setSelectedCountries(shuffled.slice(0, 10));
        setMarkers([]);
        setCurrentCountryIndex(0);
        setScore(0);
        setGameFinished(false);
    };

    // No renderizar nada si los países no están seleccionados aún
    if (selectedCountries.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-col items-center p-4 bg-PS-main-purple min-h-screen">
            <Title>Pin The Place</Title>

            {!gameFinished ? (
                <div className="mt-6 mb-10 text-center bg-PS-light-yellow rounded-full w-70 h-20 flex flex-col justify-center items-center">
                    <p className="text-xl">Search:
                        <span className="font-bold text-blue-600 ml-2">
                            {selectedCountries[currentCountryIndex].name}
                        </span>
                    </p>
                    <p className="text-sm text-gray-600">Score: {Math.round(score)} </p>
                </div>
            ) : (
                <div className="mb-4 text-center w-full max-w-md mx-auto">
                    <h2 className="text-2xl font-bold text-green-600">¡Game Over!</h2>
                    <p className="text-xl">Final score: {Math.round(score)}</p>
                    <Button
                        size="large"
                        onClick={restartGame}
                        className="mt-10 mb-10"
                    >
                        Restart
                    </Button>
                </div>
            )}

            <div className="relative w-full max-w-4xl h-[600px] bg-PS-light-yellow border-4">
                <svg
                    viewBox="0 0 1000 600"
                    onClick={handleMapClick}
                    className="w-full h-full cursor-pointer"
                >
                    {/* Mapa de Europa desde archivo externo */}
                    <image
                        href="/images/Games/Geography/europe.svg"
                        width="1000"
                        height="600"
                    />

                    {/* Marcadores */}
                    {markers.map((marker, index) => (
                        <React.Fragment key={index}>
                            <circle
                                cx={marker.x * 1000}
                                cy={marker.y * 600}
                                r="12"
                                fill="red"
                                opacity="0.7"
                            />
                            {/* Línea desde la ubicación real del país */}
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
    );
};

export default EuropeGeographyGame;