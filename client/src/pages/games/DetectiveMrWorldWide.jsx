import {useState, useEffect, useRef} from "react";
import images from '../../../../database/jsondata/DetectiveMrWorldWide.json';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Lifes from "@/components/Lifes";
import Link from "next/link";


function getImage() {
    const max = 10;
    const image = Math.floor(Math.random() * max);
    return images[image] || {Name: "", Image: ""};
}

function DetectiveMrWorldWide() {
    const [guess, setGuess] = useState("");
    const [message, setMessage] = useState("");
    const [item, setItem] = useState({Name: "", Image: ""});
    const [next, setNext] = useState(false);
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(0);
    const [tries, setTries] = useState(4);
    const [finished, setFinished] = useState(false);
    const lifesRef = useRef(null);

    useEffect(() => {
        setItem(getImage());
    }, []);

    const name = item.Name;
    const flag = item.Image;

    function validatePicture(name, guess) {
        if (tries === 0) {
            setFinished(true);
            setBestScore(Math.max(bestScore, score));
            if (score < 300 && lifesRef.current) {
                lifesRef.current.loseLife();
            }
        }
        if (name.trim().toLowerCase() === guess.trim().toLowerCase()) {
            setMessage("Nice, you must be a real explorer!!!")
            setScore(score + 100);
        } else {
            setMessage("Keep guessing!");
        }
        setNext(true);
    }

    function nextGame() {
        setItem(getImage());
        setGuess("");
        setMessage("");
        setNext(false);
        setTries(tries-1);
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

                    <div className="max-w-80 max-h-80 flex justify-center items-center border-black border-4">
                        {flag ? <img src={flag} alt={name} className="max-w-full max-h-full object-contain"/> :
                            <p>No image available</p>}
                    </div>

                    {message && <p className={"text-black text-xl"}>{message}</p>}

                    <input className={"h-10 w-70 border-2 rounded-lg bg-[#E8B1EC] border-[#ED6EF6] text-black text-xl"}
                           placeholder={"Introduce the flag name..."} value={guess}
                           onChange={(e) => setGuess(e.target.value)}/>

                    <div className="flex flex-row justify-center">
                        {!next && !finished ?
                            <button className={"cursor-pointer h-15 w-35 rounded-4xl border-b-8 hover:border-none " +
                                "text-lg border-[#ED6EF6] bg-[#E8B1EC] text-black"}
                                    onClick={() => validatePicture(name, guess)}>
                                Resolve
                            </button> : null}

                        {next && !finished ?
                            <button className={"cursor-pointer h-15 w-35 rounded-4xl border-b-8 hover:border-none " +
                                "text-lg border-[#ED6EF6] bg-[#E8B1EC] text-black"}
                                    onClick={() => nextGame()}>
                                Next
                            </button> : null}

                        {finished ? <button className={"cursor-pointer h-15 w-35 rounded-4xl border-b-8 hover:border-none " +
                            "text-lg border-[#ED6EF6] bg-[#E8B1EC] text-black"}
                                            onClick={() => nextGame() || setFinished(false) || setTries(4) || setScore(0)}>
                            Retry
                        </button> : null}

                        {finished ?
                            <Link href={{pathname: "../GameSelectionPage", query: {Points: bestScore, Subject: "Geography"}}}>
                                <button className={"cursor-pointer h-15 w-35 rounded-4xl border-b-8 hover:border-none " +
                                    "text-lg border-[#ED6EF6] bg-[#E8B1EC] text-black"}>
                                    Finish game
                                </button>
                            </Link>
                                : null}
                    </div>

                    <div className={"text-black text-2xl font-black flex justify-between"}><p className="text-gray-600 font-light">Score: {score}</p></div>
                </div>
            </section>
            <Footer></Footer>
        </div>
    )
}

export default DetectiveMrWorldWide;