import React from "react";

export default function MahjongTile({position, isSelected, isRemoved, isBlocked, onClick}) {
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
    const borderWidth = isSelected ? "border-6" : "border-2";

    const zIndex = position.layer * 10 + 10;
    const cursor = isBlocked ? "cursor-not-allowed" : "cursor-pointer";
    const tileClass = `${backgroundColor} ${borderColor} ${borderWidth} ${opacity} text-black rounded-lg p-2 absolute ${cursor} shadow-md w-32 h-32 flex items-center justify-center text-center transform transition-transform ${isSelected ? "scale-105" : ""}`;

    const tileSpacing = 90;
    const layerOffset = position.layer * 50;
    const top = position.row * tileSpacing + layerOffset;
    const left = position.col * tileSpacing;
    const positionStyle = {
        top: `${top}px`,
        left: `${left}px`,
        zIndex: zIndex
    };

    const isImage = position.tile.value.startsWith("/") || position.tile.value.startsWith("http");

    return (
        <div
            style={positionStyle}
            className={tileClass}
            onClick={onClick}
        >
            {isImage ? (
                <img src={position.tile.value} alt="tile" className="w-20 h-20 object-contain"/>
            ) : (
                <span
                    className="font-medium"
                    style={{
                        fontSize: position.tile.value.length > 10 ? '1.2rem' : '1.5rem',
                    }}
                >
                    {position.tile.value}
                </span>
            )}
        </div>
    );
};
