
const CrosswordTile = (props) => {
    return (
        <>
            <div className={"size-20 bg-zinc-100 border-2 rounded-" + props.tileType}>
                <p className={"text-center text-[3rem] top-0 " + props.displayStatus}>
                    {props.letter}
                </p>
            </div>
        </>
    )
};

export default CrosswordTile;