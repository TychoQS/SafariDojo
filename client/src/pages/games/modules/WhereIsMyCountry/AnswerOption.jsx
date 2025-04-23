import React from "react";

export default function AnswerOption({countryName, onClick}) {
    const handleClick = () => {
        if (onClick) {
            onClick(countryName);
        }
    };


    return (
        <button className="flex justify-center items-center w-[15rem] h-[5rem] border-2 border-black rounded-lg
                            hover:bg-gray-400 transition-colors
                            cursor-pointer"
                onClick={handleClick}>
                <p className={"text-black text-2xl"}>{countryName}</p>
        </button>
    );
};