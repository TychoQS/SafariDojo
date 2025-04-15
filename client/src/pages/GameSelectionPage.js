import Header from "@/components/Header";
import Lifes from "@/components/Lifes";
import animals from "../../../database/jsondata/Subject.json";
import AgeSelectorButton from "@/components/AgeSelectorButton";
import Footer from "@/components/Footer";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {cherryBomb} from "@/styles/fonts";
import Carousel from "@/components/Carousel";

function GameSelectionPage() {
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
    const thirdGame = subjectData?.thirdGame;

    const [selectedButton, setSelectedButton] = useState("easy");

    const Click = (Index) => {
        setSelectedButton(Index);
    };


    const carouselData = [
        {id: 1, game: firstGame, subject: subject, backgroundColor: backgroundColor, borderColor: borderColor},
        {id: 2, game: secondGame, subject: subject, backgroundColor: backgroundColor, borderColor: borderColor},
        {id: 4, game: "Comming soon...", subject: subject, backgroundColor: "#cccccc", borderColor: "#999999"},
        {id: 3, game: thirdGame, subject: subject, backgroundColor: backgroundColor, borderColor: borderColor},
    ]

    return (
        <div className={"app min-h-screen flex flex-col bg-PS-main-purple relative"}>
            <Header/>
            <div className="flex items-end justify-end">
                <Lifes/>
            </div>
            <div className={"flex justify-center"}>
                <img className={"h-46 w-40"} src={selectGameIcon} alt={"platypus"}/>
            </div>
            <main className={"flex flex-grow justify-center"}>
                <div className="w-[90%] bg-[#E4EFED] rounded-sm rounded-b-none">
                    <div className={"flex flex-row justify-evenly mb-8 mt-8"}>
                        <div onClick={() => Click("easy")}>
                            <AgeSelectorButton
                                Age={"Easy"}
                                BackgroundColor={selectedButton === "easy" ? borderColor : backgroundColor}
                                BorderColor={selectedButton === "easy" ? backgroundColor : borderColor}
                            />
                        </div>

                        <div onClick={() => Click("medium")}>
                            <AgeSelectorButton
                                Age={"Medium"}
                                BackgroundColor={selectedButton === "medium" ? borderColor : backgroundColor}
                                BorderColor={selectedButton === "medium" ? backgroundColor : borderColor}
                            />
                        </div>

                        <div onClick={() => Click("hard")}>
                            <AgeSelectorButton
                                Age={"Hard"}
                                BackgroundColor={selectedButton === "hard" ? borderColor : backgroundColor}
                                BorderColor={selectedButton === "hard" ? backgroundColor : borderColor}
                            />
                        </div>
                    </div>

                    <div className={"flex justify-center items-center m-4"}>
                        <div className="flex-grow h-px bg-black opacity-100"></div>
                        <h2 className={`${cherryBomb.className} font-bold text-[4rem] text-black ml-[2rem] mr-[2rem]`}>Games
                            Catalog</h2>
                        <div className="flex-grow h-px bg-black opacity-100"></div>
                    </div>

                    <div className={"flex flex-row justify-evenly"}>
                        <Carousel
                            carouselData={carouselData} difficulty={selectedButton}/>
                    </div>
                </div>
            </main>
            <Footer/>
        </div>
    );
}

export default GameSelectionPage;