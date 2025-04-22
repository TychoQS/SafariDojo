import React from "react";

export default function AnswerOption({countryName}) {
    return (
        <section className="flex justify-center items-center border-2 border-black rounded-lg w-[20rem] h-[6rem] text-center">
            <div className="relative text-[1.5rem]">
                <p>{countryName}</p>
            </div>
        </section>
    );
};