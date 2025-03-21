export default function GameCard(props) {
    const { Title, Description, Completed, Subject, Score } = props;

    const getBackgroundStyle = () => {
        if (Completed) {
            const backgroundImages = {
                "Art": "url(../images/art.png)",
                "Science": "url(../images/science.png)",
                "English": "url(../images/english.png)",
                "Geography": "url(../images/geography.png)",
                "Math": "url(../images/math.png)"
            };

            return {
                backgroundImage: backgroundImages[Subject] || "url(../images/platypus.png)",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                position: "relative"
            };
        }
        return {};
    };

    return (
        <section
            className="w-80 h-96 flex flex-col m-auto items-center justify-evenly border-4 rounded-lg bg-orange-300 border-orange-500 text-black p-4 shadow-lg relative"
            style={getBackgroundStyle()}
        >
            <div className="text-2xl font-black text-center">{Title}</div>
            <div className="text-sm text-center font-medium p-2 rounded-md">{Description}</div>
            <button className="cursor-pointer w-40 h-12 border-b-8 rounded-full hover:bg-orange-400 hover:border-none bg-orange-500 border-b-violet-950 font-black text-xl shadow-md">
                Start
            </button>
            <div className="text-lg font-semibold">Previous Score: {Score}</div>
        </section>
    );
}
