import React, { useState } from 'react';
import Title from "@/components/Title";

const EUROPEAN_COUNTRIES = [
    {
        name: 'España',
        realCoords: [40.4637, -3.7492],
        svgCoords: { x: 0.25, y: 0.65 }
    },
    {
        name: 'Francia',
        realCoords: [46.2276, 2.2137],
        svgCoords: { x: 0.35, y: 0.45 }
    },
    {
        name: 'Alemania',
        realCoords: [51.1657, 10.4515],
        svgCoords: { x: 0.5, y: 0.35 }
    },
    {
        name: 'Italia',
        realCoords: [41.8719, 12.5674],
        svgCoords: { x: 0.45, y: 0.5 }
    },
    {
        name: 'Reino Unido',
        realCoords: [55.3781, -3.4360],
        svgCoords: { x: 0.25, y: 0.25 }
    }
];

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radio de la Tierra en kilómetros
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
};

const calculateScore = (distance) => {
    const maxScore = 1000;
    const maxDistance = 1000; // Distancia máxima en km para Europa
    return Math.max(0, maxScore - (distance / maxDistance * maxScore));
};

const EuropeGeographyGame = () => {
    const [markers, setMarkers] = useState([]);
    const [currentCountryIndex, setCurrentCountryIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [gameFinished, setGameFinished] = useState(false);

    const handleMapClick = (event) => {
        if (gameFinished) return;

        const mapRect = event.target.getBoundingClientRect();
        const x = (event.clientX - mapRect.left) / mapRect.width;
        const y = (event.clientY - mapRect.top) / mapRect.height;

        const targetCountry = EUROPEAN_COUNTRIES[currentCountryIndex];

        const distance = calculateDistance(
            y * 180 - 90,
            x * 360 - 180,
            targetCountry.realCoords[0],
            targetCountry.realCoords[1]
        );

        const roundScore = calculateScore(distance);
        setScore(prevScore => prevScore + roundScore);

        setMarkers(prevMarkers => [...prevMarkers, {
            id: prevMarkers.length,
            x,
            y
        }]);

        if (currentCountryIndex < EUROPEAN_COUNTRIES.length - 1) {
            setCurrentCountryIndex(prevIndex => prevIndex + 1);
        } else {
            setGameFinished(true);
        }
    };

    const restartGame = () => {
        setMarkers([]);
        setCurrentCountryIndex(0);
        setScore(0);
        setGameFinished(false);
    };

    return (
        <div className="flex flex-col items-center p-4 bg-PS-geography-color min-h-screen">
            <Title>Pin The Place: Europe</Title>

            {!gameFinished ? (
                <div className="mb-4 text-center">
                    <p className="text-xl">Search:
                        <span className="font-bold text-blue-600 ml-2">
              {EUROPEAN_COUNTRIES[currentCountryIndex].name}
            </span>
                    </p>
                    <p className="text-sm text-gray-600">Score: {Math.round(score)} </p>
                </div>
            ) : (
                <div className="mb-4 text-center">
                    <h2 className="text-2xl font-bold text-green-600">¡Game Over!</h2>
                    <p className="text-xl">Final score: {Math.round(score)}</p>
                    <button
                        onClick={restartGame}
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Reiniciar Juego
                    </button>
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
                        <circle
                            key={index}
                            cx={marker.x * 1000}
                            cy={marker.y * 600}
                            r="10"
                            fill="red"
                            opacity="0.7"
                        />
                    ))}
                </svg>
            </div>
        </div>
    );
};

export default EuropeGeographyGame;