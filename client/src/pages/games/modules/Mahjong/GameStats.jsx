import React from "react";

export default function GameStats({completedPairs, totalPairs, score, message, mistakes, onCloseMessage}) {
    const hearts = Array.from({length: 5}, (_, index) =>
        index >= 5 - mistakes ? "🖤" : "❤️"
    );

    const isModalMessage = message && (message.type === "congratulations" || message.type === "game-over");

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

            {message && !isModalMessage && (
                <div className="mb-4 p-2 bg-yellow-100 rounded-lg w-full text-center text-black">
                    {message.text}
                </div>
            )}

            {isModalMessage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/20">
                    <div
                        className={`p-6 rounded-xl w-3/4 max-w-lg text-center bg-amber-50 shadow-xl transform transition-all
                            ${message.type === "congratulations" ? "text-green-600 scale-105" : "text-red-600 scale-110"}
                        `}
                    >
                        <h2 className="text-3xl font-extrabold mb-2">
                            {message.type === "congratulations" ? "🎉 Congratulations!" : "💀 Game Over"}
                        </h2>
                        <p className="text-lg mb-4">{message.text}</p>

                        <button
                            onClick={onCloseMessage}
                            className="mt-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            <div className="w-full flex justify-between mb-4 gap-3">
                <div className="p-4 text-center text-black">
                    <span className="text-xl">{hearts.join(" ")}</span>
                </div>
            </div>
        </>
    );
}