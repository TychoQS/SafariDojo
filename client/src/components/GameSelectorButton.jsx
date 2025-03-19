export default function GameSelectorButton() {
    return (
        <button className={"cursor-pointer h-85 w-115 text-4xl flex flex-col items-center justify-center gap-10 border-4 " +
            "rounded-lg hover:bg-red-400 hover:border-red-300 bg-red-300 border-red-400 text-black"}>

            <img className={"h60 w-60"} src={"../../images/platypus.png"} alt={"platypus"}></img>
            Game name

        </button>
    )
}