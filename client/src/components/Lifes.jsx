import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { novaMono } from "@/styles/fonts";

const Lifes = forwardRef((props, ref) => {
    const [hearts, setHearts] = useState([true, true, true, true, true]);
    const [countdown, setCountdown] = useState(300);

    useEffect(() => {
        if (countdown === 0) {
            const newHearts = [...hearts];
            const firstBrokenIndex = newHearts.indexOf(false);
            if (firstBrokenIndex !== -1) {
                newHearts[firstBrokenIndex] = true;
                setHearts(newHearts);
                setCountdown(300);
            }
        } else if (hearts.some(heart => heart === false)) {
            const timer = setInterval(() => {
                setCountdown(prevCountdown => prevCountdown - 1);
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [countdown, hearts]);

    const loseLife = () => {
        if (hearts.some(heart => heart === true)) {
            const newHearts = [...hearts];
            const lastFullHeartIndex = newHearts.lastIndexOf(true);
            if (lastFullHeartIndex !== -1) {
                newHearts[lastFullHeartIndex] = false;
                setHearts(newHearts);
            }
        }
    };

    useImperativeHandle(ref, () => ({
        loseLife,
        getRemainingLives: () => hearts.filter(heart => heart === true).length,
    }));

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };

    const renderHearts = () => {
        return hearts.map((heart, index) => (
            <span key={index} className="text-4xl mx-1">
                {heart ? '❤️' : '🩶'}
            </span>
        ));
    };

    return (
        <div className="flex flex-col items-center p-6 space-y-6">
            <div className="flex items-center">
                <div className={`mr-6 text-xl font-semibold ${novaMono.className}`}>
                    {formatTime(countdown)}
                </div>

                <div className="lives flex items-center">
                    {renderHearts()}
                </div>
            </div>
        </div>
    );
});

export default Lifes;