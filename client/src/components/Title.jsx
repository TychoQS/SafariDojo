import React from 'react';
import { cherryBomb } from '@/styles/fonts';

const Title = ({ children, level = 1 }) => {
    const HeadingTag = `h${level}`;

    return (
        <div className="text-center my-6 relative inline-block pb-2">
            <HeadingTag
                className={`${cherryBomb.className} text-5xl text-[#FBAF00] relative`}
                style={{
                    textShadow: '4px 0px 0px #372E55',
                }}
            >
                <span className="block">{children}</span>
            </HeadingTag>
        </div>
    );
};

export default Title;
