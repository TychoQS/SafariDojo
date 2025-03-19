import React from "react";

export default function FormField() {
    return (
        <section className={"bg-[#FFDEB6] w-[25rem] h-[25rem] border-4 border-[#FBAF00] rounded-full items-center mx-auto text-center"}>
            <h1>Sign Up</h1>
            <form onSubmit={e => e.preventDefault()}>
                <p className={"text-[#372E55] text-[1.5rem]"}>Name</p>
                <input className={"text-[#000000] bg-[#FFFFFF] border-[#372E55] rounded-full px-4 py-2 border-2 outline-none border-b-6 border-b-[#372E55]\n" +
                    "    focus:ring-1 focus:ring-[#372E55]"} type="text" value="name"/>
                <p className={"text-[#372E55] text-[1.5rem]"}>Email</p>
                <input className={"text-[#000000] bg-[#FFFFFF] border-[#372E55] rounded-full px-4 py-2 border-2 outline-none border-b-6 border-b-[#372E55]\n" +
                    "    focus:ring-1 focus:ring-[#372E55]"} type="text" value="email" />
            </form>
            <p className={"text-[0.6rem] mt-[0.7rem] text-[#FBAF00]"}>Already have an account? <a className={"text-[#372E55]"} href={""}>Click here</a></p>
            <button className={"bg-[#FBAF00] w-[7rem] h-[2.2rem] rounded-full mt-[1rem] border-2 border-[#372E55] bottom-[2.2rem] border-b-6 border-b-[#372E55]\n" +
                "    cursor-pointer"}>Next</button>
            </section>
    )
}