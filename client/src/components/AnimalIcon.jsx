import React from 'react';

const AnimalIcon = ({ animal, imageURL, borderColor }) => {
    return (
        <div className="flex justify-center items-center">
            <img
                src={imageURL}
                alt={animal}
                className={`w-48 h-48 rounded-full border-8 bg-white`}
                style={{ borderColor }}
            />
        </div>
    );
};

const App = () => {
    const animals = [
        { "name": "elephant", "baseIcon": "/images/Elephant.png", "borderColor": "#1BA8E4" },
        { "name": "owl", "baseIcon": "/images/Owl.png", "borderColor": "#EFF66E" },
        { "name": "frog", "baseIcon": "/images/Frog.png", "borderColor": "#32CD32" },
        { "name": "platypus", "baseIcon": "/images/Platypus.png", "borderColor": "#F67C6E" },
        { "name": "kangaroo", "baseIcon": "/images/Kangaroo.png", "borderColor": "#ED6EF6" }
    ];

    return (
        <div className="flex flex-wrap justify-center gap-4 p-4">
            {animals.map((animal) => (
                <AnimalIcon
                    key={animal.name}
                    animal={animal.name}
                    imageURL={animal.baseIcon}
                    borderColor={animal.borderColor}
                />
            ))}
        </div>
    );
};

export default App;