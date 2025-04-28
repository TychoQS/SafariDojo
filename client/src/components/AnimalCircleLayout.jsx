import React, {useState} from "react";
import AnimalIcon from "@/components/AnimalIcon";

export default function CircleLayout() {
    const [hoveredSubject, setHovering] = useState(null);

    const radius = 180;
    const centerX = 200;
    const centerY = 220;

    const icons = [
        { subject: 'English', angle: 0, hoverText: 'Owling | English Master' },
        { subject: 'Science', angle: 72, hoverText: 'Freddy | Science Master' },
        { subject: 'Art', angle: 144, hoverText: 'Perry | Art Master' },
        { subject: 'Maths', angle: 216, hoverText: 'Emily | Maths Master' },
        { subject: 'Geography', angle: 288, hoverText: 'Kanye | Geography Master' }
    ];

    return (
        <>
            <div className="fixed inset-0 bg-black transition-opacity duration-500 pointer-events-none z-10"
                style={{ opacity: hoveredSubject ? 0.5 : 0 }}
            />

            <div className="relative z-20 flex justify-center items-center w-[400px] h-[400px] mx-auto my-[100px]">
                <div
                    className="absolute w-[420px] h-[420px] border-40 rounded-full transition-all duration-500"
                    style={{
                        borderColor: "white",
                        filter: hoveredSubject ? "brightness(35%)" : "brightness(100%)"
                    }}
                ></div>


                {icons.map((icon, index) => {
                    const angle = (index / icons.length) * 2 * Math.PI;
                    const x = centerX + radius * Math.cos(angle);
                    const y = centerY + radius * Math.sin(angle);

                    return (
                        <AnimalIcon
                            key={index}
                            subject={icon.subject}
                            hoverText={icon.hoverText}
                            link={true}
                            onHoverChange={(isHovering) => {
                                setHovering(isHovering ? icon.subject : null);
                            }}
                            hoveredSubject={hoveredSubject}
                            style={{
                                top: `${y}px`,
                                left: `${x}px`,
                                transform: "translate(-50%, -50%)"
                            }}
                        />
                    );
                })}
            </div>
        </>
    );
}
