import React from "react";

/*
        USAGE

<GameSelectorButton
      Text={"Game name"}
      Subject={"Subject (singular)"}>
</GameSelectorButton>
*/

export default function GameSelectorButton(props) {
    const Game = props.Text
    const Subject = props.Subject

    const getImage = (Subject) => {
        switch (Subject) {
            case "Math":
                return <img className={"h60 w-60"} src={"../images/platypus.png"} alt={"platypus"}></img>
            case "English":
                return <img className={"h60 w-60"} src={"../images/platypus.png"} alt={"platypus"}></img>
            case "Geography":
                return <img className={"h60 w-60"} src={"../images/platypus.png"} alt={"platypus"}></img>
            case "Art":
                return <img className={"h60 w-60"} src={"../images/platypus.png"} alt={"platypus"}></img>
            case "Science":
                return <img className={"h60 w-60"} src={"../images/platypus.png"} alt={"platypus"}></img>
            default:
                return ""
        }
    }

    const getColor = (Subject) => {
        switch (Subject) {
            case "Math":
                return "hover:bg-blue-400 hover:border-blue-300 bg-blue-300 border-blue-400"
            case "English":
                return "hover:bg-yellow-400 hover:border-yellow-300 bg-yellow-300 border-yellow-400"
            case "Geography":
                return "hover:bg-violet-400 hover:border-violet-300 bg-violet-300 border-violet-400"
            case "Art":
                return "hover:bg-red-400 hover:border-red-300 bg-red-300 border-red-400"
            case "Science":
                return "hover:bg-green-400 hover:border-green-300 bg-green-300 border-green-400"
            default:
                return ""
        }
    }

    return (
        <button className={"cursor-pointer h-85 w-115 text-4xl flex flex-col items-center " +
            `justify-center gap-10 border-4 rounded-lg text-black ${getColor(Subject)}`}>

            {getImage(Subject)}
            {Game}

        </button>
    )
}
