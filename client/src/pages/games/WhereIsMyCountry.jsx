import {useState, useEffect, useRef} from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Lifes from "@/components/Lifes";
import gameData from "../../../../database/jsondata/WhereIsMyCountry.json";

function WhereIsMyCountry() {
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(0);
    const [tries, setTries] = useState(4);
    const [finished, setFinished] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [gameCountries, setGameCountries] = useState([]);
    const lifesRef = useRef(null);

    useEffect(() => {
        const countries = [...gameData["EASY_COUNTRIES"]].sort(() => 0.5 - Math.random());
        setGameCountries(countries.slice(0, 5));
    }, []);


    function getName() {
        return gameCountries[currentIndex].name;
    }
    function getHint() {
       return gameCountries[currentIndex].hint;
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
                    <Lifes ref={lifesRef} />
                </div>
                <div className="h-150 w-175 flex flex-col self-center items-center justify-evenly border-4 rounded-2xl
            border-PS-dark-yellow bg-PS-light-yellow">
                    <div>
                        <div className={"flex w-[100%] bg-gray-500 items-center justify-center"}>
                            <p>{getHint()}</p>
                        </div>
                        <div>
                            <p className={"text-[10rem] text-black"}>{getName()}</p>
                        </div>
                    </div>


                    <div className={"text-black text-2xl font-black flex justify-between"}><p className="text-gray-600 font-light">Score: {score}</p></div>
                </div>
            </section>
            <Footer></Footer>
        </div>
    )
}

export default WhereIsMyCountry;