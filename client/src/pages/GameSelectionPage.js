import Header from "@/components/Header";
import Lifes from "@/components/Lifes";
import GameSelectionButton from '@/components/GameSelectorButton';
import animals from "../../../database/jsondata/Subject.json";
import AgeSelectorButton from "@/components/AgeSelectorButton";
import Footer from "@/components/Footer";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {useAuth} from "@/pages/context/AuthContext";

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

    return (
        <>
            <div className={"app min-h-screen flex flex-col bg-PS-main-purple"}>
                <Header/>
                <div className="flex items-end justify-end">
                    <Lifes />
                </div>
                <div className={"flex flex-row justify-evenly"}>
                <GameSelectionButton
                    Game={"Detective Lupin"}
                    Subject={subject}
                    BackgroundColor={backgroundColor}
                    BorderColor={borderColor}>
                </GameSelectionButton>

                <GameSelectionButton
                    Game={"Make the film"}
                    Subject={subject}
                    BackgroundColor={backgroundColor}
                    BorderColor={borderColor}>
                </GameSelectionButton>
            </div>

                <div className={"flex flex-row justify-center mt-[-5%]"}>
                    <img className={"h-46 w-35"} src={selectGameIcon} alt={"platypus"}></img>
                </div>

            <div className={"flex flex-row justify-evenly mb-8"}>
                <AgeSelectorButton
                    Age={"6 - 7 years"}
                    BackgroundColor={backgroundColor}
                    BorderColor={borderColor}>
                </AgeSelectorButton>

                <AgeSelectorButton
                    Age={"8 - 9 years"}
                    BackgroundColor={backgroundColor}
                    BorderColor={borderColor}>
                </AgeSelectorButton>

                <AgeSelectorButton
                    Age={"10 - 11 years"}
                    BackgroundColor={backgroundColor}
                    BorderColor={borderColor}>
                </AgeSelectorButton>
                </div>
                <Footer/>
            </div>
        </>
    )
}

export default GameSelectionPage;