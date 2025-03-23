import React from 'react';

import subjects from "../../../database/jsondata/Subject.json";
import {patrickHand, cherryBomb} from "@/styles/fonts";


const Card = ({gameSubject, isCompleted}) => {
    const subject = subjects.find(subject => subject.subjectName === gameSubject);
    const {subjectName, borderColor} = subject;

    return (
        <div
            className="flex items-center w-150 h-15 bg-white border-3 border-[#3E3F4F] rounded-lg overflow-hidden shadow-lg"
        >
            <div className="flex items-center px-4 py-2 w-full">

                <div className="flex flex-col justify-center items-center mr-4 w-20">
          <span
              className={`text-[#3E3F4F] text-xs mb-1 ${patrickHand.className}`}
          >
            {subjectName}
          </span>
                    <div
                        className={`w-5 h-5 rounded-full flex justify-center items-center`}
                        style={{backgroundColor: borderColor}}
                    />
                </div>

                <div className={`text-3xl text-[#3E3F4F] mr-4 ${cherryBomb.className}`}>
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
export default Card;
