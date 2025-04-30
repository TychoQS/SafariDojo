import {useState, useRef} from "react";
import GameSelectionButton from "@/components/GameSelectorButton";
import {router} from "next/client";
import {useAuth} from "@/pages/context/AuthContext";
import GameModal from "@/components/GameModal";
import SoonModal from "@/components/SoonModal";

const Carousel = ({carouselData, difficulty}) => {
    const {isLoggedIn, user} = useAuth();
    const [currentIndex, setCurrentIndex] = useState(0);
    const startX = useRef(0);
    const isDragging = useRef(false);
    const [showModal, setShowModal] = useState(false);
    const [showModalSoon, setShowModalSoon] = useState(false);
    const [navigateData, setNavigateData] = useState(null);


    const getIndex = (index) => {
        return (index + carouselData.length) % carouselData.length;
    };

    const getNext = () => getIndex(currentIndex + 1);
    const getPrevious = () => getIndex(currentIndex - 1);

    const nextSlide = () => {
        setCurrentIndex(getNext());
    };

    const prevSlide = () => {
        setCurrentIndex(getPrevious());
    };

    const handleGameClick = (game) => {
        if (game === "Comming soon..."){
            setShowModalSoon(true);
            return;
        }
        const subject = carouselData[currentIndex].subject;

        const destination = {
            pathname: "/QuizzPreview",
            query: {
                Subject: subject,
                Game: game,
                Age: difficulty,
            },
        };

        if (!isLoggedIn && (game !== carouselData[0].game || difficulty !== "easy")) {
            setNavigateData(destination);
            setShowModal(true);
            return;
        }

        if (isLoggedIn && !user.isPremium && (game === carouselData[1].game)) {
            setNavigateData(destination);
            setShowModal(true);
            return;
        }

        router.push({
            pathname: "/QuizzPreview",
            query: {
                Subject: subject,
                Game: game,
                Age: difficulty,
            },
        }).then();
    };

    const handleMouseDown = (e) => {
        startX.current = e.clientX;
        isDragging.current = true;
    };

    const handleMouseUp = (e) => {
        if (!isDragging.current) return;
        const deltaX = e.clientX - startX.current;

        if (deltaX > 50) {
            prevSlide();
        } else if (deltaX < -50) {
            nextSlide();
        }

        isDragging.current = false;
    };

    const handleMouseLeave = () => {
        isDragging.current = false;
    };

    const currentGame = carouselData[currentIndex].game;
    const previousGame = carouselData[getPrevious()].game;
    const nextGame = carouselData[getNext()].game;

    return (
        <div
            className={"flex justify-center relative w-full"}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
        >
            <svg fill="#000000" height="2rem" width="3rem" version="1.1" xmlns="http://www.w3.org/2000/svg"
                 viewBox="0 0 24 24" className={"cursor-pointer absolute left-4 top-1/2 transform -translate-y-1/2"}
                 onClick={prevSlide}>
                <g>
                    <polygon points="17.2,23.7 5.4,12 17.2,0.3 18.5,1.7 8.4,12 18.5,22.3"/>
                </g>
            </svg>

            <svg fill="#000000" height="2rem" width="3rem" version="1.1" xmlns="http://www.w3.org/2000/svg"
                 viewBox="0 0 24 24" className={"cursor-pointer absolute right-4 top-1/2 transform -translate-y-1/2"}
                 onClick={nextSlide}>
                <g>
                    <polygon points="6.8,23.7 5.4,22.3 15.7,12 5.4,1.7 6.8,0.3 18.5,12"/>
                </g>
            </svg>

            <div className={"flex justify-between w-[80%]"}>
                <div className={"flex"}>
                    <div>
                        <button onClick={() => handleGameClick(previousGame)}>
                            <GameSelectionButton
                                Game={previousGame}
                                Subject={carouselData[getPrevious()].subject}
                                BackgroundColor={carouselData[getPrevious()].backgroundColor}
                                BorderColor={carouselData[getPrevious()].borderColor}
                                isMiddle={false}
                            />
                        </button>
                    </div>
                </div>
                <div className={"flex pt-[4rem] h-[37rem]"}>
                    <div>
                        <button onClick={() => handleGameClick(currentGame)}>
                            <GameSelectionButton
                                Game={currentGame}
                                Subject={carouselData[currentIndex].subject}
                                BackgroundColor={carouselData[currentIndex].backgroundColor}
                                BorderColor={carouselData[currentIndex].borderColor}
                                isMiddle={true}
                            />
                        </button>
                    </div>
                </div>
                <div>
                    <div>
                        <button onClick={() => handleGameClick(nextGame)}>
                            <GameSelectionButton
                                Game={nextGame}
                                Subject={carouselData[getNext()].subject}
                                BackgroundColor={carouselData[getNext()].backgroundColor}
                                BorderColor={carouselData[getNext()].borderColor}
                                isMiddle={false}
                            />
                        </button>
                    </div>
                </div>
            </div>
            {showModal && navigateData && !isLoggedIn && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/20">
                    <GameModal
                        mode="registrado"
                        navigateTo={navigateData}
                        onClose={() => setShowModal(false)}
                    />
                </div>
            )}

            {showModal && navigateData && isLoggedIn && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/20">
                    <GameModal
                        mode="premium"
                        navigateTo={navigateData}
                        onClose={() => setShowModal(false)}
                    />
                </div>
            )}

            {showModalSoon && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/20">
                    <SoonModal
                        onClose={() => setShowModalSoon(false)}
                    />
                </div>
            )}
        </div>
    );
};

export default Carousel;
