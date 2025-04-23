import React, {useState, useEffect, useRef} from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Lifes from "@/components/Lifes";
import gameData from "../../../../database/jsondata/Geography.json";
import AnswerOption from "@/pages/games/modules/WhereIsMyCountry/AnswerOption";
import Link from "next/link";
import Button from "@/components/Button";

function WhereIsMyCountry() {
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(0);
    const [tries, setTries] = useState(4);
    const [gameStatus, setGameStatus] = useState("loading");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [gameCountries, setGameCountries] = useState([]);
    const [optionCountries, setOptionCountries] = useState([]);
    const [clickedCountries, setClickedCountries] = useState([]);
    const lifesRef = useRef(null);

    useEffect(() => {
        initializeGame();
    }, []);

    useEffect(() => {
        if (gameCountries.length > 0) {
            generateOptionCountries();
        }
    }, [gameCountries, currentIndex]);

    useEffect(() => {
        if (optionCountries.length > 0) {
            generateOptionCountries();
            setGameStatus("active");
        }
    }, [gameCountries, currentIndex]);

    const initializeGame= () => {
        const selectedCountries = getRandomCountries(10);
        setGameCountries(selectedCountries);
        setCurrentIndex(0);
        setScore(0);
        setGameStatus("loading");
    }

    function getRandomCountries(upperBound) {
        const countries = [...gameData].sort(() => 0.5 - Math.random());
        return countries.slice(0, upperBound);
    }

    function generateOptionCountries() {
        if (currentIndex >= gameCountries.length) {
            setGameStatus("finished");
            return;
        }

        const currentCountry = gameCountries[currentIndex];
        const otherCountries = gameData.filter(country => country.id !== currentCountry.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);
        const options = [...otherCountries, currentCountry].sort(() => 0.5 - Math.random());

        setOptionCountries(options);
    }

    function getCountryName() {
        return gameCountries[currentIndex]?.name || "";
    }

    function getCountryHint() {
        return gameCountries[currentIndex]?.hint || "";
    }


    function handleAnswerSelection(countryName) {
        if (gameStatus === "finished") return;

        setClickedCountries(prev => ({...prev, [countryName]: isCorrect(countryName) ? "correct" : "incorrect"}));

        if ((countryName === gameCountries[currentIndex]?.name) && (gameStatus === "active")) {
            setScore(prevScore => prevScore + 5);
        }

        if (currentIndex + 1 < gameCountries.length) {
            setGameStatus("waiting");
        }
        else {
            setGameStatus("finished");
            setBestScore(prevBest => Math.max(prevBest, score))
        }
    }

    const isCorrect = (countryName) => {
        return countryName === getCountryName();
    }

    function getColor(countryName) {
        if (!clickedCountries[countryName]) return "#FFFFFF";
        return clickedCountries[countryName] === "correct" ? "green" : "red";
    }

    function nextGame() {
        if (currentIndex + 1 < gameCountries.length) {
            setCurrentIndex(prevIndex => prevIndex + 1);
            setGameStatus("active");
        }
    }


    return (
        <div className="app min-h-screen flex flex-col bg-PS-main-purple ">
            <Header></Header>
            <section className={"min-h-screen flex flex-col justify-evenly bg-PS-main-purple"}>
                <div className="flex items-end justify-end">
                    <Lifes ref={lifesRef}/>
                </div>

                <div className="w-175 flex flex-col self-center items-center justify-center border-4 rounded-3xl
            border-PS-dark-yellow bg-PS-light-yellow">
                    <div className="flex items-center justify-center w-full h-[5rem] bg-gray-500 rounded-t-2xl relative">
                        {(gameStatus !== "finished") ? (
                                <div className={"text-black text-2xl flex justify-center"}>
                                    <p className="text-gray-600 font-light">Score: <span className={"font-bold text-black"}>{score}</span></p>
                                    <p className={"flex absolute right-4"}>{currentIndex+1}/{gameCountries.length}</p>
                                    <Link href={{pathname: "../GameSelectionPage", query: {Subject: "Geography"}}}>
                                        <div className="flex absolute left-4 top-4">
                                            <Button size="small">Back</Button>
                                        </div>
                                    </Link>
                                </div>
                            ) :
                            <div className={"text-black text-2xl flex justify-center text-center flex-col"}>
                                <p className={"font-bold text-2xl"}>GAME OVER</p>
                                <div className={"flex flex-row gap-[2rem] text-xl"}>
                                    <p>Final Score: <span>{score}</span></p>
                                    <p>Best Score: <span>{bestScore}</span></p>
                                </div>

                            </div>
                        }

                    </div>
                    <div className={"flex items-center justify-center flex-col gap-[1rem] m-10"}>

                        <div className={"flex w-[80%] h-40 text-[2rem] items-center justify-center self-center m-2"}>
                            <svg width="50px" height="50px" viewBox="0 0 24 24" fill="none" role="img">
                                <path
                                    d="M9.29289 1.29289C9.48043 1.10536 9.73478 1 10 1H18C19.6569 1 21 2.34315 21 4V8C21 8.55228 20.5523 9 20 9C19.4477 9 19 8.55228 19 8V4C19 3.44772 18.5523 3 18 3H11V8C11 8.55228 10.5523 9 10 9H5V20C5 20.5523 5.44772 21 6 21H10C10.5523 21 11 21.4477 11 22C11 22.5523 10.5523 23 10 23H6C4.34315 23 3 21.6569 3 20V8C3 7.73478 3.10536 7.48043 3.29289 7.29289L9.29289 1.29289ZM6.41421 7H9V4.41421L6.41421 7ZM20.1716 18.7574C20.6951 17.967 21 17.0191 21 16C21 13.2386 18.7614 11 16 11C13.2386 11 11 13.2386 11 16C11 18.7614 13.2386 21 16 21C17.0191 21 17.967 20.6951 18.7574 20.1716L21.2929 22.7071C21.6834 23.0976 22.3166 23.0976 22.7071 22.7071C23.0976 22.3166 23.0976 21.6834 22.7071 21.2929L20.1716 18.7574ZM13 16C13 14.3431 14.3431 13 16 13C17.6569 13 19 14.3431 19 16C19 17.6569 17.6569 19 16 19C14.3431 19 13 17.6569 13 16Z"
                                    fill="#000000"/>
                            </svg>
                            <p className={"text-center text-black"}>{getCountryHint()}</p>
                        </div>


                            <div className={"flex flex-col justify-center gap-[2rem]"}>
                                <div className={"flex flex-row justify-between gap-[2rem]"}>
                                    <AnswerOption
                                        countryName={optionCountries[0]?.name || ""}
                                        onClick={() => handleAnswerSelection(optionCountries[0]?.name)}
                                        color={() => (getColor())}/>
                                    <AnswerOption
                                        countryName={optionCountries[1]?.name || ""}
                                        onClick={() => handleAnswerSelection(optionCountries[1]?.name)}
                                        color={() => (getColor())}/>
                                </div>
                                <div className={"flex flex-row justify-between gap-[2rem]"}>
                                    <AnswerOption
                                        countryName={optionCountries[2]?.name || ""}
                                        onClick={() => handleAnswerSelection(optionCountries[2]?.name)}
                                        color={() => (getColor())}/>
                                    <AnswerOption
                                        countryName={optionCountries[3]?.name || ""}
                                        onClick={() => handleAnswerSelection(optionCountries[3]?.name)}
                                        color={() => (getColor())}/>
                                </div>
                            </div>
                        {gameStatus === "waiting" && (
                            <div>
                                <div className="flex">
                                    <Button size="small" onClick={() => nextGame()}>Next</Button>
                                </div>
                            </div>
                        )}
                    </div>


                </div>
            </section>
            <Footer></Footer>
        </div>
    )
}

export default WhereIsMyCountry;