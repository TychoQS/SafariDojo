/*
======================== USAGE ====================
      <GameSelectorButton
          Game={"Game name"}
          Subject={"Subject (singular)"}>
      </GameSelectorButton>
*/

import {useState} from "react";

export default function GameSelectorButton(props) {
    const {Game, Subject, BackgroundColor, BorderColor} = props;
    const [hoverColor, setHoverColor] = useState(false)

    const hoverMouse = () => {
        setHoverColor(!hoverColor)
    }

    const getColors = {
        true: {backgroundColor: BorderColor, borderColor: BackgroundColor},
        false: {backgroundColor: BackgroundColor, borderColor: BorderColor}
    }

    const getImage = {
            "Math": <img className={"h30 w-35"} src={"../images/platypus.png"} alt={"platypus"}></img>,
            "English": <img className={"h-30 w-35"} src={"../images/platypus.png"} alt={"platypus"}></img>,
            "Geography": <img className={"h-30 w-35"} src={"../images/platypus.png"} alt={"platypus"}></img>,
            "Art": <img className={"h-30 w-35"} src={"../images/platypus.png"} alt={"platypus"}></img>,
            "Science": <img className={"h-30 w-35"} src={"../images/platypus.png"} alt={"platypus"}></img>
    }

    return (
        <div className={"cursor-pointer h-60 w-84 text-2xl flex flex-col items-center justify-center " +
            `gap-5 border-4 rounded-lg font-black text-black`}
             style={getColors[hoverColor]} onMouseOver={hoverMouse} onMouseOut={hoverMouse}>

            {getImage[Subject]}
            {Game}

        </div>
    )
}