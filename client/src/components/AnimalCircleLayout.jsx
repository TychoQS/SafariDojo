import React, {useState, useEffect} from "react";
import AnimalIcon from "@/components/AnimalIcon";

export default function CircleLayout() {
    const [hoveredSubject, setHoveredSubject] = useState({subject: null, image: null, hoverText: null});
    const [subjectData, setSubjectData] = useState(null);

    const radius = 180;
    const centerX = 200;
    const centerY = 200;

    const icons = [
        {
            subject: 'English',
            angle: 0,
            hoverText: 'Hi, I\'m Owling, and with me, you\'ll master English like never before!'
        },
        {
            subject: 'Science',
            angle: 72,
            hoverText: 'Hi, I\'m Freddy, and with me, you\'ll discover the wonders of Science!'
        },
        {subject: 'Art', angle: 144, hoverText: 'Hey, I\'m Perry, and together, we\'ll unlock the secrets of Art!'},
        {subject: 'Maths', angle: 216, hoverText: 'Hey, I\'m Emily, and Maths will never be the same with me around!'},
        {
            subject: 'Geography',
            angle: 288,
            hoverText: 'Hi, I\'m Kanye, and Geography will be your new favorite subject with me!'
        }
    ];

    useEffect(() => {
        if (!hoveredSubject.subject) {
            setSubjectData(null);
            return;
        }

        const fetchSubjectData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/gameSelectionAssets?` + new URLSearchParams({
                    subject: hoveredSubject.subject
                }), {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json'},
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
    }, [hoveredSubject.subject]);

    return (
        <>
            <div className="fixed inset-0 bg-black transition-opacity duration-500 pointer-events-none z-10"
                 style={{opacity: hoveredSubject.subject ? 0.5 : 0}}
            />

            <div className="relative z-20 flex justify-center items-center w-full h-screen overflow-hidden">
                <div
                    className="relative flex justify-center items-center w-[400px] h-[400px] transition-all duration-700 ease-in-out"
                    style={{
                        transform: hoveredSubject.subject ? "translateX(-80px) scale(0.95)" : "translateX(0px) scale(1)",
                    }}
                >
                    <div
                        className="absolute w-[420px] h-[420px] border-40 rounded-full"
                        style={{
                            borderColor: "white",
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
                                onHoverChange={(subject, image) => {
                                    setHoveredSubject({subject, image, hoverText: icon.hoverText});
                                }}
                                hoveredSubject={hoveredSubject.subject}
                                style={{
                                    top: `${y}px`,
                                    left: `${x}px`,
                                    transform: "translate(-50%, -50%)"
                                }}
                            />
                        );
                    })}
                </div>

                <div
                    className="absolute transition-all duration-700 ease-in-out flex flex-col items-center"
                    style={{
                        right: hoveredSubject.subject ? "15%" : "-30%",
                        opacity: hoveredSubject.subject ? 1 : 0,
                        transform: hoveredSubject.subject ? "translateY(0px)" : "translateY(50px)",
                        paddingTop: '30px',
                    }}
                >
                    {subjectData && hoveredSubject.subject && (
                        <div className="relative flex flex-col items-center">
                            {hoveredSubject.hoverText && (
                                <div className="relative mb-6">
                                    <div
                                        className="bg-white text-black text-center text-lg px-6 py-4 rounded-lg shadow-lg relative max-w-xs break-words">
                                        {hoveredSubject.hoverText}
                                        <div
                                            className="absolute left-1/2 transform -translate-x-1/2 top-full w-0 h-0 border-t-8 border-t-white border-x-8 border-x-transparent"></div>
                                    </div>
                                </div>
                            )}
                            <img
                                src={subjectData.selectGameIcon}
                                alt="Animal Preview"
                                className="rounded-lg transition-all duration-700 ease-in-out"
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
