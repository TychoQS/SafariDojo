import React, { useState } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Title from "@/components/Title";
import { deliciousHandDrawn } from "@/styles/fonts";
import { useRouter } from "next/router";

export default function FormField({
                                      title,
                                      inputs,
                                      buttonText,
                                      buttonSize,
                                      buttonLink,
                                      linkText,
                                      linkUrl,
                                  }) {
    const router = useRouter();
    const [formData, setFormData] = useState(
        inputs.reduce((acc, input) => {
            acc[input.id] = "";
            return acc;
        }, {})
    );
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleError = (id, errorMsg) => {
        setErrors((prevErrors) => ({
            ...prevErrors,
            [id]: errorMsg,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {};

        inputs.forEach((input) => {
            if (input.rules) {
                if (input.rules?.required && !formData[input.id]) {
                    newErrors[input.id] = `${input.label} is required.`;
                }

                if (input.rules?.pattern && !input.rules.pattern.value.test(formData[input.id])) {
                    newErrors[input.id] = input.rules?.pattern?.message || `${input.label} is invalid.`;
                }

                if (input.rules?.minLength && formData[input.id].length < input.rules.minLength.value) {
                    newErrors[input.id] = input.rules.minLength.message || `${input.label} must have at least ${input.rules.minLength.value} characters.`;
                }
            }
        });

        if (formData.Password && formData.ConfirmPassword && formData.Password !== formData.ConfirmPassword) {
            newErrors.ConfirmPassword = "Passwords do not match.";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            console.log("Form Submitted:", formData);
            router.push(buttonLink);
        } else {
            console.log("Form has errors");
        }
    };

    return (
        <section className="bg-[#FFDEB6] w-[32rem] h-[32rem] border-4 border-PS-dark-yellow rounded-full flex flex-col items-center justify-center mx-auto text-center">
            <Title level={2}>{title}</Title>
            <form onSubmit={handleSubmit} className="flex flex-col items-center m-[1.75rem]">
                {inputs.map((input, index) => (
                    <div key={index} className="w-full text-center">
                        <Input
                            id={input.id}
                            label={input.label}
                            size={input.size}
                            placeholder={input.placeholder}
                            value={formData[input.id]}
                            onChange={handleChange}
                            rules={input.rules}
                            onError={handleError}
                        />
                        {input.id === "ConfirmPassword" && errors[input.id] && (
                            <p className="text-red-500 text-sm">{errors[input.id]}</p>
                        )}
                    </div>
                ))}
                <p className={`text-[1.5rem] mt-[1rem] text-PS-dark-yellow ${deliciousHandDrawn.className}`}>
                    {linkText} <a className="text-[#372E55]" href={linkUrl}>Click here</a>
                </p>
                <div className="m-2 w-full text-center">
                    <Button size={buttonSize} type="submit" className="mt-30">
                        {buttonText}
                    </Button>
                </div>
            </form>
        </section>
    );
}