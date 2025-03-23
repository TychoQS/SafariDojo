import React from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Title from "@/components/Title";

export default function FormField() {
    return (
        <section className="bg-[#FFDEB6] w-[28rem] h-[28rem] border-4 border-[#FBAF00] rounded-full flex flex-col items-center justify-center mx-auto text-center">
            <Title level={1}>Sign Up</Title>
            <form onSubmit={e => e.preventDefault()} className="flex flex-col items-center">
                <Input size="large" id="FullName" label="Name"/>
                <Input size="large" id="UsereMAIL" label="Email"/>
            </form>
            <p className="text-[0.6rem] mt-[0.7rem] text-[#FBAF00]">Already have an account? <a className="text-[#372E55]" href="">Click here</a></p>
            <Button size="medium">Next</Button>
        </section>
    );
}