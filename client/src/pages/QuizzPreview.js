    import React, {useEffect, useState} from 'react'
    import Header from "@/components/Header";
    import Footer from "@/components/Footer";
    import SpeechBubble from "@/components/SpeechBubble";
    import GameCard from "@/components/GameCard";
    import {useAuth} from "@/pages/context/AuthContext";
    import {useRouter} from "next/router";
    import animals from "../../../database/jsondata/Subject.json";

    function QuizzPreview() {
        const {isLoggedIn} = useAuth();
        const router = useRouter();
        const [subject, setSubject] = useState(null)
        const [game, setGame] = useState(null)
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

        const getMascotBasedOn = (Subject) => {
            switch (Subject) {
                case "Maths":
                    return "Elephant"
                case "English":
                    return "Owl"
                case "Geography":
                    return "Kangaroo"
                case "Art":
                    return "Platypus"
                case "Science":
                    return "Frog"
                default:
                    return ""
            }
        }

        return (
            <>
                <div id={"QuizzPreviewComponent"} className={"app flex min-h-screen flex-col bg-PS-main-purple"}>
                    <Header/>
                    <main id={"QuizPreviewMain"} className={"grid flex-grow justify-end items-end grid-cols-3 grid-rows-[1fr_auto]"}>
                        <section id={"SpeechBubbleSection"} className="col-span-3 mt-5 z-20 ">
                                <SpeechBubble // TODO Make it Dynamic
                                    Text={"Lore Ipsum Lore Ipsum Lore Ipsum Lore Ipsum Lore Ipsum Lore Ipsum Lore Ipsum " +
                                        "Lore Ipsum Lore Ipsum Lore Ipsum Lore Ipsum Lore Ipsum Lore Ipsum Lore Ipsum Lore Ipsum"}
                                    Subject={subject}>
                                </SpeechBubble>
                        </section>
                        <section id={"StartSection"} className={"col-span-3 row-start-2 grid grid-cols-[1fr_max-content_1fr] z-10 md:space-x-2"}>
                            <section className="col-start-2 flex justify-center items-end z-10 self-end sm:z-0">
                                <GameCard
                                    Title={game}
                                    Description={"Game description Game description Game description Game description Game description"}
                                    Completed={true}
                                    Subject={subject}
                                    Score={"0"}>
                                </GameCard>
                            </section>
                            <section id={"MascotSection"} className="col-start-3 flex items-end justify-start z-0">
                                <img
                                    id={"MascotImage"}
                                    className={"lg:xl:2xl:min-h-[600px] min-h-[280px] object-cover"}
                                    src={`../images/SubjectAnimals/Preview/Preview${getMascotBasedOn(subject)}.png`}
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