import React from "react";
import Button from "./Button";
import Input from "@/components/Input";

export default function FormField() {
    return (
        <section className={"bg-[#FFDEB6] w-[25rem] h-[25rem] border-4 border-[#FBAF00] rounded-full items-center mx-auto text-center"}>
            <h1>Sign Up</h1>
            <form onSubmit={e => e.preventDefault()}>
                <Input size="large" id="FullName" label="Name"/>
                <Input size="large" id="UsereMAIL" label="Email"/>
            </form>
            <p className={"text-[0.6rem] mt-[0.7rem] text-[#FBAF00]"}>Already have an account? <a className={"text-[#372E55]"} href={""}>Click here</a></p>
            <Button size="medium">Next</Button>
            </section>
    )
}