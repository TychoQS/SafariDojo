import React from "react";
import animals from "../../../database/jsondata/Subject.json";

const AnimalIcon = ({subject, style}) => {

    const subjectData = animals.find(item => item.subjectName === subject);
    const {animalName, baseIcon, borderColor} = subjectData;

    return (
        <div className="absolute" style={style}>
            <div
                className="w-20 h-20 md:w-32 md:h-32 rounded-full border-8 bg-white overflow-hidden"
                style={{borderColor}}
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