import Header from "@/components/Header";
import Lifes from "@/components/Lifes";
import GameSelectionButton from '@/components/GameSelectorButton';
import AgeSelectorButton from "@/components/AgeSelectorButton";
import Footer from "@/components/Footer";

function GameSelectionPage() {

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
                    Subject={"Art"}>
                </GameSelectionButton>

                <GameSelectionButton
                    Game={"Make the film"}
                    Subject={"Art"}>
                </GameSelectionButton>
            </div>

                <div className={"flex flex-row justify-center mt-[-5%]"}>
                    <img className={"h-46 w-35"} src={"../images/platypus3.png"} alt={"platypus"}></img>
                </div>

            <div className={"flex flex-row justify-evenly mb-8"}>
                <AgeSelectorButton
                    Age={"6 - 7 years"}
                    Subject={"Art"}>
                </AgeSelectorButton>

                <AgeSelectorButton
                    Age={"8 - 9 years"}
                    Subject={"Art"}>
                </AgeSelectorButton>

                <AgeSelectorButton
                    Age={"10 - 11 years"}
                    Subject={"Art"}>
                </AgeSelectorButton>
                </div>
                <Footer/>
            </div>
        </>
    )
}

export default GameSelectionPage;