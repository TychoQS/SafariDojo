import {useEffect, useState} from "react";

const ResultAlert = ({ message, visible, bgColor }) => {
    return (
        <div className={"flex justify-center"}>
            <h2 className={
                `fixed transition-opacity duration-1000 ${visible ? "opacity-100" : "opacity-0"} 
            ${bgColor} p-10 w-1/2 top-1/2 border-8 border-b-blue-950 text-lg text-center justify-self-center` }>
                {message}
            </h2>
        </div>
)
}

const CrosswordLegend = ({clues}) => {
    return (
        <ul className="list-decimal bg-white pl-8 border p-4 text-xl">
            {
                clues.map(clue => {
                return <li><span></span>{clue}</li>
            })}
        </ul>
    )
}
const gridColsClass = {
    5: "grid-cols-5",
    6: "grid-cols-6",
    7: "grid-cols-7",
    8: "grid-cols-8",
    9: "grid-cols-9",
    10: "grid-cols-10",
    11: "grid-cols-11",
    12: "grid-cols-12",
    13: "grid-cols-13",
    14: "grid-cols-14",
    15: "grid-cols-15",
    16: "grid-cols-16",
    17: "grid-cols-17",
    18: "grid-cols-18",
    19: "grid-cols-19",
    20: "grid-cols-20"
};


const CrosswordTable = ({wordGrid, clues}) =>{
    const alertTimeout = 2;

    const [grid, setGrid] = useState(
        wordGrid.map(row => row.map(cell => (cell ? "" : null))) // Preserve structure
    );
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => setVisible(false), alertTimeout*1000);
        return () => clearTimeout(timeout);
    }, [visible]);


    const [resultAlert, setResultAlert] = useState("Solve the game!");
    const [alertColor, setAlertColor] = useState("bg-orange-200");

    const clearHandler = () => {
        const newGrid = [...grid];
        setGrid(newGrid.map(row => row.map(cell => (cell !== null ? "" : null))));
    };

    const solveHandler =  () => {
        const isCorrect = grid.every((row, i) =>
            row.every((cell, j) => {
                return !wordGrid[i][j] || cell === wordGrid[i][j]; // Ignore nulls
            })
        );

        if (isCorrect){
            const msg = "Great! You've done it";
            const color = "bg-green-200";
            setResultAlert(msg);
            setAlertColor(color);

        } else {
            const msg = "Try again!";
            const color = "bg-red-200";
            setResultAlert(msg);
            setAlertColor(color);
        }
        setVisible(true);

    }

    return (
        <>
            <ResultAlert message={resultAlert} visible={visible} timeOut={alertTimeout} bgColor={alertColor}/>
            <div className="flex flex-col p-5 flex-space-between items-center bg-PS-main-purple">
                <CrosswordLegend clues={clues} />
                <h1 className="text-2xl font-bold mb-4">Crossword Game</h1>
                <div id="crossword" className={`grid ${gridColsClass[grid.length] || "grid-cols-5"} gap-1 border p-2 bg-gray-100 rounded-lg shadow-lg`}>
                    {wordGrid.map((row, rowIndex) =>
                        row.map((cell, colIndex) => {
                            if (!cell) return <div className={"w-20 h-20 rounded border bg-zinc-300"}></div>
                            return (
                                <input
                                    id={`${rowIndex}-${colIndex}`}
                                    key={`${rowIndex}-${colIndex}`}
                                    value={grid[rowIndex][colIndex]}
                                    type="text"
                                    maxLength="1"
                                    onChange={(e) => {
                                        e.target.value = e.target.value.toUpperCase();
                                        const newGrid = [...grid];
                                        newGrid[rowIndex][colIndex] = e.target.value;
                                        setGrid(newGrid);
                                    }}
                                    className="w-20 h-20 text-center text-5xl font-bold border rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            );
                        })
                    )}
                </div>
                <div>
                    <button onClick={clearHandler} className="text-6xl border rounded-md p-4 mt-5 mr-4 bg-zinc-300 cursor-pointer">Clear</button>
                    <button onClick={solveHandler} className="text-6xl border rounded-md p-4 mt-5 bg-orange-300 shadow-lg cursor-pointer">Solve</button>
                </div>
            </div>
        </>

    )
}


export default CrosswordTable;