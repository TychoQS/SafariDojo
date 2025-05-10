import {useState} from "react";
import {cherryBomb} from "@/styles/fonts";

export default function GameSelectorButton(props) {
    const {Game, BackgroundColor, BorderColor, isMiddle} = props;
    const [hoverColor, setHoverColor] = useState(false);

    const hoverMouse = () => {
        setHoverColor(!hoverColor);
    };

    const isComingSoon = Game === "Coming soon...";

    const getColors = {
        true: {backgroundColor: BorderColor, borderColor: BackgroundColor},
        false: {backgroundColor: BackgroundColor, borderColor: BorderColor},
    };

    const sizeClass = isMiddle ? "h-[25rem] w-[25rem]" : "h-[20rem] w-[20rem]";

    const hasBronzeMedal = localStorage.getItem(`${Game}_BronzeMedal`) === "1";
    const hasSilverMedal = localStorage.getItem(`${Game}_SilverMedal`) === "1";
    const hasGoldMedal = localStorage.getItem(`${Game}_GoldMedal`) === "1";

    const grayDotStyle = {
        width: "1rem",
        height: "1rem",
        backgroundColor: "gray",
        borderRadius: "50%",
    };

    return (
        <div className={"flex flex-col justify-center items-center cursor-pointer max-w-[20rem]"}>
            <div
                className={`text-2xl flex flex-col items-center justify-center gap-5 border-4 rounded-lg font-black text-black ${sizeClass}`}
                style={getColors[hoverColor]}
                onMouseOver={hoverMouse}
                onMouseOut={hoverMouse}
            >
                <div className={"w-[80%] h-[80%]"}>
                    <img
                        src={`/images/GameIcons/${Game.toLowerCase().replace(/[^a-z0-9]/g, "")}.svg`}
                        alt={`${Game} icon`}
                        className="object-contain w-full h-full"
                    />
                </div>
            </div>
            <div
                className={`${cherryBomb.className} flex items-center justify-center text-4xl text-black mt-[1rem] mb-[1rem]`}
            >
                <h2>{Game}</h2>
            </div>
            {!isComingSoon && (
                <div className={"flex flex-row items-center gap-[2rem]"}>
                    {hasBronzeMedal ? (
                        <img
                            className={"w-[2.3rem] h-[3rem]"}
                            src={"/images/Medals/BronzeMedal.png"}
                            alt={"Bronze Medal"}
                        />
                    ) : (
                        <div style={grayDotStyle}/>
                    )}
                    {hasSilverMedal ? (
                        <img
                            className={"w-[2.3rem] h-[3rem]"}
                            src={"/images/Medals/SilverMedal.png"}
                            alt={"Silver Medal"}
                        />
                    ) : (
                        <div style={grayDotStyle}/>
                    )}
                    {hasGoldMedal ? (
                        <img
                            className={"w-[2.3rem] h-[3rem]"}
                            src={"/images/Medals/GoldMedal.png"}
                            alt={"Gold Medal"}
                        />
                    ) : (
                        <div style={grayDotStyle}/>
                    )}
                </div>
            )}
        </div>
    );
}