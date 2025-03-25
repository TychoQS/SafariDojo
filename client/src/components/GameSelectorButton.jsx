/*
======================== USAGE ====================
      <GameSelectorButton
          Game={"Game name"}
          Subject={"Subject (singular)"}>
      </GameSelectorButton>
*/

export default function GameSelectorButton(props) {
    const {Game, Subject} = props;

    const getImage = {
            "Math": <img className={"h30 w-35"} src={"../images/platypus.png"} alt={"platypus"}></img>,
            "English": <img className={"h-30 w-35"} src={"../images/platypus.png"} alt={"platypus"}></img>,
            "Geography": <img className={"h-30 w-35"} src={"../images/platypus.png"} alt={"platypus"}></img>,
            "Art": <img className={"h-30 w-35"} src={"../images/platypus.png"} alt={"platypus"}></img>,
            "Science": <img className={"h-30 w-35"} src={"../images/platypus.png"} alt={"platypus"}></img>
    }

    const getColor = {
        "Math": "hover:bg-[#1BA8E4] hover:border-[#9BD6EF] bg-[#9BD6EF] border-[#1BA8E4]",
        "English": "hover:bg-[#EFF66E] hover:border-[#FDFFCE] bg-[#FDFFCE] border-[#EFF66E]",
        "Geography": "hover:bg-[#ED6EF6] hover:border-[#E8B1EC] bg-[#E8B1EC] border-[#ED6EF6]",
        "Art": "hover:bg-[#F67C6E] hover:border-[#F2C1BB] bg-[#F2C1BB] border-[#F67C6E]",
        "Science": "hover:bg-[#6EF68B] hover:border-[#C9F1D2] bg-[#] border-[#6EF68B]"
    };

    return (
        <div className={"cursor-pointer h-60 w-84 text-2xl flex flex-col items-center " +
            `justify-center gap-5 border-4 rounded-lg font-black text-black ${getColor[Subject]}`}>

            {getImage[Subject]}
            {Game}

        </div>
    )
}