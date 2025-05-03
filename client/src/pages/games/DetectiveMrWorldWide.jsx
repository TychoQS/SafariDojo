import {useState, useEffect, useRef} from "react";
import images from '../../../../database/jsondata/DetectiveMrWorldWide.json';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Lifes from "@/components/Lifes";
import Link from "next/link";
import Title from "@/components/Title";
import Button from "@/components/Button";

const MAX_CLIPPATHS = 6;

function getImage() {
    const max = 25;
    const image = Math.floor(Math.random() * max);
    return images[image] || {Name: "", Image: ""};
}

function DetectiveMrWorldWide() {
    const [guess, setGuess] = useState("");
    const [item, setItem] = useState({Name: "", Image: ""});

    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(0);

    const [tries, setTries] = useState(4);
    const lifesRef = useRef(null);

    const [gameStatus, setGameStatus] = useState("playing");
    const [fullImage, setFullImage] = useState(false);
    const [clipPathIndex, setClipPathIndex] = useState(0);

    useEffect(() => {
        setItem(getImage());
    }, []);

    const name = item.Name;
    const flag = item.Image;

    function getRandomNumber() {
        return Math.floor(Math.random() * MAX_CLIPPATHS);
    }

    function validatePicture() {
        setFullImage(true);
        if (tries <= 1) {
            setGameStatus("semiFinished")
            setBestScore(Math.max(bestScore, score));
            if (score < 300 && lifesRef.current) {
                lifesRef.current.loseLife();
            }
        } else if (tries > 0) {
            setGameStatus("waiting");
        }
        if (isGuessCorrect()) setScore(prevScore => prevScore + 5);

    }

    function isGuessCorrect() { return name.trim().toLowerCase() === guess.trim().toLowerCase();}

    function getMessage() {
        if (!isGuessCorrect())
        return (
        <div className={"flex flex-col items-center justify-center gap-5"}>
            <p className={"flex flex-col text-red-600 text-2xl"}>Incorrect</p>
            <p className={"flex flex-col text-black text-xl"}>Actual Name:
                <span className={"font-bold text-2xl text-blue-600"}>{name}</span></p>
        </div>)
        else return(
            <div className={"flex flex-col items-center justify-center gap-5"}>
                <p className={"flex flex-col text-green-600 text-2xl"}>Correct</p>
                <p className={"flex flex-col text-black text-xl"}>Actual Name:
                    <span className={"font-bold text-2xl text-blue-600"}>{name}</span></p>
            </div>)
    }

    function nextGame() {
        setItem(getImage());
        setTries(prevTries => prevTries - 1);
        setGuess("");
        setGameStatus("playing")
        setFullImage(false);
        setClipPathIndex(getRandomNumber());
    }

    function resetGame() {
        setTries(4);
        setScore(0);
        setGameStatus("playing");
        setItem(getImage());
        setGuess("");
        setFullImage(false);
        setClipPathIndex(getRandomNumber());
    }

    const getClipPathStyle = () => {
        if (fullImage) return {
            width: "100%",
            height: "100%",
            objectFit: "cover"
        };

        const cols = 3;
        const rows = 3;

        const clipPaths = [
            `inset(0% ${100 - (100/cols)}% 0% 0%)`,
            `inset(0% ${100 - (2*100/cols)}% 0% ${100/cols}%)`,
            `inset(0% 0% 0% ${2*100/cols}%)`,
            `inset(0% 0% ${100 - (100/rows)}% 0%)`,
            `inset(${2*100/rows}% 0% 0% 0%)`
        ];

        const clipPath = clipPaths[clipPathIndex];

        return {
            clipPath: clipPath,
            width: "100%",
            height: "100%",
            objectFit: "cover"
        };
    };


    return (
        <div className="app min-h-screen flex flex-col bg-PS-main-purple">
            <Header></Header>
            <section className={"min-h-screen flex flex-col justify-evenly bg-PS-main-purple"}>
                <div className="flex items-end justify-end">
                    <Lifes ref={lifesRef} />
                </div>
                <Title>Detective Mr. WorldWide</Title>

                <div className="h-150 w-175 flex flex-col self-center items-center justify-evenly border-4 rounded-2xl
            border-PS-dark-yellow bg-PS-light-yellow">
                    {gameStatus !== "finished" &&
                        <div className="w-100 h-60 flex justify-center items-center border-black border-4">
                            {flag ? <img src={flag}
                                         alt={name}
                                         className="max-w-full max-h-full object-contain"
                                         style={getClipPathStyle()}/> :
                                <p>No image available</p>}
                        </div>
                    }


                    <div className="flex flex-row justify-center">
                        {gameStatus === "playing" ?
                            <div className={"flex flex-col items-center gap-6"}>
                                <input className={"bg-[#E8B1EC] h-[50px] w-[350px] px-4 py-3 text-[20px] text-gray-600 outline-none rounded-lg border-2 transition-colors" +
                                    " duration-300 border-solid border-gray-500 focus:border-[black] focus:text-black"}
                                       placeholder={"Introduce the flag name..."} value={guess}
                                       onChange={(e) => setGuess(e.target.value)}
                                onKeyDown={(e) => {if(e.key === "Enter") validatePicture(name,  guess);}
                                }/>


                                <button className={"cursor-pointer h-15 w-35 rounded-2xl " +
                                    "text-lg border-[#ED6EF6] bg-[#E8B1EC] text-black duration-300 hover:scale-110 " +
                                    "hover:bg-[#c450cc]"}
                                        onClick={() => validatePicture(name, guess)}>
                                    Resolve
                                </button>
                            </div> : null}

                        {gameStatus === "waiting" ?
                            <div className={"flex flex-col items-center gap-6 text-center"}>
                                {getMessage()}
                                <button className={"cursor-pointer h-15 w-35 rounded-4xl duration-300 hover:scale-110 " +
                                    "hover:bg-[#c450cc] text-lg border-[#ED6EF6] bg-[#E8B1EC] text-black"}
                                        onClick={() => nextGame()}>
                                    Next
                                </button>
                            </div> : null}

                        {gameStatus === "semiFinished" ?
                            <div>
                                <div className={"flex flex-col items-center gap-6 text-center"}>
                                    {getMessage()}
                                    <Button onClick={() => setGameStatus("finished")}>Finish</Button>
                                </div>

                                <div>

                                </div>


                            </div> : null}

                        {gameStatus === "finished" ?
                            <div className={"flex flex-col items-center gap-6 text-center"}>
                                <div className={"flex flex-col justify-center items-center"}>
                                    <h2 className={"text-[3rem] text-black font-bold italic animate-bounce"}>Game Over!</h2>
                                    <p className={"text-black"}>Score: <span className={"font-bold"}>{score}</span></p>
                                </div>
                                <div className={"flex flex-col justify-center items-center gap-6"}>
                                    <button className={"cursor-pointer h-15 w-35 rounded-4xl duration-300 hover:scale-110 " +
                                        "hover:bg-[#c450cc] text-lg border-[#ED6EF6] bg-[#E8B1EC] text-black"}
                                            onClick={() => resetGame()}>
                                        Retry
                                    </button>

                                    <Link href={{pathname: "../GameSelectionPage", query: {Points: bestScore, Subject: "Geography"}}}>
                                        <button className={"cursor-pointer h-15 w-35 rounded-4xl duration-300 hover:scale-110 " +
                                            "hover:bg-[#c450cc] text-lg border-[#ED6EF6] bg-[#E8B1EC] text-black"}>
                                            Return
                                        </button>
                                    </Link>
                                </div>
                            </div>: null}

                    </div>
                    {gameStatus !== "finished" ? (
                        <div className={"text-black text-2xl font-black flex justify-between"}>
                            <p className="text-gray-600 font-light">Score: {score}</p>
                        </div>) : null
                    }
                </div>
            </section>
            <Footer></Footer>
        </div>
    )
}

export default DetectiveMrWorldWide;