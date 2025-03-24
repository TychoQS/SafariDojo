import React from 'react';
import subjects from "../../../database/jsondata/Subject.json";
import {patrickHand, cherryBomb} from "@/styles/fonts";

const Card = ({gameSubject, isCompleted, medalType}) => {
    const subject = subjects.find(subject => subject.subjectName === gameSubject);
    const {subjectName, baseIcon, borderColor} = subject;

    return (
        <div
            className="relative flex items-center w-150 h-15 bg-white border-3 border-[#3E3F4F] rounded-lg overflow-hidden shadow-lg">
            <div className="flex items-center px-4 py-2 w-full">
                <div className="flex flex-col justify-center items-center w-20">
                      <span className={`text-[#3E3F4F] text-xs ${patrickHand.className}`}>
                        {subjectName}
                      </span>
                    <div className="w-5 h-5 rounded-full" style={{backgroundColor: borderColor}}/>
                </div>

                <div className={`text-3xl text-[#3E3F4F] mr-2 ${cherryBomb.className}`}>
                    <span>Juego de Ejemplo</span>
                </div>

                <div className="w-7 h-7 ml-20 relative flex items-center">
                    <img
                        src={`/images/${medalType}Medal.png`}
                        alt={`${medalType} medal`}
                        className="w-full h-full object-contain"
                    />
                    <img
                        src={baseIcon}
                        alt="Base Icon"
                        className="absolute top-1 left-[40%] transform -translate-x-1/2 w-4 h-4 object-contain"
                    />
                    <span className={`ml-2 text-lg font-bold text-[#3E3F4F] ${patrickHand.className}`}>+1</span>
                </div>
            </div>

            <div
                className={`absolute right-0 -translate-x-1/2 top-1/2 transform -translate-y-1/2 w-10 h-10 flex justify-center items-center text-lg rounded-full ${isCompleted ? 'bg-green-500' : 'bg-gray-400'}`}>
                {isCompleted ? '✓' : '♦'}
            </div>
        </div>
    );
};

export default Card;
