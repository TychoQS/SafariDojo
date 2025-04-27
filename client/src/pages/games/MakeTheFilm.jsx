import React, {useState, useEffect, useRef} from 'react';
import { Trophy, RefreshCcw } from 'lucide-react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Lifes from "@/components/Lifes";
import Title from "@/components/Title";
import Link from "next/link";
import Button from "@/components/Button";

// Story data
const stories = [ // TODO DB
    {
        id: 1,
        title: "Little Red Riding Hood",
        pieces: [
            { id: 1, text: "Once upon a time, there was a little girl who went to visit her grandmother.", color: "bg-red-200" },
            { id: 2, text: "On her way, she met a wicked wolf.", color: "bg-gray-200" },
            { id: 3, text: "The wolf arrived at grandmother's house before her.", color: "bg-purple-200" },
            { id: 4, text: "A hunter rescued Little Red Riding Hood and her grandmother.", color: "bg-green-200" }
        ]
    },
    {
        id: 2,
        title: "The Three Little Pigs",
        pieces: [
            { id: 1, text: "Three little pigs decided to build their own houses.", color: "bg-pink-200" },
            { id: 2, text: "The first pig built a house of straw.", color: "bg-yellow-200" },
            { id: 3, text: "The second pig built a house of sticks.", color: "bg-orange-200" },
            { id: 4, text: "The third pig built a house of bricks that withstood the wolf.", color: "bg-red-200" },
            { id: 5, text: "The Three Pigs eat cakes", color: "bg-orange-200" }
        ]
    },
    {
        id: 3,
        title: "Hansel and Gretel",
        pieces: [
            { id: 1, text: "Two siblings were abandoned in the forest by their parents.", color: "bg-blue-200" },
            { id: 2, text: "They found a house made of candy.", color: "bg-pink-200" },
            { id: 3, text: "The witch locked Hansel in a cage to eat him.", color: "bg-purple-200" },
            { id: 4, text: "Gretel pushed the witch into the oven and they escaped with her treasures.", color: "bg-yellow-200" }
        ]
    }
];

const fromSubject = "Art";
const MakeTheFilm = () => {
    const [score, setScore] = useState(0);
    const [currentLevel, setCurrentLevel] = useState(0);
    const lifesRef = useRef(null);

    return (
        <>
            <div id={""} className={"app flex flex-col h-screen bg-PS-main-purple"}>
                <Header></Header>
                <section id={"lives-section"} className={"flex flex-row items-center justify-between"}>
                    <Link href={{pathname: "../GameSelectionPage", query: {Subject: fromSubject}}}>
                        <div className="mb-2 mt-2">
                            <Button size="small">Back</Button>
                        </div>
                    </Link>
                    <div className="">
                        <Lifes ref={lifesRef}/>
                    </div>
                </section>
                <main className="flex flex-col flex-1 items-center justify-start bg-PS-main-purple">
                    <section id={"title-section"} className="w-full max-w-4xl rounded-lg">
                        <div className="flex justify-center">
                            <Title>Make The Film</Title>
                        </div>
                    </section>
                    <section id={"scoreboard"} className={"pb-4"}>
                        <div className="flex items-center space-x-6">
                            <div className="bg-PS-light-yellow border-PS-dark-yellow border-1 text-PS-art-color px-3 py-1 rounded-full font-bold text-2xl">
                                Score: {score}/30
                            </div>
                            <div className="bg-PS-light-yellow border-PS-dark-yellow border-1 text-PS-art-color px-3 py-1 rounded-full font-bold text-2xl">
                                Level: {currentLevel + 1}/{stories.length}
                            </div>
                        </div>
                    </section>
                </main>
                <Footer></Footer>
            </div>
        </>
    );
};

export default MakeTheFilm;