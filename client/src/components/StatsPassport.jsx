import React from 'react';
import {deliciousHandDrawn} from '@/styles/fonts';

export default function StatsPassport () {
    return (
        <div className="flex justify-center bg-PS-main-purple">
            <div className="flex h-100 w-200 border-4 border-[PS-light-black] rounded-4xl">
                <section className="flex justify-center h-full w-[40%] bg-PS-light-black rounded-l-3xl relative">
                    <section className={"w-[60%] h-[70%] border-4 border-PS-dark-yellow bg-PS-main-purple rounded-[4rem] absolute bottom-[2rem]"}></section>
                    <section className={"w-[70%] h-[15%] border-2 border-black bg-PS-light-yellow rounded-2xl absolute bottom-0"}></section>
                </section>
                <section className="flex flex-col justify-center h-full w-[60%] bg-PS-light-yellow rounded-r-3xl relative">
                    <section className={"h-[80%] w-[100%] bottom-0 absolute"}>
                        <div className={"h-10 w-[90%] bg-amber-700 m-[1rem]"}></div>
                        <div className={"h-10 w-[90%] bg-amber-700 m-[1rem]"}></div>
                        <div className={"h-10 w-[90%] bg-amber-700 m-[1rem]"}></div>
                        <div className={"h-10 w-[90%] bg-amber-700 m-[1rem]"}></div>
                        <div className={"h-10 w-[90%] bg-amber-700 m-[1rem]"}></div>
                    </section>

                </section>
            </div>
        </div>

    );
};
