import React from "react";


const handleDragStart = (e, piece, index) => {
    e.dataTransfer.setData('pieceId', piece.id);
    e.dataTransfer.setData('pieceIndex', index);
};

const bgColors = [
        "bg-red-50", "bg-red-100", "bg-red-200", "bg-red-300", "bg-red-400",
        "bg-orange-50", "bg-orange-100", "bg-orange-200", "bg-orange-300", "bg-orange-400",
        "bg-amber-50", "bg-amber-100", "bg-amber-200", "bg-amber-300", "bg-amber-400",
        "bg-yellow-50", "bg-yellow-100", "bg-yellow-200", "bg-yellow-300", "bg-yellow-400",
        "bg-lime-50", "bg-lime-100", "bg-lime-200", "bg-lime-300", "bg-lime-400",
        "bg-green-50", "bg-green-100", "bg-green-200", "bg-green-300", "bg-green-400",
        "bg-emerald-50", "bg-emerald-100", "bg-emerald-200", "bg-emerald-300", "bg-emerald-400",
        "bg-teal-50", "bg-teal-100", "bg-teal-200", "bg-teal-300", "bg-teal-400",
        "bg-cyan-50", "bg-cyan-100", "bg-cyan-200", "bg-cyan-300", "bg-cyan-400",
        "bg-sky-50", "bg-sky-100", "bg-sky-200", "bg-sky-300", "bg-sky-400",
        "bg-blue-50", "bg-blue-100", "bg-blue-200", "bg-blue-300", "bg-blue-400",
        "bg-indigo-50", "bg-indigo-100", "bg-indigo-200", "bg-indigo-300", "bg-indigo-400",
        "bg-violet-50", "bg-violet-100", "bg-violet-200", "bg-violet-300", "bg-violet-400",
        "bg-purple-50", "bg-purple-100", "bg-purple-200", "bg-purple-300", "bg-purple-400",
        "bg-fuchsia-50", "bg-fuchsia-100", "bg-fuchsia-200", "bg-fuchsia-300", "bg-fuchsia-400",
        "bg-pink-50", "bg-pink-100", "bg-pink-200", "bg-pink-300", "bg-pink-400",
        "bg-rose-50", "bg-rose-100", "bg-rose-200", "bg-rose-300", "bg-rose-400",
        "bg-gray-50", "bg-gray-100", "bg-gray-200", "bg-gray-300", "bg-gray-400",
        "bg-zinc-50", "bg-zinc-100", "bg-zinc-200", "bg-zinc-300", "bg-zinc-400",
        "bg-neutral-50", "bg-neutral-100", "bg-neutral-200", "bg-neutral-300", "bg-neutral-400",
        "bg-stone-50", "bg-stone-100", "bg-stone-200", "bg-stone-300", "bg-stone-400"
    ]

;

const randomColor = () => bgColors[Math.floor(Math.random() * bgColors.length)];

export default function Piece({
                                piece,
                                index,
                                isOnTimeline = false,
                                isEmpty = false,
                              }) {

    return(
        <div
            key={`${piece.id}-${index}`}
            draggable
            onDragStart={(e) => handleDragStart(e, piece, isOnTimeline ? -index - 1 : index)}
            className={`relative ${randomColor()} p-4 m-2 rounded-lg shadow-md cursor-move transition-all 
                    hover:shadow-lg transform hover:-translate-y-1 
                    ${isOnTimeline ? 'border-2 border-PS-art-color' : ''}`}
            style={{
                width: '170px',
                height: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                clipPath: isOnTimeline ?
                    `polygon(
              25% 0%, 75% 0%, 100% 0%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%
            )` :
                    `polygon(
              25% 0%, 75% 0%, 100% 0%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%,
              0% 0%, 15% 20%, 30% 0%,
              50% 0%, 70% 15%, 85% 0%,
              100% 15%, 85% 30%, 100% 50%,
              100% 70%, 85% 85%, 100% 100%,
              70% 100%, 50% 85%, 30% 100%,
              0% 85%, 15% 70%, 0% 50%
            )`
            }}
        >
        <span className="text-sm font-medium text-gray-800 drop-shadow-sm">
          {isEmpty ?  '' : piece.text}
        </span>
        </div>
    );
}