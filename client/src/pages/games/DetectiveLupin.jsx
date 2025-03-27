import {useState} from "react";
import images from '../../../../database/jsondata/DetectiveLupin.json';

function getImage() {
    const max = 1;
    const image = Math.floor(Math.random() * max);
    return images[image];
}

function validatePicture(name, guess) {
    if (name === guess) {

    }
}

function DetectiveLupin() {
    const item = getImage();
    const name = item.Name;
    const paint = item.Image;
    const [guess, setGuess] = useState("");

    return (
        <section className={"min-h-screen flex flex-col items-center justify-evenly bg-PS-main-purple"}>
            <div className="h-150 w-175 flex flex-col items-center justify-evenly border-4 rounded-2xl
            border-PS-dark-yellow bg-PS-light-yellow">

                <div className={"w-100"}>
                    <img src={paint} alt={name}></img>
                </div>

                {Won}

                    <input className={"h-7.5 w-60 border-2 rounded-lg bg-[#F2C1BB] border-[#F67C6E] text-black"}
                           placeholder={"Introduce the paint name..."} value={guess}
                           onChange={(e) => {setGuess(e.target.value)} }/>

                    <button className={"cursor-pointer h-15 w-35 rounded-4xl border-b-8 hover:border-none " +
                        "text-lg border-[#F67C6E] bg-[#F2C1BB] text-black"} onClick={() => validatePicture(name, guess)}>
                        Solve
                    </button>
            </div>
        </section>
    )
}


export default DetectiveLupin;