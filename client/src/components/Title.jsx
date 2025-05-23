import React from 'react';
import { cherryBomb } from '@/styles/fonts';

const Title = ({ children, level = 1 }) => {
    const HeadingTag = `h${level}`;

    return (
        <div className="text-center my-2 relative inline-block">
            <HeadingTag
                className={`${cherryBomb.className} text-center text-7xl text-PS-dark-yellow
                            [text-shadow:8px_0px_0px_#372E55] [-webkit-text-stroke:1px_black]
                            border-black relative`}
                style={{
                    textShadow: '4px 0px 0px #372E55',
                    cursor: 'default',
                    userSelect: 'none',
                }}
            >
                <span className="block">{children}</span>
            </HeadingTag>
        </div>
    );
};

export default Title;
