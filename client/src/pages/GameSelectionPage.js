import Header from "@/components/Header";
import Lifes from "@/components/Lifes";
import GameSelectionButton from '@/components/GameSelectorButton';
import animals from "../../../database/jsondata/Subject.json";
import AgeSelectorButton from "@/components/AgeSelectorButton";
import Footer from "@/components/Footer";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {useAuth} from "@/pages/context/AuthContext";
import Link from "next/link";

function GameSelectionPage() {
    const {isLoggedIn} = useAuth();
    const router = useRouter()
    const [subject, setSubject] = useState(null)
    const [subjectData, setSubjectData] = useState(null)

    useEffect(() => {
        if (router.isReady) {
            const querySubject = router.query.Subject
            setSubject(querySubject)
        }
    }, [router.isReady, router.query])

    useEffect(() => {
        if (subject) {
            const foundSubjectData = animals.find(item => item.subjectName === subject);
            if (foundSubjectData) {
                setSubjectData(foundSubjectData)
            }
        }
    }, [subject])

    const selectGameIcon = subjectData?.selectGameIcon
    const backgroundColor = subjectData?.backgroundColor
    const borderColor = subjectData?.borderColor
    const firstGame = subjectData?.firstGame
    const secondGame = subjectData?.secondGame

    const [SelectedButton, setSelectedButton] = useState(0)

    const Click = (Index) => {
        setSelectedButton(Index);
    }



    return (
            <div className={"app min-h-screen flex flex-col bg-PS-main-purple"}>
                <Header/>
                <div className="flex items-end justify-end">
                    <Lifes />
                </div>
                <div className={"flex flex-row justify-evenly"}>
                    <Link href={{pathname: "/QuizzPreview", query: {Subject: subject, Game: firstGame, Age: SelectedButton}}}>
                        <GameSelectionButton
                            Game={firstGame}
                            Subject={subject}
                            BackgroundColor={backgroundColor}
                            BorderColor={borderColor}>
                        </GameSelectionButton>
                    </Link>

                    <Link href={{pathname: "/QuizzPreview", query: {Subject: subject, Game: secondGame, Age: SelectedButton}}}>
                        <GameSelectionButton
                            Game={secondGame}
                            Subject={subject}
                            BackgroundColor={backgroundColor}
                            BorderColor={borderColor}>
                        </GameSelectionButton>
                    </Link>
            </div>

                <div className={"flex flex-row justify-center mt-[-5%]"}>
                    <img className={"h-46 w-40"} src={selectGameIcon} alt={"platypus"}></img>
                </div>

            <div className={"flex flex-row justify-evenly mb-8"}>
                <div onClick={() => Click(0)}>
                    <AgeSelectorButton
                        Age={"6 - 7 years"}
                        BackgroundColor={SelectedButton === 0 ? borderColor : backgroundColor}
                        BorderColor={SelectedButton === 0 ? backgroundColor : borderColor}>
                    </AgeSelectorButton>
                </div>

                <div onClick={() => Click(1)}>
                    <AgeSelectorButton
                        Age={"8 - 9 years"}
                        BackgroundColor={SelectedButton === 1 ? borderColor : backgroundColor}
                        BorderColor={SelectedButton === 1 ? backgroundColor : borderColor}>
                    </AgeSelectorButton>
                </div>

                <div onClick={() => Click(2)}>
                    <AgeSelectorButton
                        Age={"10 - 11 years"}
                        BackgroundColor={SelectedButton === 2 ? borderColor : backgroundColor}
                        BorderColor={SelectedButton === 2 ? backgroundColor : borderColor}>
                    </AgeSelectorButton>
                </div>
                </div>
                <Footer/>
            </div>
    )
}

export default GameSelectionPage;