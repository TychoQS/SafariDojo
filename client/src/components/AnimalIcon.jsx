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
                                       link = false,
                                       hoverText,
                                       onHoverChange,
                                       hoveredSubject
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

    const content = (
        <div
            className={`absolute group flex flex-col items-center transition-all duration-300
                ${ hoveredSubject && subject !== hoveredSubject ? 'opacity-90 grayscale' : '' }
            `}
            style={ style }
            onMouseEnter={() => onHoverChange?.(true)}
            onMouseLeave={() => onHoverChange?.(false)}
        >

        <div
                className={`rounded-full overflow-hidden border-solid transition-transform duration-300 ease-in-out 
                            group-hover:scale-130 group-hover:shadow-xl cursor-pointer ${ sizeClasses }`}
                style={{
                    backgroundColor,
                    borderColor,
                    borderWidth: borderThickness,
                    borderStyle: 'solid'
                }}
            >
                <img
                    src={baseIcon}
                    alt={animalName || subject}
                    className="w-full h-full object-cover"
                />
            </div>

            {hoverText && (
                <div
                    className="mt-5 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center whitespace-nowrap"
                    style={{ color: borderColor }}
                >
                    { hoverText }
                </div>
            )}
        </div>
    );

    return link ? (
        <Link href={{ pathname: "/GameSelectionPage", query: { Subject: subject } }}>
            {content}
        </Link>
    ) : (
        content
    );
}
