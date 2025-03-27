import {useEffect, useState} from "react";

const CrosswordLegend = ({clues}) => {
    return (
        <ol className="list-decimal pl-8 border p-4 text-xl">
            {clues.map(clue => {
                return <li><span></span>{clue}</li>
            })}
        </ol>
    )
}

const ResultAlert = ({ message, visible, bgColor }) => {
    return (
        <h2 className={
            `transition-opacity duration-1000 ${visible ? "opacity-100" : "opacity-0"} 
            ${bgColor} p-3 w-full text-lg text-center` }>
            {message}
        </h2>
    )
}


const Crossword = ({wordGrid, clues}) =>{
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
            setResultAlert(msg);
            const color = "bg-green-200";
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
            <div className="flex flex-col flex-space-between items-center mt-10">
                <CrosswordLegend clues={clues} />
                <h1 className="text-2xl font-bold mb-4">Crossword Game</h1>
                <div id="crossword" className="grid grid-cols-5 gap-1 border p-2 bg-gray-100 rounded-lg shadow-lg">
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


export default Crossword;