/*
======================== USAGE ====================
        <Button size="medium">Click Me</Button>

        <Button size="small">Small Button</Button>

        <Button size="large">Large Button</Button>
*/

import React from 'react';
import {cherryBomb} from '@/styles/fonts';

export default function Button({ size = 'small', children, onClick }) {
    const sizeClasses = {
        small: 'w-40 h-12 text-4xl',
        large: 'w-64 h-12 text-4xl',
    };

    const buttonSizeClass = sizeClasses[size] || sizeClasses.medium;

    return (
        <button
            onClick={onClick}
            className={`cursor-pointer ${buttonSizeClass} rounded-2xl border-2 border-b-8 border-PS-light-black hover:bg-orange-400 hover:border-none 
            bg-PS-dark-yellow font-black shadow-md text-PS-light-black focus:outline-none ${cherryBomb.className}`}
        >
            {children}
        </button>
    );
};