import React from "react";

export default function GameStats({completedPairs, totalPairs, score, message, mistakes }) {
    const hearts = Array.from({ length: 5 }, (_, index) =>
        index >= 5 - mistakes ? "🖤" : "❤️"
    );

    return (
        <>
            <div className="w-full flex justify-between mb-4">
                <div className="p-2 bg-PS-dark-yellow rounded-lg">
                    <span className="font-bold">Completed:</span> {completedPairs} / {totalPairs}
                </div>
                <div className="p-2 bg-PS-dark-yellow rounded-lg">
                    <span className="font-bold">Score:</span> {score}
                </div>
            </div>

            {message && (
                <div className="mb-4 p-2 bg-yellow-100 rounded-lg w-full text-center text-black">
                    {message}
                </div>
            )}

            <div className="w-full flex justify-between mb-4 gap-3">
                <div className="p-4  text-center text-black">
                    <span className="text-xl">{hearts.join(" ")}</span>
                </div>
            </div>
        </>
    );
};
