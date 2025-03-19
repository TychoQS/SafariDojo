import React from "react";

const AnimalIcon = ({ animal, imageURL, borderColor, style }) => {
    return (
        <div className="absolute" style={style}>
            <img
                src={imageURL}
                alt={animal}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full border-8 bg-white"
                style={{ borderColor }}
            />
        </div>
    );
};

export default AnimalIcon;
