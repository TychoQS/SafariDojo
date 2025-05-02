module.exports = {
    theme: {
        extend: {
            colors: {
                "PS-light-black": "#372E55",
                "PS-gray": "#D9D9D9",
                "PS-header-color": "#E4EFED",
                "PS-main-purple": "#9702E2",
                "PS-dark-yellow": "#FBAF00",
                "PS-light-yellow": "#FFDEB6",
                "PS-math-color": "#1BA8E4",
                "PS-art-color": "#F67C6E",
                "PS-science-color": "#6EF68B",
                "PS-geography-color": "#ED6EF6",
                "PS-english-color": "#EFF66E",
            },
            keyframes: {
                pendulum: {
                    '0%': { transform: 'rotate(-20deg)' },
                    '100%': { transform: 'rotate(20deg)' },
                },
            },
            animation: {
                'pendulum': 'pendulum 1.75s ease-in-out infinite alternate',
            }
        },
    },
    plugins: [],
};

