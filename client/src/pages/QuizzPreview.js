    import React, {useState} from 'react'
    import Header from "@/components/Header";
    import Footer from "@/components/Footer";
    import SpeechBubble from "@/components/SpeechBubble";

    function QuizzPreview() {
        return (
            <>
                <div className={"app min-h-screen flex flex-col bg-PS-main-purple"}>
                    <Header></Header>
                    <main>
                        <section className="flex flex-grow items-start justify-center relative">
                            <div id={"SpeechBubbleDiv"} className={"mt-8"}>
                                <SpeechBubble
                                    Text={"This is a fun and engaging art game where you need to recognize famous paintings, guess their names," +
                                        "and test your knowledge of classic and modern masterpieces. Challenge yourself, discover new artworks "}
                                    Subject={"Art"}>
                                </SpeechBubble>
                            </div>
                        </section>
                        <aside className={"justify-end"}>
                            <img src={"../images/Frog2.png"}/>
                        </aside>
                    </main>
                    <Footer></Footer>
                </div>
            </>
        )
    }

    export default QuizzPreview;