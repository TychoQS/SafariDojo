import React from "react";

export default function AnswerOption({countryName, onClick, gameStatus, correctCountryName, clickedCountries = {}}) {

    function isGameActive() {
        return (gameStatus === "waiting" || gameStatus === "finished");
    }
    function getColor() {
        if (isGameActive() && countryName === correctCountryName) {
            return "bg-green-600";
        }

        if (!clickedCountries[countryName]) return "bg-white";

        return clickedCountries[countryName] === "correct" ? "bg-green-600" : "bg-red-700";
    }

    const handleClick = () => {
        if (onClick && countryName) {
            onClick(countryName);
        }
    };

    return (
        <button
            className={`${getColor()} cursor-pointer flex justify-center items-center 
                    w-[15rem] h-[5rem] border-2 border-black rounded-lg
                    transition-colors text-[1.5rem] text-black`}
            onClick={handleClick}
            disabled={isGameActive()}
            >{countryName || ""}
        </button>
    );
};