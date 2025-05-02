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
            animation: {
                "fade-in": "fadeIn 3s ease-in forwards",
                "fade-in-out": "fadeInOut 3s ease-in-out forwards",
                "found-pulse": "foundPulse 4s ease-in-out",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0", transform: "translateY(10px)" },
                    "10%": { opacity: "1", transform: "translateY(0)" },
                },
                fadeInOut: {
                    "0%": { opacity: "0", transform: "translateY(10px)" },
                    "10%": { opacity: "1", transform: "translateY(0)" },
                    "90%": { opacity: "1", transform: "translateY(0)" },
                    "100%": { opacity: "0", transform: "translateY(-10px)" },
                },
                foundPulse: {
                    '0%': { backgroundColor: '#86efac' },
                    '50%': { backgroundColor: '#4ade80' },
                    '100%': { backgroundColor: '#22c55e' },
                }
            },
        },
    },
    plugins: [],
};