import Header from "@/components/Header";
import Lifes from "@/components/Lifes";
import GameSelectionButton from '@/components/GameSelectorButton';
import animals from "../../../database/jsondata/Subject.json";
import AgeSelectorButton from "@/components/AgeSelectorButton";
import Footer from "@/components/Footer";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {useAuth} from "@/pages/context/AuthContext";
import {cherryBomb} from "@/styles/fonts";

function GameSelectionPage() {
    const {isLoggedIn} = useAuth();
    const router = useRouter();
    const [subject, setSubject] = useState(null);
    const [subjectData, setSubjectData] = useState(null);

    useEffect(() => {
        if (router.isReady) {
            const querySubject = router.query.Subject;
            setSubject(querySubject);
        }
    }, [router.isReady, router.query]);

    useEffect(() => {
        if (subject) {
            const foundSubjectData = animals.find(item => item.subjectName === subject);
            if (foundSubjectData) {
                setSubjectData(foundSubjectData);
            }
        }
    }, [subject]);

    const selectGameIcon = subjectData?.selectGameIcon;
    const backgroundColor = subjectData?.backgroundColor;
    const borderColor = subjectData?.borderColor;
    const firstGame = subjectData?.firstGame;
    const secondGame = subjectData?.secondGame;

    const [SelectedButton, setSelectedButton] = useState("easy");

    const Click = (Index) => {
        setSelectedButton(Index);
    };

    const handleGameClick = (game, age) => {
        if (!isLoggedIn && (game !== firstGame || age !== "easy")) {
            alert("You must be logged in to play this game");
            router.push("/LogIn");
        } else {
            router.push({pathname: "/QuizzPreview", query: {Subject: subject, Game: game, Age: age}});
        }
    };

    return (
            <div className={"app min-h-screen flex flex-col bg-PS-main-purple relative"}>
                <Header/>
                <div className="flex items-end justify-end">
                    <Lifes />
                </div>
                <div className={"flex justify-center"}>
                    <img className={"h-46 w-40"} src={selectGameIcon} alt={"platypus"}/>
                </div>
                <main className={"flex flex-grow justify-center"}>
                    <div className="w-[90%] bg-[#E4EFED] rounded-sm">
                        <div className={"flex flex-row justify-evenly mb-8 mt-8"}>
                            <div onClick={() => Click("easy")}>
                                <AgeSelectorButton
                                    Age={"Easy"}
                                    BackgroundColor={SelectedButton === "easy" ? borderColor : backgroundColor}
                                    BorderColor={SelectedButton === "easy" ? backgroundColor : borderColor}
                                />
                            </div>

                            <div onClick={() => Click("medium")}>
                                <AgeSelectorButton
                                    Age={"Medium"}
                                    BackgroundColor={SelectedButton === "medium" ? borderColor : backgroundColor}
                                    BorderColor={SelectedButton === "medium" ? backgroundColor : borderColor}
                                />
                            </div>

                            <div onClick={() => Click("hard")}>
                                <AgeSelectorButton
                                    Age={"Hard"}
                                    BackgroundColor={SelectedButton === "hard" ? borderColor : backgroundColor}
                                    BorderColor={SelectedButton === "hard" ? backgroundColor : borderColor}
                                />
                            </div>
                        </div>

                        <div className={"flex justify-center items-center m-4"}>
                            <div className="flex-grow h-px bg-black opacity-100"></div>
                            <h2 className={`${cherryBomb.className} font-bold text-[4rem] text-black ml-[2rem] mr-[2rem]`}>Games Catalog</h2>
                            <div className="flex-grow h-px bg-black opacity-100"></div>

                        </div>

                        <div className={"flex flex-row justify-evenly"}>
                            <div>
                                <button onClick={() => handleGameClick(firstGame, SelectedButton)}>
                                    <GameSelectionButton
                                        Game={firstGame}
                                        Subject={subject}
                                        BackgroundColor={backgroundColor}
                                        BorderColor={borderColor}
                                    />
                                </button>
                            </div>

                            <div>
                                <button onClick={() => handleGameClick(secondGame, SelectedButton)}>
                                    <GameSelectionButton
                                        Game={secondGame}
                                        Subject={subject}
                                        BackgroundColor={backgroundColor}
                                        BorderColor={borderColor}
                                    />
                                </button>
                            </div>

                            <div>
                                <button onClick={() => handleGameClick(firstGame, SelectedButton)}>
                                    <GameSelectionButton
                                        Game={firstGame}
                                        Subject={subject}
                                        BackgroundColor={backgroundColor}
                                        BorderColor={borderColor}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
            </main>
            <Footer/>
        </div>
    );
}

export default GameSelectionPage;