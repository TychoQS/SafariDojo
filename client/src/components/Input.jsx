/*
======================== USAGE ====================
        <Input
            id="password"
            label="Password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            onError={handleError}
            rules={{
                required: true,
                password: true,
                minLength: { value: 6, message: "Password must be at least 6 characters." },
            }}
        />

 */

import React, { useState, useEffect } from "react";
import { deliciousHandDrawn } from "@/styles/fonts";

export default function Input({
                                  size = "medium",
                                  id,
                                  label,
                                  placeholder,
                                  value,
                                  onChange,
                                  rules,
                                  onError,
                              }) {
    const [error, setError] = useState("");

    const sizeClasses = {
        medium: "w-40 h-12 text-2xl",
        large: "w-64 h-12 text-2xl",
    };

    const borderColor = size === "medium" ? "border-PS-dark-yellow" : "border-PS-light-black";
    const inputSizeClass = sizeClasses[size] || sizeClasses.medium;
    const labelColor = id === "recovery" ? "text-PS-dark-yellow" : "text-PS-light-black";

    const validate = (value) => {
        let errorMsg = "";

        if (rules?.required && !value) {
            errorMsg = `${label} is required.`;
        }

        if (rules?.minLength && value.length < rules.minLength.value) {
            errorMsg = rules.minLength.message || `${label} must have at least ${rules.minLength.value} characters.`;
        }

        if (rules?.pattern && !rules.pattern.value.test(value)) {
            errorMsg = rules.pattern.message || `${label} is not valid.`;
        }

        if (id === "Password" && rules?.password && !/[A-Z]/.test(value)) {
            errorMsg = "Password must contain at least one uppercase letter.";
        }
        if (id === "Password" && rules?.password && !/\d/.test(value)) {
            errorMsg = "Password must contain at least one number.";
        }

        setError(errorMsg);
        onError(id, errorMsg);
    };

    useEffect(() => {
        validate(value);
    }, [value]);

    return (
        <div className="flex flex-col items-center">
            {label && (
                <label
                    htmlFor={id}
                    className={`block text-center w-full text-2xl ${deliciousHandDrawn.className} ${labelColor}`}
                    style={{
                        cursor: "default",
                        userSelect: "none",
                    }}
                >
                    {label}
                </label>
            )}
            <input
                id={id}
                type={id.toLowerCase().includes("password") ? "password" : "text"}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`input-field text-[#000000] bg-[#FFFFFF] 
    ${borderColor} rounded-2xl px-4 py-2 border-2 outline-none border-b-6 ${inputSizeClass} ${deliciousHandDrawn.className}`}
            />
            {error && (
                <p className="text-red-500 text-sm">{error}</p>
            )}
        </div>
    );
}
