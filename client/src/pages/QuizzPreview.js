    import React, {useEffect, useState} from 'react'
    import Header from "@/components/Header";
    import Footer from "@/components/Footer";
    import SpeechBubble from "@/components/SpeechBubble";
    import GameCard from "@/components/GameCard";
    import {useAuth} from "@/pages/context/AuthContext";
    import {useRouter} from "next/router";
    import subjects from "../../../database/jsondata/Subject.json";
    import games from "../../../database/jsondata/Games.json";
    import Lifes from "@/components/Lifes";

    function QuizzPreview() {
        const {isLoggedIn} = useAuth();
        const router = useRouter();

        const [subject, setSubject] = useState(null)
        const [subjectData, setSubjectData] = useState(null)

        const [game, setGame] = useState(null)
        const [gameData, setGameData] = useState(null)

        const [age, setAge] = useState(null)

        useEffect(() => {
            if (router.isReady) {
                const querySubject = router.query.Subject
                const queryGame = router.query.Game
                const queryAge = router.query.Age
                setSubject(querySubject)
                setGame(queryGame)
                setAge(queryAge)
                console.log(querySubject)
            }
        }, [router.isReady, router.query])

        useEffect(() => {
            if (subject) {
                const foundSubjectData = subjects.find(item => item.subjectName.toLowerCase() === subject.toLowerCase());
                if (foundSubjectData) {
                    setSubjectData(foundSubjectData);
                }
            }

            if (subject && game) {
                const subjectGames = games[subject.toLowerCase()];
                if (subjectGames) {
                    const foundGameData = subjectGames.find(item => item.gameName === game);
                    if (foundGameData) {
                        setGameData(foundGameData);
                    }
                }
            }
        }, [game, subject]);

        const selectGameIcon = subjectData?.PreviewGameImage
        const gameDescription = gameData?.gameDescription

        const ageDescription = {
            "easy": "Obtain 500 points to win",
            "medium": "Obtain 1500 points to win",
            "hard": "Obtain 3000 points to win"
        }

        return (
            <>
                <div id={"QuizzPreviewComponent"} className={"app flex min-h-screen flex-col bg-PS-main-purple"}>
                    <Header/>
                    <div className="flex items-end justify-end">
                        <Lifes />
                    </div>
                    <main id={"QuizPreviewMain"} className={"grid flex-grow justify-end items-end grid-cols-3 grid-rows-[1fr_auto]"}>
                        <section id={"SpeechBubbleSection"} className="col-span-3 mt-5 z-20 ">
                                <SpeechBubble
                                    Text={gameDescription}
                                    Subject={subject}>
                                </SpeechBubble>
                        </section>
                        <section id={"StartSection"} className={"col-span-3 row-start-2 grid grid-cols-[1fr_max-content_1fr] z-10 md:space-x-2"}>
                            <section className="col-start-2 flex justify-center items-end z-10 self-end sm:z-0">
                                <GameCard
                                    Title={game}
                                    Description={ageDescription[age]}
                                    Completed={true}
                                    Subject={subject}
                                    Score={"0"}>
                                </GameCard>
                            </section>
                            <section id={"MascotSection"} className="col-start-3 flex items-end justify-start z-0">
                                <img
                                    id={"MascotImage"}
                                    className={"lg:xl:2xl:min-h-[600px] min-h-[280px] object-cover"}
                                    src={selectGameIcon}
                                    alt={"Discipline-Mascot"}
                                />
                            </section>
                        </section>
                    </main>
                        <Footer/>
                </div>
            </>
        )
    }

    export default QuizzPreview;