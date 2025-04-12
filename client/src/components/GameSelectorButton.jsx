/*
======================== USAGE ====================
      <GameSelectorButton
          Game={"Game name"}
          Subject={"Subject (singular)"}>
      </GameSelectorButton>
*/

import {useState} from "react";
import {cherryBomb} from "@/styles/fonts";

export default function GameSelectorButton(props) {
    const {Game, BackgroundColor, BorderColor} = props;
    const [hoverColor, setHoverColor] = useState(false)

    const hoverMouse = () => {
        setHoverColor(!hoverColor)
    }

    const getColors = {
        true: {backgroundColor: BorderColor, borderColor: BackgroundColor},
        false: {backgroundColor: BackgroundColor, borderColor: BorderColor}
    }

    return (
        <div className={"flex flex-col justify-center items-center cursor-pointer max-w-[20rem]"}>
            <div className={"h-[20rem] w-[20rem] text-2xl flex flex-col items-center justify-center " +
                `gap-5 border-4 rounded-lg font-black text-black`}
                 style={getColors[hoverColor]} onMouseOver={hoverMouse} onMouseOut={hoverMouse}>
            </div>
            <div className={`${cherryBomb.className} flex items-center justify-center text-4xl text-black mt-[1rem] mb-[1rem]`}>
                <h2>{Game}</h2>
            </div>
            <div className={"flex flex-row justify-between items-center"}>
                <p>Pepe</p>
                <p>Pepe</p>
                <p>Pepe</p>
            </div>
    </div>
    )
}