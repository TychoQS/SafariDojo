import React from "react";
import animals from "../../../database/jsondata/Subject.json";
import AnimalIcon from "@/components/AnimalIcon";

const CircleLayout = ({ animals }) => {
    const radius = 150;
    const centerX = 190;
    const centerY = 190;

    return (
        <div className="relative flex justify-center items-center w-[400px] h-[400px] mx-auto">
            <div className="absolute w-[350px] h-[350px] border-40 border-white-600 rounded-full"></div>
            {animals.map((animal, index) => {
                const angle = (index / animals.length) * 2 * Math.PI;
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle);
                return (
                    <AnimalIcon
                        key={animal.name}
                        animal={animal.name}
                        imageURL={animal.baseIcon}
                        borderColor={animal.borderColor}
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

const App = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <CircleLayout animals={animals} />
        </div>
    );
};

export default App;