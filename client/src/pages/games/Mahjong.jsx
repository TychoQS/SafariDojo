import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Title from "@/components/Title";
import GameStats from "@/pages/games/modules/Mahjong/GameStats";
import GameBoard from "@/pages/games/modules/Mahjong/GameBoard";
import useMahjongGame from "@/pages/games/modules/Mahjong/LogicGame";
import Button from "@/components/Button";
import {useRouter} from "next/router";

const MahjongPairs = ({dataSets, title}) => {
    const game = useMahjongGame(dataSets);

    const router = useRouter();

    return (
        <div className="app min-h-screen flex flex-col bg-PS-main-purple">
            <Header/>
            <section className="flex-1 flex justify-center items-center py-10 bg-PS-main-purple">
                <div className="w-full max-w-screen-lg px-4 flex flex-col items-center">
                    <Title>{title}</Title>

                    <div className="mt-4 mb-2 relative w-[1150px] flex justify-start">
                        <Button size="small" onClick={() => router.back()}> Back </Button>
                    </div>

                    <div className="w-full flex flex-col items-center">
                        <GameStats
                            completedPairs={Math.floor(game.removedTiles.length / 2)}
                            totalPairs={game.gamePairs.length}
                            score={game.score}
                            message={game.message}
                            mistakes={game.mistakes}
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
        { form1: "Red", form2: "/images/Mahjong/red.svg" },
        { form1: "Blue", form2: "/images/Mahjong/blue.svg" },
        { form1: "Pink", form2: "/images/Mahjong/pink.svg" },
        { form1: "Green", form2: "/images/Mahjong/green.svg" },
        { form1: "Yellow", form2: "/images/Mahjong/yellow.svg" },
        { form1: "Orange", form2: "/images/Mahjong/orange.svg" },
        { form1: "One", form2: "/images/Mahjong/1.svg" },
        { form1: "Two", form2: "/images/Mahjong/2.svg" },
        { form1: "Three", form2: "/images/Mahjong/3.svg" },
        { form1: "Four", form2: "/images/Mahjong/4.svg" },
        { form1: "Five", form2: "/images/Mahjong/5.svg" },
        { form1: "Six", form2: "/images/Mahjong/6.svg" },
        { form1: "Seven", form2: "/images/Mahjong/7.svg" },
        { form1: "Eight", form2: "/images/Mahjong/8.svg" },
        { form1: "Nine", form2: "/images/Mahjong/9.svg" }
    ];

    return (
        <div>
            <MahjongPairs
                dataSets={verbs}
                title={"Mahjong"}
            />
        </div>
    );
};

export default Mahjong;