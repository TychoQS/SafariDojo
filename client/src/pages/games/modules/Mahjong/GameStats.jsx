import React from "react";

export default function GameStats({ moves, completedPairs, totalPairs, score, message, mistakes, pairMistakes }) {
    return (
        <>
            <div className="w-full flex justify-between mb-4">
                <div className="p-2 bg-PS-dark-yellow rounded-lg">
                    <span className="font-bold">Moves:</span> {moves}
                </div>
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
                <div className="p-4 bg-red-100 rounded-lg w-1/4 text-center text-black">
                    <span className="font-bold">Mistakes:</span> {mistakes} / 5
                </div>

                <div className="w-3/4 flex justify-between">
                    {Object.keys(pairMistakes).slice(0, 3).map((pair) => (
                        <div key={pair} className="p-4 bg-red-100 rounded-lg w-1/4 text-center text-black">
                            <span className="font-bold">Mistakes with &#34;{pair}&#34;:</span> {pairMistakes[pair]} / 3
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};
