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

const DominoTile = ({
                        tile,
                        rotation = 0,
                        isPlaceholder = false,
                        isPreview = false,
                        isValid = true,
                        onClick,
                        onDragStart
                    }) => {
    const isHorizontal = rotation === 90 || rotation === 270;

    const tileStyle = {
        transform: `rotate(${rotation}deg)`,
    };

    const tileClasses = `
    ${isHorizontal ? 'flex-row' : 'flex-col'}
    ${isPlaceholder ? 'opacity-50' : ''}
    ${isPreview ? 'opacity-80' : ''}
    ${!isValid && isPreview ? 'border-red-500' : ''}
    ${isValid && isPreview ? 'border-green-500' : ''}
  `;

    const tileDimensions = isHorizontal
        ? 'w-48 h-24'
        : 'w-24 h-48';

    return (
        <div
            className={`
        relative cursor-move select-none
        ${isPlaceholder ? 'cursor-default' : ''}
      `}
            style={tileStyle}
            onClick={onClick}
            onDragStart={e => onDragStart && onDragStart(e, tile)}
            draggable={!isPlaceholder}
        >
            <div
                className={`
          bg-white border-4 border-gray-800 rounded-lg shadow-md
          ${tileDimensions} flex ${tileClasses}
          ${isPreview ? 'z-10' : ''}
        `}
            >
                <div className={`${isHorizontal ? 'w-24' : 'w-full'} ${isHorizontal ? 'h-full' : 'h-24'} flex items-center justify-center ${isHorizontal ? 'border-r-2' : 'border-b-2'} border-gray-800`}>
                    {tile.side1.type === 'shape' ? (
                        <ImagePlaceholder shapeName={tile.side1.value} size="md" />
                    ) : (
                        <div className="font-bold text-center text-sm p-1">{tile.side1.value}</div>
                    )}
                </div>

                <div className={`${isHorizontal ? 'w-24' : 'w-full'} ${isHorizontal ? 'h-full' : 'h-24'} flex items-center justify-center`}>
                    {tile.side2.type === 'shape' ? (
                        <ImagePlaceholder shapeName={tile.side2.value} size="md" />
                    ) : (
                        <div className="font-bold text-center text-sm p-1">{tile.side2.value}</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default function DominoMaster() {
    const [score, setScore] = useState(0);
    const [gameFinished, setGameFinished] = useState(false);
    const [showCongrats, setShowCongrats] = useState(false);
    const [boardTiles, setBoardTiles] = useState([]);
    const [playerTiles, setPlayerTiles] = useState([]);
    const [currentLevel, setCurrentLevel] = useState(1);
    const {t} = useTranslation();

    useEffect(() => {
        startNewGame();
    }, [currentLevel]);

    const startNewGame = () => {
        const levelShapes = [...GEOMETRIC_SHAPES].sort(() => Math.random() - 0.5)
            .slice(0, Math.min(4 + currentLevel, GEOMETRIC_SHAPES.length));

        const tiles = [];

        levelShapes.forEach((shape1, i) => {
            levelShapes.forEach((shape2, j) => {
                if (i <= j && tiles.length < 12) {
                    if (Math.random() > 0.5) {
                        tiles.push({
                            id: `${shape1.id}-${shape2.id}`,
                            side1: { type: 'shape', value: shape1.name },
                            side2: { type: 'name', value: shape2.name }
                        });
                    } else {
                        tiles.push({
                            id: `${shape1.id}-${shape2.id}`,
                            side1: { type: 'name', value: shape1.name },
                            side2: { type: 'shape', value: shape2.name }
                        });
                    }
                }
            });
        });

        const shuffledTiles = tiles.sort(() => Math.random() - 0.5);
        const initialTile = shuffledTiles.pop();
        const playerTileCount = Math.min(5 + currentLevel, 7);
        const playerTiles = shuffledTiles.slice(0, playerTileCount);
        const remainingTiles = shuffledTiles.slice(playerTileCount);
        const initialRotation = Math.random() > 0.5 ? 0 : 90;

        setBoardTiles([{
            ...initialTile,
            x: 400,
            y: 200,
            rotation: initialRotation
        }]);

        setPlayerTiles(playerTiles.map(tile => ({
            ...tile,
            rotation: 0
        })));

        setGameFinished(false);
        setShowCongrats(false);

        calculateValidPositions([{
            ...initialTile,
            x: 400,
            y: 200,
            rotation: initialRotation
        }]);
    };

    const calculateValidPositions = () => {};

    useEffect(() => {}, []);

    const handleDragStart = () => {};

    const handleDragOver = () => {};

    const findNearestValidPosition = (x, y) => {
        if (!validDropPositions.length) return null;

        let nearestPos = null;
        let minDistance = 50;

        validDropPositions.forEach(pos => {
            const distance = Math.sqrt(Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2));
            if (distance < minDistance) {
                minDistance = distance;
                nearestPos = pos;
            }
        });

        return nearestPos;
    };

    const isValidTilePlacement = (tile, position) => {
        if (!position) return false;

        const matchesSide1 = (
            (position.type === 'shape' && tile.side1.type === 'name' && tile.side1.value === position.value) ||
            (position.type === 'name' && tile.side1.type === 'shape' && tile.side1.value === position.value)
        );

        const matchesSide2 = (
            (position.type === 'shape' && tile.side2.type === 'name' && tile.side2.value === position.value) ||
            (position.type === 'name' && tile.side2.type === 'shape' && tile.side2.value === position.value)
        );

        return matchesSide1 || matchesSide2;
    };

    const handleDrop = () => {};

    useEffect(() => {}, []);

    const handleRestart = () => {
        setScore(0);
        setCurrentLevel(1);
        startNewGame();
    };

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
