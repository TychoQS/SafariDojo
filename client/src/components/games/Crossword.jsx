import CrosswordTile from "@/components/games/CrosswordTile";

function Word({ word, direction, startRow = 0, startCol = 0 }) {
    const tileSize = 40; // Tamaño fijo de cada CrosswordTile (ajústalo según tu diseño)

    return (
        <div className="relative">
            {Array.from(word).map((letter, index) => (
                <div
                    key={index}
                    className="absolute"
                    style={{
                        width: `${tileSize}px`,
                        height: `${tileSize}px`,
                        left: direction === "row" ? `${(startCol + index) * tileSize}px` : `${startCol * tileSize}px`,
                        top: direction === "col" ? `${(startRow + index) * tileSize}px` : `${startRow * tileSize}px`,
                    }}
                >
                    <CrosswordTile letter={letter} />
                </div>
            ))}
        </div>
    );
}


const Crossword = (props) =>{
    return (
        <>
            <Word word="HELLO" direction="row" startRow={3} startCol={2} />
            <Word word="WORLD" direction="col" startRow={1} startCol={4} />
        </>
    )
}


export default Crossword;