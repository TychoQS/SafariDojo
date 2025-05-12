import Header from "@/components/Header";
import AgeSelectorButton from "@/components/AgeSelectorButton";
import Footer from "@/components/Footer";
import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import {cherryBomb} from "@/styles/fonts";
import Carousel from "@/components/Carousel";
import LoadingPage from "@/components/LoadingPage";
import {useTranslation} from "react-i18next";
import Button from "@/components/Button";

function GameSelectionPage() {
    const router = useRouter();
    const [subject, setSubject] = useState(null);
    const [subjectData, setSubjectData] = useState(null);
    const { t } = useTranslation();


    useEffect(() => {
        if (router.isReady) {
            const querySubject = router.query.Subject;
            setSubject(querySubject);
        }
    }, [router.isReady, router.query]);

    useEffect(() => {
        const fetchData = async () => {
            if (subject) {
                try {
                    const response = await fetch(`http://localhost:8080/api/gameSelectionAssets?` + new URLSearchParams({
                        subject: subject
                    }), {
                        method: 'GET',
                        headers: {'Content-Type': 'application/json'},
                    });

                    if (response.ok) {
                        const gameSelectionSubjectData = await response.json();
                        setSubjectData(gameSelectionSubjectData);
                    }
                } catch (error) {
                    console.error("Error fetching subject data:", error);
                }
            }
        };
        fetchData();
    }, [subject]);

    const selectGameIcon = subjectData?.selectGameIcon;
    const primaryColor = subjectData?.primaryColor;
    const secondaryColor = subjectData?.secondaryColor;
    const firstGame = subjectData?.firstGame;
    const secondGame = subjectData?.secondGame;
    const thirdGame = subjectData?.thirdGame;

    const [selectedButton, setSelectedButton] = useState("easy");

    const Click = (Index) => {
        setSelectedButton(Index);
    };

    const carouselData = [
        {id: 2, game: secondGame, subject: subject, backgroundColor: primaryColor, borderColor: secondaryColor},
        {id: 3, game: thirdGame, subject: subject, backgroundColor: primaryColor, borderColor: secondaryColor},
        {id: 4, game: "Comming soon...", subject: subject, backgroundColor: "#cccccc", borderColor: "#999999"},
        {id: 1, game: firstGame, subject: subject, backgroundColor: primaryColor, borderColor: secondaryColor},

    ]

    return (!subjectData
            ? <LoadingPage/> :
        <div className={"app min-h-screen flex flex-col bg-PS-main-purple relative"}>
            <Header/>
            <div className="flex items-end justify-end">
            </div>
            <div className="relative w-full h-[200px] flex items-center px-20">
                <Button
                    className="ml-4"
                    size="small"
                    onClick={() => router.back()}
                >
                    {t('backButton')}
                </Button>

                <img
                    className="absolute left-1/2 transform -translate-x-1/2 h-46 w-40"
                    src={selectGameIcon}
                    alt="platypus"
                />
            </div>
            <main className={"flex flex-grow justify-center"}>
                <div className="w-[90%] bg-[#E4EFED] rounded-sm rounded-b-none">
                    <div className={"flex flex-row justify-evenly mb-8 mt-8"}>
                        <div onClick={() => Click("easy")}>
                            <AgeSelectorButton
                                Age={t('difficulty.easy')}
                                BackgroundColor={selectedButton === "easy" ? secondaryColor : primaryColor}
                                BorderColor={selectedButton === "easy" ? primaryColor : secondaryColor}
                            />
                        </div>

                        <div onClick={() => Click("medium")}>
                            <AgeSelectorButton
                                Age={t('difficulty.medium')}
                                BackgroundColor={selectedButton === "medium" ? secondaryColor : primaryColor}
                                BorderColor={selectedButton === "medium" ? primaryColor : secondaryColor}
                            />
                        </div>

                        <div onClick={() => Click("hard")}>
                            <AgeSelectorButton
                                Age={t('difficulty.hard')}
                                BackgroundColor={selectedButton === "hard" ? secondaryColor : primaryColor}
                                BorderColor={selectedButton === "hard" ? primaryColor : secondaryColor}
                            />
                        </div>
                    </div>

                    <div className={"flex justify-center items-center m-4"}>
                        <div className="flex-grow h-px bg-black opacity-100"></div>
                        <h2 className={`${cherryBomb.className} font-bold text-[4rem] text-black ml-[2rem] mr-[2rem]`}>{t('gamesCatalog')}</h2>
                        <div className="flex-grow h-px bg-black opacity-100"></div>
                    </div>

                    <div className={"flex flex-row justify-evenly h-[43rem]"}>
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
