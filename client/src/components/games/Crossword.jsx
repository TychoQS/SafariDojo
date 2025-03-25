
const grid = [
    ["C", "A", "T", null, null],
    [null, null, null, null, null],
    ["D", "O", "G", null, null],
    [null, null, null, null, null],
    ["F", "I", "S", "H", null],
];

const clues = [
    "Domestic animal with ears that goes meow!",
    "Domestic animal with big nose that smells food and goes wow!",
    "Domestic animal with fins that goes blublublu"
]

function getCell(cell, row, col){
    if (!cell) return <div className={"w-20 h-20 rounded border bg-zinc-300"}></div>

    return (
        <input
            key={`${row}-${col}`}
            type="text"
            maxLength="1"
            className="w-20 h-20 text-center text-5xl font-bold border rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
    );
}

const CrosswordLegend = ({clues}) => {
    return (
        <ol className="list-decimal pl-8 border p-4 text-xl">
            {clues.map(clue => {
                return <li><span></span>{clue}</li>
            })}
        </ol>
    )
}


const Crossword = (props) =>{
    return (
        <div className="flex flex-col flex-space-between items-center mt-10">
            <CrosswordLegend clues={clues} />
            <h1 className="text-2xl font-bold mb-4">Crossword Game</h1>
            <div className="grid grid-cols-5 gap-1 border p-2 bg-gray-100 rounded-lg shadow-lg">
                {grid.map((row, rowIndex) =>
                    row.map((cell, colIndex) => getCell(cell, rowIndex, colIndex))
                )}
            </div>
            <button className="text-6xl border rounded-md p-4 mt-5 bg-orange-300 shadow-lg cursor-pointer">Solve</button>
        </div>
    )
}


export default Crossword;