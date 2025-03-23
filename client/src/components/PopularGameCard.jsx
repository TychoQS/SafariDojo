import React from 'react';
import animals from "../../../database/jsondata/Subject.json";

const Card = ({gameSubject, isCompleted}) => {
    const subject = animals.find(subject => subject.subjectName === gameSubject);
    const { subjectName, borderColor } = subject;

    return (
        <div
            className="flex items-center w-150 h-15 bg-white border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg">
            <div className="flex items-center px-4 py-2 w-full">

                <div className="flex flex-col justify-center items-center mr-4 w-20">
                    <span className="text-black text-xs mb-1">{subjectName}</span>
                    <div
                        className={`w-5 h-5 rounded-full flex justify-center items-center`}
                        style={{backgroundColor: borderColor}}
                    />
                </div>

                <div className="text-lg text-black mr-4">
                    <span>Juego de Ejemplo</span>
                </div>

                <div className="w-7 h-7 ml-20">
                    <img
                        src="https://via.placeholder.com/30"
                        alt="más uno"
                        className="w-full h-full object-contain"
                    />
                </div>
            </div>

            <div
                className={`w-10 h-10 rounded-full flex justify-center items-center text-lg ${isCompleted ? 'bg-green-500' : 'bg-gray-400'} mr-2`}
            >
                {isCompleted ? '✓' : '♦'}
            </div>
        </div>
    );
};

const App = () => {
    return (
        <div className="min-h-screen bg-black text-white p-6">
            <div className="space-y-6">
                <Card
                    gameSubject="Geography"
                    isCompleted={true}
                />
            </div>
        </div>
    );
};

export default App;
