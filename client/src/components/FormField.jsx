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
                                      onSubmit,
                                  }) {
    const router = useRouter();
    const [formData, setFormData] = useState(
        inputs.reduce((acc, input) => ({ ...acc, [input.id]: "" }), {})
    );
    const [errors, setErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [id]: value }));
    };

    const handleError = (id, errorMsg) => {
        setErrors((prevErrors) => ({ ...prevErrors, [id]: errorMsg }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);

        const newErrors = {};
        inputs.forEach((input) => {
            const value = formData[input.id] || "";
            if (input.rules) {
                if (input.rules.required && !value) {
                    newErrors[input.id] = `${input.label} is required.`;
                }
                if (input.rules.pattern && !input.rules.pattern.value.test(value)) {
                    newErrors[input.id] = input.rules.pattern.message || `${input.label} is invalid.`;
                }
                if (input.rules.minLength && value.length < input.rules.minLength.value) {
                    newErrors[input.id] = input.rules.minLength.message || `${input.label} must have at least ${input.rules.minLength.value} characters.`;
                }
            }
        });

        if (formData.Password && formData.ConfirmPassword && formData.Password !== formData.ConfirmPassword) {
            newErrors.ConfirmPassword = "Passwords do not match.";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            onSubmit(formData);
            if (buttonLink) router.push(buttonLink);
        }
    };

    const isFormInvalid = Object.values(errors).some((error) => error) || inputs.some((input) => !formData[input.id]);

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
                            error={isSubmitted ? errors[input.id] : ""}
                        />
                    </div>
                ))}
                <p className={`text-[1.5rem] mt-[1rem] text-PS-dark-yellow ${deliciousHandDrawn.className}`}>
                    {linkText} <a className="text-[#372E55]" href={linkUrl}>Click here</a>
                </p>
                <div className="m-2 w-full text-center">
                    <Button size={buttonSize} type="submit" className="mt-30" disabled={isFormInvalid}>
                        {buttonText}
                    </Button>
                </div>
            </form>
        </section>
    );
}