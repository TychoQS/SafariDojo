import React from "react";

export default function AnswerOption({country}) {
    return (
        <section className="flex justify-center items-center bg-amber-200 rounded-lg">
            <div className="relative">
                <p>{country}</p>
            </div>
        </section>
    );
};