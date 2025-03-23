import React, { useState, useEffect } from 'react';

function App() {
    const [hearts, setHearts] = useState([true, true, true, true, true]);
    const [countdown, setCountdown] = useState(10);

    useEffect(() => {
        if (countdown === 0) {
            const newHearts = [...hearts];
            const firstBrokenIndex = newHearts.indexOf(false);
            if (firstBrokenIndex !== -1) {
                newHearts[firstBrokenIndex] = true;
                setHearts(newHearts);
                setCountdown(10);
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

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };

    const renderHearts = () => {
        return hearts.map((heart, index) => (
            <span key={index} className="text-4xl mx-2">
        {heart ? '❤️' : '🩶'}
      </span>
        ));
    };

    return (
        <div className="App flex flex-col items-center p-6 space-y-6">
            <div className="flex items-center">
                <div className="mr-6 text-xl font-semibold">
                    {formatTime(countdown)}
                </div>

                <div className="lives flex items-center">
                    {renderHearts()}
                </div>
            </div>

            <button
                onClick={loseLife}
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
                Perder vida
            </button>
        </div>
    );
}

export default App;