import React from "react";
import dynamic from 'next/dynamic';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
const CrosswordNoSSR = dynamic(() => import('./modules/Crossword/CrosswordTable'), {
    ssr: false,
});

let currentDifficulty = "mid";
const clues = [];
const possibleWords = {
    "DOG": "Type of animal that breaths underwater",
    "NICHE": "The range of environmental conditions within which the members of a given species can survive and reproduce",
    "TOXIC": "Capable of causing injury or death, especially by chemical means",
    "FAMISHED": "Extremely hungry",
    "RUDIMENTARY": "Imperfectly or incompletely undeveloped",
    "FISH": "Animal that lives in water and breathes through gills",
    "BIRD": "Animal with feathers and wings, usually able to fly",
    "TREE": "Tall plant with a trunk and branches",
    "LION": "Large wild cat known as the king of the jungle",
    "NEST": "Place where birds lay their eggs",
    "RAINFOREST": "Warm, wet forest with lots of plants and animals",
    "REPTILE": "Cold-blooded animal with scales, like a lizard or snake",
    "POLLEN": "Yellow powder made by flowers that helps them make seeds",
    "HABITAT": "Place where an animal or plant naturally lives",
    "MIGRATION": "When animals move to another place for part of the year",
    "EXTINCT": "When a kind of animal no longer exists",
    "PREDATOR": "Animal that hunts other animals for food",
    "PREY": "Animal that is hunted by other animals",
    "NOCTURNAL": "Active at night and asleep during the day",
    "CARNIVORE": "Animal that eats only other animals",
    "HERBIVORE": "Animal that eats only plants",
    "OMNIVORE": "Animal that eats both plants and animals",
    "OCEAN": "Large body of salt water covering much of Earth",
    "DESERT": "Dry place with very little rain and few plants",
    "ECOLOGY": "Study of how living things interact with their environment",
    "SEED": "Part of a plant that can grow into a new plant",
    "SPROUT": "Small new growth from a seed or plant",
    "FUNGUS": "Organism like a mushroom or mold that grows in damp places",
    "CAMOUFLAGE": "Coloring or pattern that helps an animal blend in",
    "CLIMATE": "The usual weather in a place over a long time",
    "DROUGHT": "A long time with little or no rain",
    "FOREST": "Large area filled with trees and animals",
    "GRASSLAND": "Flat land with lots of grasses and few trees",
    "INSECT": "Small animal with six legs and often wings",
    "METAMORPHOSIS": "Big change in form, like caterpillar to butterfly",
    "FOODCHAIN": "The order of who eats whom in nature",
    "PLANKTON": "Tiny sea life eaten by whales and fish",
    "POND": "Small body of still water",
    "TUNDRA": "Cold, treeless area with frozen ground",
    "VOLCANO": "Mountain that can erupt with lava",
    "WEATHER": "What the air is like outside right now",
    "WIND": "Moving air that you can feel",
    "ACORN": "Nut from an oak tree, food for squirrels",
    "ANTLERS": "Branching horns on a deer",
    "BEAVER": "Animal that builds dams in rivers",
    "COCOON": "Silky case where a caterpillar becomes a moth",
    "CORAL": "Tiny sea animal that makes colorful reefs",
    "DECOMPOSER": "Organism that breaks down dead plants and animals",
    "EAGLE": "Large bird with sharp vision and powerful wings",
    "FANG": "Long sharp tooth used by some animals",
    "GEYSER": "Hot spring that sprays water into the air",
    "HIBERNATE": "To sleep through the winter to save energy",
    "IGUANA": "Large green lizard that likes warm places",
    "JUNGLE": "Thick, tropical forest full of plants and animals",
    "KOALA": "Australian animal that eats eucalyptus leaves",
    "LAGOON": "Shallow water separated from the sea by sand"
};

function generateCrossword(size = 15, wordCount = 10) {
    const words = Object.keys(possibleWords);
    const selected = [];

    // Select unique words that fit the grid
    while (selected.length < wordCount) {
        const word = words[Math.floor(Math.random() * words.length)];
        if (!selected.includes(word) && word.length <= size) {
            selected.push(word);
        }
    }

    const grid = Array.from({ length: size }, () => Array(size).fill(null));
    const placedWords = [];

    function placeWord(word, row, col, horizontal) {
        for (let i = 0; i < word.length; i++) {
            const r = horizontal ? row : row + i;
            const c = horizontal ? col + i : col;
            grid[r][c] = word[i];
        }
        clues.push(`(Row: ${row+1}, Column: ${col+1}) - ${possibleWords[word]}`);
        placedWords.push({ word, row, col, horizontal });
    }

    function canPlace(word, row, col, horizontal) {
        for (let i = 0; i < word.length; i++) {
            const r = horizontal ? row : row + i;
            const c = horizontal ? col + i : col;

            if (r >= size || c >= size) return false;
            const current = grid[r][c];
            if (current !== null && current !== word[i]) return false;
        }
        return true;
    }

    function tryPlaceWithIntersection(word) {
        for (const placed of placedWords) {
            for (let i = 0; i < placed.word.length; i++) {
                for (let j = 0; j < word.length; j++) {
                    if (placed.word[i] === word[j]) {
                        const intersectionRow = placed.horizontal
                            ? placed.row + j
                            : placed.row - i + j;
                        const intersectionCol = placed.horizontal
                            ? placed.col - j + i
                            : placed.col + i;

                        const horizontal = !placed.horizontal;

                        const row = horizontal ? intersectionRow : intersectionRow - j;
                        const col = horizontal ? intersectionCol - j : intersectionCol;

                        if (row >= 0 && col >= 0 && canPlace(word, row, col, horizontal)) {
                            placeWord(word, row, col, horizontal);
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    // Place the first word in the middle
    const firstWord = selected.shift();
    const startCol = Math.floor((size - firstWord.length) / 2);
    placeWord(firstWord, Math.floor(size / 2), startCol, true);

    for (let word of selected) {
        if (!tryPlaceWithIntersection(word)) {
            // Fallback: try random positions
            let placed = false;
            for (let attempts = 0; attempts < 100 && !placed; attempts++) {
                const horizontal = Math.random() < 0.5;
                const row = Math.floor(Math.random() * (horizontal ? size : size - word.length));
                const col = Math.floor(Math.random() * (horizontal ? size - word.length : size));
                if (canPlace(word, row, col, horizontal)) {
                    placeWord(word, row, col, horizontal);
                    placed = true;
                }
            }
        }
    }

    return grid;
}

function displayGrid(grid) {
    return grid.map(row =>
        row.map(cell => (cell === null ? "." : cell)).join(" ")
    ).join("\n");
}

const difficulty = {
    low: [5, 4],
    mid: [8, 6],
    high: [20, 10]
}


const grid = generateCrossword(difficulty[currentDifficulty][0], difficulty[currentDifficulty][1]);
console.log(displayGrid(grid));

const Crossword = () => {
    return (
        <>
            <Header/>
            <CrosswordNoSSR wordGrid={grid} clues={clues} />
            <Footer/>
        </>
    );
};

export default Crossword;