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

    const getNext = () => {
        return (currentIndex + 1) % carouselData.length;
    }

    const getPrevious = () => {
        return (currentIndex === 0) ? carouselData.length - 1 : Math.abs(currentIndex - 1) % carouselData.length;
    }

    const nextSlide = () => {
        setCurrentIndex(getNext());
    }

    const prevSlide = () => {
        setCurrentIndex(getPrevious());
    }

    const handleGameClick = (game) => {
        if (!isLoggedIn && (game !== carouselData[0].game || difficulty !== "easy")) {
            alert("You must be logged in to play this game");
            router.push("/LogIn");
        } else {
            router.push({pathname: "/QuizzPreview", query: {Subject: subject, Game: game, Age: difficulty}});
        }
    };

    return (
        <div className={"flex justify-center relative w-full"}>
            <svg fill="#000000" height="2rem" width="3rem" version="1.1" xmlns="http://www.w3.org/2000/svg"
                 viewBox="0 0 24 24" className={"cursor-pointer absolute left-4 top-1/2 transform -translate-y-1/2"}
                onClick={prevSlide}>
                <g><polygon points="17.2,23.7 5.4,12 17.2,0.3 18.5,1.7 8.4,12 18.5,22.3"/></g>
            </svg>

            <svg fill="#000000" height="2rem" width="3rem" version="1.1" xmlns="http://www.w3.org/2000/svg"
                 viewBox="0 0 24 24" className={"cursor-pointer absolute right-4 top-1/2 transform -translate-y-1/2"}
                onClick={nextSlide}>
	            <g><polygon points="6.8,23.7 5.4,22.3 15.7,12 5.4,1.7 6.8,0.3 18.5,12"/></g>
            </svg>

            <div className={"flex justify-between w-[80%]"}>
                <div className={"flex"}>
                    {carouselData.slice(getPrevious(), getPrevious()+1).map(() => (
                        <div className={""}>
                            <button onClick={() => handleGameClick(game)}>
                                <GameSelectionButton
                                    Game={carouselData[getPrevious()].game}
                                    Subject={subject}
                                    BackgroundColor={backgroundColor}
                                    BorderColor={borderColor}
                                />
                            </button>
                        </div>
                    ))}
                </div>
                <div className={"flex pt-[4rem] h-[37rem]"}>
                    {carouselData.slice(currentIndex, currentIndex+1).map(() => (
                        <div className={""}>
                            <button onClick={() => handleGameClick(game)}>
                                <GameSelectionButton
                                    Game={carouselData[currentIndex].game}
                                    Subject={subject}
                                    BackgroundColor={backgroundColor}
                                    BorderColor={borderColor}
                                />
                            </button>
                        </div>
                    ))}
                </div>
                <div>
                    {carouselData.slice(getNext(), getNext()+1).map(() => (
                        <div className={""}>
                            <button onClick={() => handleGameClick(game)}>
                                <GameSelectionButton
                                    Game={carouselData[getNext()].game}
                                    Subject={subject}
                                    BackgroundColor={backgroundColor}
                                    BorderColor={borderColor}
                                />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Carousel;