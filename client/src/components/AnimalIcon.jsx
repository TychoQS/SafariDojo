import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function AnimalIcon({
                                       subject,
                                       style,
                                       backgroundColor = "white",
                                       borderThickness = 6,
                                       animalName,
                                       size = "medium",
                                       link = false,
                                       onHoverChange,
                                       hoveredSubject
                                   }) {
    const [subjectData, setSubjectData] = useState(null);

    useEffect(() => {
        if (!subject) return;

        const fetchSubjectData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/gameSelectionAssets?` + new URLSearchParams({
                    subject: subject
                }), {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch subject data. Status: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                setSubjectData(data);
            } catch (error) {
                console.error('Error fetching subject data:', error);
            }
        };

        fetchSubjectData();
    }, [subject]);

    const baseIcon = subjectData
        ? subjectData.baseIcon
        : `/images/ProfileAnimals/${animalName}.png`;

    const newBackgroundColor = subjectData ? subjectData.secondaryColor : backgroundColor;
    const newBorderColor = subjectData ? subjectData.primaryColor : "#FBB000";

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
        ${hoveredSubject && subject !== hoveredSubject ? 'opacity-90 grayscale' : ''}`}
            style={style}
            onMouseEnter={() => onHoverChange?.(subject, baseIcon)}
            onMouseLeave={() => onHoverChange?.(null, null)}
        >
            <div
                className={`rounded-full overflow-hidden border-solid transition-transform duration-300 ease-in-out 
                    group-hover:scale-130 group-hover:shadow-xl cursor-pointer ${sizeClasses}`}
                style={{
                    backgroundColor: newBackgroundColor,
                    borderColor: newBorderColor,
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
