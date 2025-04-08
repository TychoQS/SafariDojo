import React from "react";

export default function MahjongTile({ position, isSelected, isRemoved, isBlocked, onClick }) {
    if (isRemoved) return null;

    let backgroundColor = "bg-amber";
    let borderColor = "border-amber-800";
    let opacity = isBlocked ? "opacity-40" : "opacity-100";

    switch (position.tile.type) {
        case "form1":
            backgroundColor = "bg-blue-300";
            borderColor = "border-blue-800";
            break;
        case "form2":
            backgroundColor = "bg-green-300";
            borderColor = "border-green-800";
            break;
    }

    if (isSelected) borderColor = "border-red-800";

    const zIndex = `z-${position.layer * 10 + 10}`;
    const cursor = isBlocked ? "cursor-not-allowed" : "cursor-pointer";
    const tileClass = `${backgroundColor} ${borderColor} ${opacity} text-black border-2 rounded-lg p-2 absolute ${cursor} shadow-md ${zIndex} w-32 h-32 flex items-center justify-center text-center transform transition-transform ${isSelected ? "scale-105" : ""}`;

    const tileSpacing = 90;
    const layerOffset = position.layer * 50;
    const top = position.row * tileSpacing + layerOffset;
    const left = position.col * tileSpacing;
    const positionStyle = {top: `${top}px`, left: `${left}px`};

    return (
        <div
            style={positionStyle}
            className={tileClass}
            onClick={onClick}
        >
            <span className="text-sm font-medium">{position.tile.value}</span>
        </div>
    );
};
