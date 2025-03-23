import React from 'react';

const Input = ({ size = 'medium', id, label, ...props }) => {
    const sizeClasses = {
        medium: 'w-40 h-12 text-base',
        large: 'w-64 h-12 text-lg',
    };

    const borderColor = size === 'medium' ? 'border-[#FBAF00]' : 'border-[#372E55]';

    const inputSizeClass = sizeClasses[size] || sizeClasses.medium;

    return (
        <div className="mb-4">
            {label && (
                <label htmlFor={id} className="block text-[#372E55] mb-2 text-center w-full">
                    {label}
                </label>
            )}
            <input
                id={id}
                className={`text-[#000000] bg-[#FFFFFF] ${borderColor} rounded-full px-4 py-2 border-2 outline-none border-b-6 ${inputSizeClass}`}
                {...props}
            />
        </div>
    );
};

export default Input;
