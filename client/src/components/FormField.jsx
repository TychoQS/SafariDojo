/*
======================== USAGE ====================
        <FormField
            title="Sign Up"
            inputs={[
                { id: "FullName", label: "Name", size: "large" },
                { id: "UserEmail", label: "Email", size: "large" }
            ]}
            buttonText="Next"
            buttonSize="medium"
            linkText="Already have an account?"
            linkUrl="#"
        />
*/

import React from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Title from "@/components/Title";

export default function FormField({
    title, inputs, buttonText, buttonSize, linkText, linkUrl
    }) {
    return (
        <section
            className="bg-[#FFDEB6] w-[32rem] h-[32rem] border-4 border-[#FBAF00] rounded-full flex flex-col items-center justify-center mx-auto text-center">
            <Title level={2}>{title}</Title>
            <form onSubmit={e => e.preventDefault()} className="flex flex-col items-center m-[1.75rem]">
                {inputs.map((input, index) => (
                    <Input
                        key={index}
                        id={input.id}
                        label={input.label}
                        size={input.size}
                        placeholder={input.placeholder}
                    />
                ))}
            </form>
            <p className="text-[1rem] mt-[1rem] text-[#FBAF00]">
                {linkText} <a className="text-[#372E55]" href={linkUrl}>Click here</a>
            </p>
            <Button size={buttonSize}>{buttonText}</Button>
        </section>
    );
}