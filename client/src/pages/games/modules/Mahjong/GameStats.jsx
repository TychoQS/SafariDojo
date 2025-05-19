import React from "react";
import CongratsModal from "@/components/CongratsModal";
import GameOverModal from "@/components/GameOverModal";
import {useTranslation} from "react-i18next";
import saveGameData from "@/StorageServices/SaveDataFinishedGame";

export default function GameStats({completedPairs, totalPairs, score, message, mistakes, onCloseMessage, onRestart}) {
    const hearts = Array.from({length: 5}, (_, index) =>
        index >= 5 - mistakes ? "🖤" : "❤️"
    );

    const {t} = useTranslation();
    const isModalMessage = message && (message.type === "congratulations" || message.type === "game-over");

    const closeCongrats = () => {
        saveGameData(score);
        onCloseMessage();
    }

    const restartCongrats = () => {
        saveGameData(score);
        onRestart();
    }

    return (
        <>
            <div className="w-full flex justify-between mb-4">
                <div className="p-2 bg-PS-dark-yellow rounded-lg">
                    <span className="font-bold">{t('mahjong.completed')}:</span> {completedPairs} / {totalPairs}
                </div>
                <div className="p-2 bg-PS-dark-yellow rounded-lg">
                    <span className="font-bold">{t('mahjong.points')}:</span> {score}
                </div>
            </div>

            {message && !isModalMessage && (
                <div className="mb-4 p-2 bg-yellow-100 rounded-lg w-full text-center text-black">
                    {message.text}
                </div>
            )}

            {isModalMessage && (
                message.type === "congratulations" ? (
                    <CongratsModal
                        points={score}
                        onCloseMessage={closeCongrats}
                        onRestart={restartCongrats}
                    />
                ) : (
                    <GameOverModal
                        onCloseMessage={onCloseMessage}
                        onRestart={onRestart}
                    />
                )
            )}

            <div className="w-full flex justify-between mb-4 gap-3">
                <div className="p-4 text-center text-black">
                    <span className="text-xl">{hearts.join(" ")}</span>
                </div>
            </div>
        </>
    );
}