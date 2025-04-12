import React from "react";
import MahjongTile from "@/pages/games/modules/Mahjong/MahjongTile";

export default function GameBoard({ board, selectedTiles, removedTiles, onTileClick, isTileBlocked }) {
    return (
        <section className="flex justify-center items-center bg-amber-200 py-10 w-220 pr-20 rounded-lg">
            <div className="relative" style={{height: "500px", width: "600px"}}>
                {board.map((position) => (
                    !removedTiles.includes(position.tile.id) && (
                        <MahjongTile
                            key={position.tile.id}
                            position={position}
                            isSelected={selectedTiles.some(t => t.tile.id === position.tile.id)}
                            isRemoved={removedTiles.includes(position.tile.id)}
                            isBlocked={isTileBlocked(position)}
                            onClick={() => onTileClick(position)}
                        />
                    )
                ))}
            </div>
        </section>
    );
};
