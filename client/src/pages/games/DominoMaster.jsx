import Header from "@/components/Header";
import Title from "@/components/Title";
import Button from "@/components/Button";
import ErrorReportModal from "@/components/ErrorModal";

const GEOMETRIC_SHAPES = [
    { id: 1, name: 'Circle', image: 'circle' },
    { id: 2, name: 'Square', image: 'square' },
    { id: 3, name: 'Triangle', image: 'triangle' },
    { id: 4, name: 'Rectangle', image: 'rectangle' },
    { id: 5, name: 'Rombo', image: 'rombo' },
    { id: 6, name: 'Hexagon', image: 'hexagon' },
    { id: 7, name: 'Pentagon', image: 'pentagon' },
    { id: 8, name: 'Oval', image: 'oval' },
];

const ImagePlaceholder = ({ shapeName, size = "md" }) => {
    const colors = {
        'Circle': 'bg-red-400',
        'Square': 'bg-blue-400',
        'Triangle': 'bg-green-400',
        'Rectangle': 'bg-yellow-400',
        'Rombo': 'bg-purple-400',
        'Hexagon': 'bg-pink-400',
        'Pentagon': 'bg-orange-400',
        'Oval': 'bg-teal-400',
    };

    const shapes = {
        'Circle': 'rounded-full',
        'Square': 'rounded-none',
        'Triangle': 'triangle',
        'Rectangle': 'h-12 w-20',
        'Rombo': 'rotate-45',
        'Hexagon': 'hexagon',
        'Pentagon': 'pentagon',
        'Oval': 'rounded-full h-12 w-20',
    };

    const sizeClasses = {
        sm: 'h-8 w-8',
        md: 'h-12 w-12',
        lg: 'h-16 w-16',
    };

    let baseClasses = `${colors[shapeName]} ${sizeClasses[size]} flex items-center justify-center`;

    if (['Rectangle', 'Oval'].includes(shapeName)) {
        baseClasses = `${colors[shapeName]} flex items-center justify-center`;
    } else if (!['Triangle', 'Hexagon', 'Pentagon'].includes(shapeName)) {
        baseClasses = `${baseClasses} ${shapes[shapeName]}`;
    }

    if (shapeName === 'Triangle') {
        return (
            <div className="relative flex items-center justify-center" style={{width: sizeClasses[size].split(' ')[1], height: sizeClasses[size].split(' ')[0]}}>
                <div className={`${colors[shapeName]} w-0 h-0 border-l-8 border-r-8 border-b-16 border-l-transparent border-r-transparent`}></div>
            </div>
        );
    }

    return (
        <div className={baseClasses}>
            {shapeName === 'Hexagon' && <div className="text-xs font-bold">Hex</div>}
            {shapeName === 'Pentagon' && <div className="text-xs font-bold">Pent</div>}
        </div>
    );
};

export default function DominoMaster() {
    return (
        <div className="app flex flex-col bg-PS-main-purple">
            <Header></Header>
            <section className="justify-center items-center mb-7 flex flex-col py-10 bg-PS-main-purple">
                <Title>Domino Master</Title>
                <div className="mt-4 mb-2 relative w-[1150px] flex justify-between">
                    <Button size="small" onClick={() => router.back()}> {t("backButton")} </Button>
                    <ErrorReportModal></ErrorReportModal>
                </div>
                <div className="flex flex-col align-items-center justify-between p-4 max-w-6xl mx-auto bg-pink-50
                                rounded-lg shadow-lg h-full border-4 border-stone-700"
                     style={{maxHeight: 'auto', width: '1200px'}}
                >
                    <div className="flex flex-col items-center justify-center p-4 bg-blue-50 min-h-screen font-sans overflow-hidden">
                        <h1 className="text-3xl font-bold text-blue-400 mb-5">Geometric Figures</h1>

                        <div className="flex justify-between w-full max-w-3xl mt-4 mb-2">
                            <div className="text-lg text-white font-bold bg-blue-300 py-1 px-3 rounded-lg">
                                Level: {currentLevel}/4
                            </div>
                            <div className="text-lg text-white font-bold bg-green-300 py-1 px-3 rounded-lg">
                                Points: {score}
                            </div>
                            <button
                                onClick={handleRestart}
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-lg"
                            >
                                Restart
                            </button>
                        </div>

                        <div className="relative bg-green-100 border-4 border-green-700 rounded-xl w-full h-96 mb-4 overflow-auto"/>

                        <div className="bg-white p-4 rounded-xl shadow-lg w-full">
                            <h2 className="text-xl font-bold mb-2 text-blue-700">Your tokens:</h2>

                            <div className="flex flex-wrap gap-2 justify-center"/>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
