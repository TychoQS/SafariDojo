import React from "react";
import Crossword from "@/pages/games/Crossword";


const grid = [
    /// HAS TO BE SQUARED
    [null, null, "A", null, null],
    ["D", "O", "G", null, null],
    ["O", null, "E", "E", "L"],
    ["O", null, null, null, null],
    ["F", "I", "S", "H", null],
];

const clues = [
    "Domestic animal with ears that goes meow!",
    "Domestic animal with big nose that smells food and goes wow!",
    "Domestic animal with fins that goes blublublu"
]



const GameDemo = () => {
    return (
        <>
            <Crossword wordGrid={grid} clues={clues} />
        </>
    );
};

export default GameDemo;