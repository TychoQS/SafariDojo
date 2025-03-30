import React, {useState, useEffect} from "react";
import images from '../../../../database/jsondata/DetectiveLupin.json';
import Footer from "@/components/Footer";
import Header from "@/components/Header";


function getImage() {
    const max = 9;
    const image = Math.floor(Math.random() * max);
    return images[image] || {Name: "", Image: ""};
}

function DetectiveLupin() {
    const [guess, setGuess] = useState("");
    const [message, setMessage] = useState("");
    const [item, setItem] = useState({Name: "", Image: ""});
    const [loading, setLoading] = useState(true);
    const [next, setNext] = useState(false);
    const [score, setScore] = useState(0);

    useEffect(() => {
        setItem(getImage());
        setLoading(false);
    }, []);

    if (loading) return <p>Loading...</p>;

    const name = item.Name;
    const paint = item.Image;

    function validatePicture(name, guess) {
        if (name.trim().toLowerCase() === guess.trim().toLowerCase()) {
            setMessage("Very good, I'm proud of you!!!")
            setScore(score + 100);
        } else {
            setMessage("Nice try!");
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
                        {paint ? <img src={paint} alt={name} className="max-w-full max-h-full object-contain"/> :
                            <p>No image available</p>}
                    </div>

                    {message && <p className={"text-black text-xl"}>{message}</p>}

                    <input className={"h-7.5 w-60 border-2 rounded-lg bg-[#F2C1BB] border-[#F67C6E] text-black"}
                           placeholder={"Introduce the paint name..."} value={guess}
                           onChange={(e) => setGuess(e.target.value)}/>

                    <div className="flex flex-row justify-center">
                        {!next ?
                            <button className={"cursor-pointer h-15 w-35 rounded-4xl border-b-8 hover:border-none " +
                                "text-lg border-[#F67C6E] bg-[#F2C1BB] text-black"}
                                    onClick={() => validatePicture(name, guess)}>
                                Resolve
                            </button> : null}

                        {next ?
                            <button className={"cursor-pointer h-15 w-35 rounded-4xl border-b-8 hover:border-none " +
                                "text-lg border-[#F67C6E] bg-[#F2C1BB] text-black"}
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


export default DetectiveLupin;