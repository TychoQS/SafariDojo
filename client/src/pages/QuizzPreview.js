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

        return (
            <>
                <div id={"QuizzPreviewComponent"} className={"app min-h-screen flex flex-col bg-PS-main-purple"}>
                    <Header/>
                    <main id={"QuizPreviewMain"} className={"flex flex-grow flex-col relative"}>
                        <section id={"SpeechBubbleSection"} className="flex items-start justify-center relative">
                            <div id={"SpeechBubbleDiv"} className={"mt-8"}>
                                <SpeechBubble // TODO Make it Dynamic
                                    Text={"Lore Ipsum Lore Ipsum Lore Ipsum Lore Ipsum Lore Ipsum Lore Ipsum Lore Ipsum " +
                                        "Lore Ipsum Lore Ipsum Lore Ipsum Lore Ipsum Lore Ipsum Lore Ipsum Lore Ipsum Lore Ipsum "}
                                    Subject={subject}>
                                </SpeechBubble>
                            </div>
                        </section>
                        <section id={"MascotSection"} className="flex flex-row-reverse mr-80 relative z-10">
                            <img
                                id={"MascotImage"}
                                className={"max-h-[600px] object-contain"}
                                src={"../images/SubjectAnimals/Platypus3.png"} // TODO Make it Dynamic
                                alt={"Alt-Text"}
                                height={"600"}
                            />
                            <div id={"GameCardDiv"} className="absolute bottom-[-8.75em] pr-120">
                                <GameCard  // TODO Make it Dynamic
                                    Title={game}
                                    Description={"Game description Game description Game description Game description Game description"}
                                    Completed={true}
                                    Subject={subject}
                                    Score={"0"}>
                                </GameCard>
                            </div>
                        </section>
                    </main>
                    <Footer></Footer>
                </div>
            </>
        )
    }

    export default QuizzPreview;