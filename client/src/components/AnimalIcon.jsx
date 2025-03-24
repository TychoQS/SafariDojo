/*
======================== USAGE ====================
        <AnimalIcon
            subject={"Math"}
            style={{ top: "50px", left: "100px" }}
            borderThickness={8}>
        </AnimalIcon>
*/

import React from "react";
import animals from "../../../database/jsondata/Subject.json";

const AnimalIcon = ({ subject, style, borderThickness = 8 }) => {
    const subjectData = animals.find(item => item.subjectName === subject);
    const { animalName, baseIcon, borderColor } = subjectData;

    return (
        <div className="absolute" style={style}>
            <div
                className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-white overflow-hidden"
                style={{
                    borderColor,
                    borderWidth: borderThickness
                }}
            >
                <img
                    src={baseIcon}
                    alt={animalName}
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    );
};

export default AnimalIcon;
