import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Title from "@/components/Title";
import GameStats from "@/pages/games/modules/Mahjong/GameStats";
import GameBoard from "@/pages/games/modules/Mahjong/GameBoard";
import useMahjongGame from "@/pages/games/modules/Mahjong/LogicGame";

const MahjongPairs = ({dataSets, title}) => {
    const game = useMahjongGame(dataSets);

    return (
        <div className="app min-h-screen flex flex-col bg-PS-main-purple">
            <Header/>
            <section className="flex-1 flex justify-center items-center py-10 bg-PS-main-purple">
                <div className="w-full max-w-screen-lg px-4 flex flex-col items-center">
                    <Title>{title}</Title>
                    <div className="w-full flex flex-col items-center">
                        <GameStats
                            moves={game.moves}
                            completedPairs={Math.floor(game.removedTiles.length / 2)}
                            totalPairs={game.gamePairs.length}
                            score={game.score}
                            message={game.message}
                            mistakes={game.mistakes}
                            pairMistakes={game.pairMistakes}
                        />
                        <GameBoard
                            board={game.board}
                            selectedTiles={game.selectedTiles}
                            removedTiles={game.removedTiles}
                            onTileClick={game.handleTileClick}
                            isTileBlocked={game.isTileBlocked}
                        />
                    </div>
                </div>
            </section>
            <Footer/>
        </div>
    );
};

const Mahjong = () => {
    const verbs = [
        {form1: "be", form2: "was/were"},
        {form1: "begin", form2: "began"},
        {form1: "come", form2: "came"},
        {form1: "do", form2: "did"},
        {form1: "eat", form2: "ate"},
        {form1: "go", form2: "went"},
        {form1: "have", form2: "had"},
        {form1: "make", form2: "made"},
        {form1: "see", form2: "saw"},
        {form1: "take", form2: "took"},
        {form1: "write", form2: "wrote"},
        {form1: "sleep", form2: "slept"},
        {form1: "speak", form2: "spoke"},
        {form1: "swim", form2: "swam"},
        {form1: "run", form2: "ran"},
        {form1: "drive", form2: "drove"},
        {form1: "sing", form2: "sang"},
        {form1: "buy", form2: "bought"},
        {form1: "choose", form2: "chose"}
    ];

    return (
        <div>
            <MahjongPairs
                dataSets={verbs}
                title={"Verbs Mahjong"}
            />
        </div>
    );
};

export default Mahjong;