import {useState, useEffect, useRef} from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Lifes from "@/components/Lifes";
import gameData from "../../../../database/jsondata/WhereIsMyCountry.json";
import AnswerOption from "@/pages/games/modules/WhereIsMyCountry/AnswerOption";

function WhereIsMyCountry() {
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(0);
    const [tries, setTries] = useState(4);
    const [finished, setFinished] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [gameCountries, setGameCountries] = useState([]);
    const [randomCountries, setRandomCountries] = useState([]);
    const lifesRef = useRef(null);

    useEffect(() => {
        setGameCountries(getRandomCountries(5));

        shuffle();
    }, []);

    function getCountryName() {
        return gameCountries[currentIndex]?.name || "";
    }

    function getCountryHint() {
        return gameCountries[currentIndex]?.hint || "";
    }

    function getRandomCountries(upperBound) {
        const countries = [...gameData["EASY_COUNTRIES"]].sort(() => 0.5 - Math.random());
        return countries.slice(0, upperBound);
    }

    function shuffle() {
        if (!gameCountries || gameCountries.length === 0) return;

        const shuffledCountries = [...getRandomCountries(4), gameCountries[currentIndex]]
            .sort(() => 0.5 - Math.random());
        console.log(shuffledCountries)

        setRandomCountries(shuffledCountries);
    }

    function validatePicture(name, guess) {
        if (tries === 0) {
            setFinished(true);
            setBestScore(Math.max(bestScore, score));
            if (score < 30 && lifesRef.current) {
                lifesRef.current.loseLife();
            }
        }
        if (name.trim().toLowerCase() === guess.trim().toLowerCase()) {
            setMessage("Great guess!")
            setScore(score + 5);
        } else {
            setMessage("Nope.");
        }
        setNext(true);
    }


    return (
        <div className="app min-h-screen flex flex-col bg-PS-main-purple ">
            <Header></Header>
            <section className={"min-h-screen flex flex-col justify-evenly bg-PS-main-purple"}>

                <div className="flex items-end justify-end">
                    <Lifes ref={lifesRef}/>
                </div>
                <div className="h-150 w-175 flex flex-col self-center items-center justify-center border-4 rounded-2xl
            border-PS-dark-yellow bg-PS-light-yellow">
                    <div className={"flex items-center justify-center flex-col"}>
                        <div className={"flex w-[80%] h-40 text-[2rem] items-center justify-center self-center m-2"}>
                            <p className={"text-center p-2 text-blue-500 font-bold"}>Hint:</p>
                            <p className={"text-center text-black"}>{getCountryHint()}</p>
                        </div>
                        <div className={"flex justify-end right-0 w-[90%]"}>
                            <svg width="50px" height="50px" viewBox="0 0 24 24" fill="none" role="img">
                                <path
                                    d="M9.29289 1.29289C9.48043 1.10536 9.73478 1 10 1H18C19.6569 1 21 2.34315 21 4V8C21 8.55228 20.5523 9 20 9C19.4477 9 19 8.55228 19 8V4C19 3.44772 18.5523 3 18 3H11V8C11 8.55228 10.5523 9 10 9H5V20C5 20.5523 5.44772 21 6 21H10C10.5523 21 11 21.4477 11 22C11 22.5523 10.5523 23 10 23H6C4.34315 23 3 21.6569 3 20V8C3 7.73478 3.10536 7.48043 3.29289 7.29289L9.29289 1.29289ZM6.41421 7H9V4.41421L6.41421 7ZM20.1716 18.7574C20.6951 17.967 21 17.0191 21 16C21 13.2386 18.7614 11 16 11C13.2386 11 11 13.2386 11 16C11 18.7614 13.2386 21 16 21C17.0191 21 17.967 20.6951 18.7574 20.1716L21.2929 22.7071C21.6834 23.0976 22.3166 23.0976 22.7071 22.7071C23.0976 22.3166 23.0976 21.6834 22.7071 21.2929L20.1716 18.7574ZM13 16C13 14.3431 14.3431 13 16 13C17.6569 13 19 14.3431 19 16C19 17.6569 17.6569 19 16 19C14.3431 19 13 17.6569 13 16Z"
                                    fill="#000000"/>
                            </svg>
                        </div>
                        <div className={"w-[50%] text-black"}>
                            <div className={"flex flex-row justify-between"}>
                                <AnswerOption
                                    country={"p"}/>
                                <AnswerOption
                                    country={"p"}/>
                            </div>
                            <div className={"flex flex-row justify-between"}>
                                <AnswerOption
                                    country={"p"}/>
                                <AnswerOption
                                    country={"pepe"}/>
                            </div>
                        </div>
                    </div>


                    <div className={"text-black text-2xl font-black flex justify-between"}><p
                        className="text-gray-600 font-light">Score: {score}</p></div>
                </div>
            </section>
            <Footer></Footer>
        </div>
    )
}

export default WhereIsMyCountry;