/*
======================== USAGE ====================
        <Input
            size="medium"
            id="input1"
            label="Enter your name"
            placeholder="John Doe"
        />

        <Input
            size="large"
            id="input2"
            label="Email Address"
            placeholder="example@domain.com"
        />
*/

import React from 'react';
import {deliciousHandDrawn} from '@/styles/fonts';

const Input = ({size = 'medium', id, label, ...props}) => {
    const sizeClasses = {
        medium: 'w-40 h-12 text-lg',
        large: 'w-64 h-12 text-xl',
    };

    const borderColor = size === 'medium' ? 'border-[#FBAF00]' : 'border-[#372E55]';

    const inputSizeClass = sizeClasses[size] || sizeClasses.medium;

    return (
        <div className="mb-4">
            {label && (
                <label htmlFor={id}
                       className={`block text-[#372E55] text-center w-full text-lg ${deliciousHandDrawn.className}`}>
                    {label}
                </label>
            )}
            <input
                id={id}
                className={`text-[#000000] bg-[#FFFFFF] ${borderColor} rounded-full px-4 py-2 border-2 outline-none border-b-6 ${inputSizeClass} ${deliciousHandDrawn.className}`}
                {...props}
            />
        </div>
    );
};

export default Input;
