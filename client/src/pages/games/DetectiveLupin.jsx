import React, {useState, useEffect, useRef} from "react";
import images from '../../../../database/jsondata/DetectiveLupin.json';
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Link from "next/link";
import Lifes from "@/components/Lifes";
import {useRouter} from "next/router";


function getImage() {
    const max = 9;
    const image = Math.floor(Math.random() * max);
    return images[image] || {Name: "", Image: ""};
}

function fetchPaintings(difficulty = 'easy') {
    return fetch(`http://localhost:8080/api/getPaintings?` + new URLSearchParams({
        difficulty: difficulty.toLowerCase()
    }), {
        method: "GET",
        headers: {'Content-Type': 'application/json'},
    });
}

function DetectiveLupin() {
    const [guess, setGuess] = useState("");
    const [message, setMessage] = useState("");

    const [item, setItem] = useState({Name: "", Image: ""});
    const [loading, setLoading] = useState(true);

    const [next, setNext] = useState(false);
    const [score, setScore] = useState(0);

    const [bestScore, setBestScore] = useState(0);
    const [tries, setTries] = useState(4);

    const [finished, setFinished] = useState(false);
    const [gamePaintings, setGamePaintings] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const lifesRef = useRef(null);

    let currentPainting = gamePaintings[currentIndex];

    const router = useRouter();
    const fetchGameData = async () => {
        if (!router.isReady) return;
        let difficulty = router.query.Age || "easy";
        const response = await fetchPaintings(difficulty);
        if (response.ok) {
            let fetchedPaintings = await response.json();
            fetchedPaintings.sort(() => 0.5 - Math.random());
            setGamePaintings(fetchedPaintings.slice(0,5));

        }

    }

    useEffect(() => {
        setItem(getImage());
        setLoading(false);
    }, []);

    useEffect(() => {
        if (router.isReady) {
            fetchGameData().then(r => (console.log("Loaded game countries")));
            setCurrentIndex(0);
        }
    }, [router.isReady, router.query.Age]);

    if (loading) return <p>Loading...</p>;


    function validatePicture(name, guess) {
        if (tries === 0) {
            setFinished(true);
            if (score < 300 && lifesRef.current) {
                lifesRef.current.loseLife();
            }
        }
        if (currentPainting?.name.trim().toLowerCase() === guess.trim().toLowerCase()) {
            setMessage("Nice!")
            setScore(prev => prev + 5);
        } else {
            setMessage("Nice try!");
        }
        setNext(true);
        setBestScore(Math.max(bestScore, score));
    }

    function nextGame() {
        setItem(getImage());
        setGuess("");
        setMessage("");
        setNext(false);
        setTries(prev => prev - 1);
        setCurrentIndex(prev => prev + 1);
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

                    <div className="max-w-80 max-h-80 flex justify-center items-center">
                        <img src={`${currentPainting?.image}`} alt={`${currentPainting?.name}`} className="max-w-full max-h-full object-contain"/>
                    </div>

                    {message && <p className={"text-black text-xl"}>{message}</p>}

                    <input className={"h-7.5 w-60 border-2 rounded-lg bg-[#F2C1BB] border-[#F67C6E] text-black"}
                           placeholder={"Introduce the paint name..."} value={guess}
                           onChange={(e) => setGuess(e.target.value)}/>

                    <div className="flex flex-row justify-center">
                        {!next && !finished ?
                            <button className={"cursor-pointer h-15 w-35 rounded-4xl border-b-8 hover:border-none " +
                                "text-lg border-[#F67C6E] bg-[#F2C1BB] text-black"}
                                    onClick={() => validatePicture(name, guess)}>
                                Resolve
                            </button> : null}

                        {next && !finished ?
                            <button className={"cursor-pointer h-15 w-35 rounded-4xl border-b-8 hover:border-none " +
                                "text-lg border-[#F67C6E] bg-[#F2C1BB] text-black"}
                                    onClick={() => nextGame()}>
                                Next
                            </button> : null}

                        {finished ? <button className={"cursor-pointer h-15 w-35 rounded-4xl border-b-8 hover:border-none " +
                            "text-lg border-[#F67C6E] bg-[#F2C1BB] text-black"}
                                            onClick={() => nextGame() || setFinished(false) || setTries(4) || setScore(0)}>
                            Retry
                        </button> : null}

                        {finished ?
                            <Link href={{pathname: "../GameSelectionPage", query: {Points: bestScore, Subject: "Art"}}}>
                                <button className={"cursor-pointer h-15 w-35 rounded-4xl border-b-8 hover:border-none " +
                                    "text-lg border-[#F67C6E] bg-[#F2C1BB] text-black"}>
                                    Finish game
                                </button>
                            </Link>
                            : null}
                    </div>

                    <div className={"text-black text-2xl font-black"}>{score}</div>
                </div>
            </section>
            <Footer></Footer>
        </div>
    )
}


export default DetectiveLupin;