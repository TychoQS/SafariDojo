import React from 'react';
import { deliciousHandDrawn } from '@/styles/fonts';

export default function Input({ size = 'medium', id, label, ...props }) {
    const sizeClasses = {
        medium: 'w-40 h-12 text-2xl',
        large: 'w-64 h-12 text-2xl',
    };

    const borderColor = size === 'medium' ? 'border-PS-dark-yellow' : 'border-PS-light-black';

    const inputSizeClass = sizeClasses[size] || sizeClasses.medium;

    const labelColor = id === 'recovery' ? 'text-PS-dark-yellow' : 'text-PS-light-black';

    return (
        <div>
            {label && (
                <label
                    htmlFor={id}
                    className={`block text-center w-full text-2xl ${deliciousHandDrawn.className} ${labelColor}`}
                    style={{
                        cursor: 'default',
                        userSelect: 'none',
                    }}
                >
                    {label}
                </label>
            )}
            <input
                id={id}
                className={`text-[#000000] bg-[#FFFFFF] ${borderColor} rounded-2xl px-4 py-2 border-2 outline-none border-b-6 ${inputSizeClass} ${deliciousHandDrawn.className}`}
                {...props}
            />
        </div>
    );
};
