import {useState, useEffect, useRef} from "react";
import images from '../../../../database/jsondata/DetectiveMrWorldWide.json';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Lifes from "@/components/Lifes";
import Link from "next/link";
import Title from "@/components/Title";


function getImage() {
    const max = 10;
    const image = Math.floor(Math.random() * max);
    return images[image] || {Name: "", Image: ""};
}

function DetectiveMrWorldWide() {
    const [guess, setGuess] = useState("");
    const [message, setMessage] = useState("");
    const [item, setItem] = useState({Name: "", Image: ""});
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(0);
    const [tries, setTries] = useState(4);
    const lifesRef = useRef(null);
    const [gameStatus, setGameStatus] = useState("playing");
    const [visibleSection, setVisibleSection] = useState(0);


    useEffect(() => {
        setItem(getImage());
        setVisibleSection(getRandomSection());
    }, []);

    const name = item.Name;
    const flag = item.Image;

    function getRandomSection() {
        return Math.floor(Math.random() * 6);
    }

    function validatePicture(name, guess) {
        if (tries <= 1) {
            setGameStatus("finished")
            setBestScore(Math.max(bestScore, score));
            if (score < 300 && lifesRef.current) {
                lifesRef.current.loseLife();
            }
        } else if (tries > 0) {
            setGameStatus("waiting");
        }
        if (name.trim().toLowerCase() === guess.trim().toLowerCase()) {
            setMessage("Nice!")
            setScore(prevScore => prevScore + 5);
        } else {
            setMessage("Nope!");
        }

    }

    function nextGame() {
        setItem(getImage());
        setTries(prevTries => prevTries - 1);
        setGuess("");
        setMessage("");
        setGameStatus("playing")
        setVisibleSection(getRandomSection());
    }

    function resetGame() {
        setTries(4);
        setScore(0);
        setGameStatus("playing");
        setItem(getImage());
        setGuess("");
        setMessage("");
        setVisibleSection(getRandomSection());
    }

    const getClipPathStyle = () => {
        const cols = 3;
        const rows = 2;

        const col = visibleSection % cols;
        const row = Math.floor(visibleSection / cols);

        const xStart = (col / cols) * 100;
        const xEnd = ((col + 1) / cols) * 100;
        const yStart = (row / rows) * 100;
        const yEnd = ((row + 1) / rows) * 100;

        return {
            clipPath: `inset(${yStart}% ${100-xEnd}% ${100-yEnd}% ${xStart}%)`,
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

                    <div className="max-w-80 max-h-80 flex justify-center items-center border-black border-4">
                        {flag ? <img src={flag}
                                     alt={name}
                                     className="max-w-full max-h-full object-contain"
                                     style={getClipPathStyle()}/> :
                            <p>No image available</p>}
                    </div>

                    {message && <p className={"text-black text-xl"}>{message}</p>}


                    <input className={"bg-[#E8B1EC] h-[50px] w-[350px] px-4 py-3 text-[20px] text-gray-600 outline-none rounded-lg border-2 transition-colors" +
                        " duration-300 border-solid border-gray-500 focus:border-[black] focus:text-black"}
                           placeholder={"Introduce the flag name..."} value={guess}
                           onChange={(e) => setGuess(e.target.value)}/>

                    <div className="flex flex-row justify-center">
                        {gameStatus === "playing" ?
                            <button className={"cursor-pointer h-15 w-35 rounded-2xl " +
                                "text-lg border-[#ED6EF6] bg-[#E8B1EC] text-black duration-300 hover:scale-110 "}
                                    onClick={() => validatePicture(name, guess)}>
                                Resolve
                            </button> : null}

                        {gameStatus === "waiting" ?
                            <button className={"cursor-pointer h-15 w-35 rounded-4xl border-b-8 hover:border-none " +
                                "text-lg border-[#ED6EF6] bg-[#E8B1EC] text-black"}
                                    onClick={() => nextGame()}>
                                Next
                            </button> : null}

                        {gameStatus === "finished" ?
                            <div>
                                <div className={"flex flex-col justify-center items-center"}>
                                    <h2 className={"text-[3rem] animate-bounce"}>Congratulations</h2>
                                    <p className={""}>Score: <span className={""}>{score}</span></p>
                                </div>
                                <button className={"cursor-pointer h-15 w-35 rounded-4xl border-b-8 hover:border-none " +
                                    "text-lg border-[#ED6EF6] bg-[#E8B1EC] text-black"}
                                        onClick={() => resetGame()}>
                                    Retry
                                </button>

                                <Link href={{pathname: "../GameSelectionPage", query: {Points: bestScore, Subject: "Geography"}}}>
                                    <button className={"cursor-pointer h-15 w-35 rounded-4xl border-b-8 hover:border-none " +
                                        "text-lg border-[#ED6EF6] bg-[#E8B1EC] text-black"}>
                                        Finish game
                                    </button>
                                </Link>
                            </div> : null}

                    </div>

                    <div className={"text-black text-2xl font-black flex justify-between"}><p className="text-gray-600 font-light">Score: {score}</p></div>
                </div>
            </section>
            <Footer></Footer>
        </div>
    )
}

export default DetectiveMrWorldWide;