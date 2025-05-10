import React, {useState} from "react";
import {useTranslation} from "react-i18next";

export default function CongratsModal({points, onCloseMessage}) {
    const {t} = useTranslation();
    const [showRating, setShowRating] = useState(false);
    const [rating, setRating] = useState(0);

    const handleStarClick = (starIndex) => {
        setRating(starIndex + 1);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/20">
            <div
                className={`p-6 rounded-xl w-3/4 max-w-lg text-center bg-amber-50 shadow-xl transform transition-all
                   text-green-600 scale-105}
                `}
            >
                <h2 className="text-3xl font-extrabold mb-2">
                   🎉 {t("congratulations")}
                </h2>
                <p className="text-lg mb-4"> {t("points1")} {points} {t("points2")} </p>

                <div className="relative group flex justify-center items-center">
                    <span
                        onClick={() => setShowRating(!showRating)}
                        className="text-lg text-gray-600 hover:underline cursor-pointer"
                    >
                        {t("rateThisGame")}
                    </span>
                </div>

                {showRating && (
                    <div className="mt-4 flex justify-center space-x-2">
                        {[...Array(5)].map((_, index) => (
                            <svg
                                key={index}
                                onClick={() => handleStarClick(index)}
                                className={`w-8 h-8 cursor-pointer ${
                                    index < rating ? "text-yellow-400" : "text-gray-300"
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.357 2.44a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.539 1.118l-3.357-2.44a1 1 0 00-1.175 0l-3.357 2.44c-.784.57-1.838-.197-1.539-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.314 9.397c-.783-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69l1.286-3.97z" />
                            </svg>
                        ))}
                    </div>
                )}

                <button
                    onClick={onCloseMessage}
                    className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                >
                    {showRating ? t("send") : t("close")}
                </button>
            </div>
        </div>
    );
}