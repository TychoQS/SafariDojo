import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Title from "@/components/Title";
import GameStats from "@/pages/games/modules/Mahjong/GameStats";
import GameBoard from "@/pages/games/modules/Mahjong/GameBoard";
import useMahjongGame from "@/pages/games/modules/Mahjong/LogicGame";
import Button from "@/components/Button";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import ErrorReportModal from "@/components/ErrorModal";
import saveGameData from "../../StorageServices/SaveDataFinishedGame"

const MahjongPairs = ({dataSets, title}) => {
    const game = useMahjongGame(dataSets);
    const router = useRouter();
    const {t} = useTranslation();

    const playAgain = () =>{
        game.initializeGame()
    }

    const handleCloseMessage = () => {
        router.back();
    };

    return (
        <div className="app min-h-screen flex flex-col bg-PS-main-purple">
            <Header/>
            <section className="flex-1 flex justify-center items-center py-10 bg-PS-main-purple">
                <div className="w-full max-w-screen-lg px-4 flex flex-col items-center">
                    <Title>{title}</Title>

                    <div className="mt-4 mb-2 relative w-[1150px] flex justify-between">
                        <Button size="small" onClick={() => router.back()}> {t("backButton")} </Button>
                        <ErrorReportModal></ErrorReportModal>
                    </div>

                    <div className="w-full flex flex-col items-center">
                        <GameStats
                            completedPairs={Math.floor(game.removedTiles.length / 2)}
                            totalPairs={game.gamePairs.length}
                            score={game.score}
                            message={game.message}
                            mistakes={game.mistakes}
                            onCloseMessage={handleCloseMessage}
                            onRestart={playAgain}
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
    const [data, setData] = useState([]);
    const [difficulty, setDifficulty] = useState("easy");

    async function fetchDifficulty() {
        const previousURL = localStorage.getItem('previousURL');

        if (previousURL) {
            const urlParams = new URLSearchParams(new URL(previousURL).search);
            const ageParam = urlParams.get("Age");
            setDifficulty(ageParam);

            const response = await fetch(`http://localhost:8080/api/getMahjongData?Age=${ageParam}`);
            if (response.ok) {
                const responseData = await response.json();
                setData(responseData.data);
            } else {
                console.error("Error fetching Mahjong data");
            }
        } else {
            console.error("No previous URL found in localStorage");
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            await fetchDifficulty();
        };
        fetchData();
    }, []);

    if (data.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <MahjongPairs
                dataSets={data}
                title={"Mahjong"}
            />
        </div>
    );
};
export default Mahjong;