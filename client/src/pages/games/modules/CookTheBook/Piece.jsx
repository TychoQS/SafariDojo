import React from "react";

const handleDragStart = (e, piece, index) => {
    e.dataTransfer.setData('pieceId', piece.id);
    e.dataTransfer.setData('pieceIndex', index);
};

export default function Piece({
                                  piece,
                                  index,
                                  isOnTimeline = false,
                                  isEmpty = false,
                              }) {
    return(
        <div
            onDragStart={(e) =>
                handleDragStart(e, piece, isOnTimeline ? -index - 1 : index)}
            draggable
            className={`relative ${piece.color} p-4 m-2 rounded-lg shadow-md cursor-move transition-all
                hover:shadow-lg transform hover:-translate-y-1
                ${isOnTimeline ? 'border-2 border-PS-art-color' : ''}`}
            style={{
                width: '220px',
                height: '140px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                clipPath: isOnTimeline ?
                    `polygon(
              20% 0%, 75% 0%, 100% 0%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%
            )` :
                    `polygon(
              15% 0%, 75% 0%, 100% 0%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%,
              0% 0%, 15% 20%, 30% 0%,
              50% 0%, 70% 15%, 85% 0%,
              100% 15%, 85% 30%, 100% 50%,
              100% 70%, 85% 85%, 100% 100%,
              70% 100%, 50% 85%, 30% 100%,
              0% 85%, 15% 70%, 0% 50%
            )`
            }}
        >
        <span className="text-xl font-medium text-gray-800 drop-shadow-sm">
          {isEmpty ?  '' : piece.text}
        </span>
        </div>
    );
}