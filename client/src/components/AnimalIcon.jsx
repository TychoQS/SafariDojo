/*
======================== USAGE ====================
Subject animals
        <AnimalIcon
            subject={"Math"}
            style={{ top: "50px", left: "100px" }}
            borderThickness={8}
            link = true
            size="small">
        </AnimalIcon>

Profile animals
        <AnimalIcon
            animalName="Lion"
            style={{ top: "150px", left: "200px" }}
            backgroundColor="#FBC078"
            borderThickness={5}
        />

*/

import React from "react";
import animals from "../../../database/jsondata/Subject.json";
import Link from "next/link";

export default function AnimalIcon({
                                       subject,
                                       style,
                                       backgroundColor = "white",
                                       borderThickness = 6,
                                       animalName,
                                       size = "medium",
                                       link = false
                                   }) {
    const subjectData = animals.find(item => item.subjectName === subject);

    const baseIcon = subjectData
        ? subjectData.baseIcon
        : `/images/ProfileAnimals/${animalName}.png`;

    const borderColor = subjectData ? subjectData.borderColor : "#FBB000";

    let sizeClasses = "";

    switch (size) {
        case "medium":
            sizeClasses = "md:w-32 md:h-32";
            break;
        case "large":
            sizeClasses = "md:w-48 md:h-48";
            break;
        case "small":
            sizeClasses = "w-20 h-20";
            break;
    }

    const iconContent = (
        <div className="absolute" style={style}>
            <div
                className={`rounded-full overflow-hidden ${sizeClasses}`}
                style={{
                    backgroundColor,
                    borderColor,
                    borderWidth: borderThickness,
                }}
            >
                <img
                    src={baseIcon}
                    alt={animalName || subject}
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    );

    return link ? (
        <Link href={{pathname: "/GameSelectionPage", query: {Subject: subject}}}>
            {iconContent}
        </Link>
    ) : (
        iconContent
    );
}
