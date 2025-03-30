import {useState, useEffect} from "react";
import images from '../../../../database/jsondata/DetectiveMrWorldWide.json';
import Header from "@/components/Header";
import Footer from "@/components/Footer";


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

    useEffect(() => {
        setItem(getImage());
    }, []);

    const name = item.Name;
    const flag = item.Image;

    function validatePicture(name, guess) {
        if (name.trim().toLowerCase() === guess.trim().toLowerCase()) {
            setMessage("Nice, you must be a real explorer!!!")
            setScore(score + 100);
        } else {
            setMessage("Keep guessing!");
        }
        setNext(true);
    }

    return (
        <div className="app min-h-screen flex flex-col bg-PS-main-purple ">
            <Header></Header>
            <section className={"min-h-screen flex flex-col items-center justify-evenly bg-PS-main-purple"}>
                <div className="h-150 w-175 flex flex-col items-center justify-evenly border-4 rounded-2xl
            border-PS-dark-yellow bg-PS-light-yellow">

                    <div className="max-w-80 max-h-80 flex justify-center items-center">
                        {flag ? <img src={flag} alt={name} className="max-w-full max-h-full object-contain"/> :
                            <p>No image available</p>}
                    </div>

                    {message && <p className={"text-black text-xl"}>{message}</p>}

                    <input className={"h-7.5 w-60 border-2 rounded-lg bg-[#E8B1EC] border-[#ED6EF6] text-black"}
                           placeholder={"Introduce the paint name..."} value={guess}
                           onChange={(e) => setGuess(e.target.value)}/>

                    <div className="flex flex-row justify-center">
                        {!next ?
                            <button className={"cursor-pointer h-15 w-35 rounded-4xl border-b-8 hover:border-none " +
                                "text-lg border-[#ED6EF6] bg-[#E8B1EC] text-black"}
                                    onClick={() => validatePicture(name, guess)}>
                                Resolve
                            </button> : null}

                        {next ?
                            <button className={"cursor-pointer h-15 w-35 rounded-4xl border-b-8 hover:border-none " +
                                "text-lg border-[#ED6EF6] bg-[#E8B1EC] text-black"}
                                    onClick={() => setItem(getImage()) || setGuess("") || setMessage("") || setNext(false)}>
                                Next
                            </button> : null}
                    </div>

                    <div className={"text-black text-2xl font-black"}>{score}</div>
                </div>
            </section>
            <Footer></Footer>
        </div>
    )
}

export default DetectiveMrWorldWide;