import React from "react";

const AnimalIcon = ({ animal, imageURL, borderColor, style }) => {
    return (
        <div className="absolute" style={style}>
            <div
                className="w-20 h-20 md:w-32 md:h-32 rounded-full border-8 bg-white overflow-hidden"
                style={{ borderColor }}
            >
                <img
                    src={imageURL}
                    alt={animal}
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    );
};

export default AnimalIcon;
