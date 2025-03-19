import React from "react";
import AnimalIcon from "./AnimalIcon";
import animals from "../../../database/jsondata/animals.json";



const CircleLayout = ({ animals }) => {
    const radius = 150;
    const centerX = 190;
    const centerY = 190;

    return (
        <div className="relative flex justify-center items-center w-[400px] h-[400px] mx-auto">
            <div className="absolute w-[350px] h-[350px] border-40 border-white-600 rounded-full"></div>
            {animals.map((animal, index) => {
                const angle = (index / animals.length) * 2 * Math.PI;
                const x = centerX + radius * Math.cos(angle) - 40;
                const y = centerY + radius * Math.sin(angle) - 40;
                return (
                    <AnimalIcon
                        key={animal.name}
                        animal={animal.name}
                        imageURL={animal.baseIcon}
                        borderColor={animal.borderColor}
                        style={{ top: `${y}px`, left: `${x}px` }}
                    />
                );
            })}
        </div>
    );
};


const App = () => {
    return (
        <div>
            <CircleLayout animals={animals} />
        </div>
    );
};

export default App;

