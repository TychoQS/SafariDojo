import React from "react";
import AnimalIcon from "@/components/AnimalIcon";

export default function CircleLayout() {
    const radius = 100;
    const centerX = 120;
    const centerY = 120;

    const icons = [
        {subject: 'English', angle: 0},
        {subject: 'Science', angle: 72},
        {subject: 'Art', angle: 144},
        {subject: 'Maths', angle: 216},
        {subject: 'Geography', angle: 288}
    ];

    return (
        <div className="relative flex justify-center items-center w-[250px] h-[250px] mx-auto my-[50px]">
            <div className="absolute w-[200px] h-[200px] border-20 border-white rounded-full"></div>
            {icons.map((icon, index) => {
                const angle = (index / icons.length) * 2 * Math.PI;
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle);

                return (
                    <AnimalIcon
                        key={index}
                        subject={icon.subject}
                        style={{
                            top: `${y}px`,
                            left: `${x}px`,
                            transform: "translate(-50%, -50%)"
                        }}
                    />
                );
            })}
        </div>
    );
};
