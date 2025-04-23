/*
======================== USAGE ====================
    <DisplayField
        size="medium"
        label="User Name"
        value="John Doe"
    />
 */

import React from 'react';
import { deliciousHandDrawn } from '@/styles/fonts';

export default function DisplayField({ size = 'medium', label, value }) {
    const sizeClasses = {
        medium: 'w-40 h-12 text-2xl',
        large: 'w-64 h-12 text-2xl',
    };

    const borderColor = size === 'medium' ? 'border-PS-dark-yellow' : 'border-PS-light-black';

    const displaySizeClass = sizeClasses[size] || sizeClasses.medium;

    return (
        <div>
            {label && (
                <label
                    className={`block text-PS-light-black text-center w-full text-2xl ${deliciousHandDrawn.className}`}>
                    {label}
                </label>
            )}
            <div
                className={`text-[#000000] bg-[#FFFFFF] ${borderColor} rounded-2xl px-4 py-2 border-2 border-b-6 ${displaySizeClass} ${deliciousHandDrawn.className}`}>
                {value}
            </div>
        </div>
    );
}
