import {useState} from "react";
import GameSelectionButton from "@/components/GameSelectorButton";
import {router} from "next/client";
import {useAuth} from "@/pages/context/AuthContext";

const Carousel = ({ carouselData, difficulty}) => {
    const {isLoggedIn} = useAuth();
    const [currentIndex, setCurrentIndex] = useState(0);

    const subject = carouselData[currentIndex].subject;
    const game = carouselData[currentIndex].game;
    const backgroundColor = carouselData[currentIndex].backgroundColor;
    const borderColor = carouselData[currentIndex].borderColor;

    const nextSlide = () => {
        setCurrentIndex((currentIndex + 1) % carouselData.length);
    }

    const prevSlide = () => {
        setCurrentIndex(Math.abs(currentIndex - 1) % carouselData.length);
        if (currentIndex === 0) setCurrentIndex(carouselData.length - 1);
    }

    const handleGameClick = (game) => {
        if (!isLoggedIn && (game !== carouselData[0].game || difficulty !== "easy")) {
            alert("You must be logged in to play this game");
            router.push("/LogIn");
        } else {
            router.push({pathname: "/QuizzPreview", query: {subject: subject, Game: game, Age: difficulty}});
        }
    };

    return (
        <div className={"flex justify-center relative bg-green-500 w-[90%]"}>
            <button
                onClick={prevSlide}
                className="cursor-pointer absolute left-4 top-1/2 transform -translate-y-1/2 text-black text-4xl font-bold"
            >&lt;</button>
            <button
                onClick={nextSlide}
                className="cursor-pointer absolute right-4 top-1/2 transform -translate-y-1/2 text-black text-4xl font-bold"
            >&gt;</button>
            <div className={"flex"}>

            {carouselData.slice(currentIndex, currentIndex+1).map(() => (
                    <div className={""}>
                        <button onClick={() => handleGameClick(game)}>
                            <GameSelectionButton
                                Game={game}
                                Subject={subject}
                                BackgroundColor={backgroundColor}
                                BorderColor={borderColor}
                            />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Carousel;