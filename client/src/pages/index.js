import React, {useState, useEffect} from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CircleLayout from "@/components/AnimalCircleLayout";
import PopularGameCard from "@/components/PopularGameCard";
import SearchBar from "@/components/SearchBar";
import FilterBar from "@/components/FilterBar";
import gamesData from "../../../database/jsondata/Games.json";
import {cherryBomb} from '@/styles/fonts';

function Index() {
    const [filters, setFilters] = useState({filterBy: ""});
    const [searchTerm, setSearchTerm] = useState("");
    const [shuffledGames, setShuffledGames] = useState([]);

    const extractGames = (data) => {
        let gamesArray = [];
        Object.keys(data).forEach(subject => {
            data[subject].forEach((game, index) => {
                gamesArray.push({
                    gameSubject: subject.charAt(0).toUpperCase() + subject.slice(1),
                    gameNumber: index + 1,
                    gameName: game.gameName,
                    gameDescription: game.gameDescription,
                    medalType: ["gold", "silver", "bronze"][Math.floor(Math.random() * 3)],
                    isCompleted: JSON.parse(localStorage.getItem(`${subject}-${index + 1}-isCompleted`)) || false,
                });
            });
        });
        return gamesArray;
    };

    const shuffleArray = (array) => {
        let shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    useEffect(() => {
        const extractedGames = extractGames(gamesData);
        setShuffledGames(shuffleArray(extractedGames).slice(0, 5));
    }, []);

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const handleFilterChange = (value) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            filterBy: value,
        }));
    };

    const filterAndSortGames = (gamesList) => {
        let filteredGames = [...gamesList];

        if (searchTerm) {
            filteredGames = filteredGames.filter((game) =>
                game.gameSubject.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        switch (filters.filterBy) {
            case "subject":
                filteredGames.sort((a, b) => a.gameSubject.localeCompare(b.gameSubject));
                break;
            case "medal":
                const medalOrder = {gold: 1, silver: 2, bronze: 3};
                filteredGames.sort((a, b) => medalOrder[a.medalType] - medalOrder[b.medalType]);
                break;
            case "completed":
                filteredGames.sort((a, b) => (a.isCompleted === b.isCompleted ? 0 : a.isCompleted ? -1 : 1));
                break;
            default:
                break;
        }

        return filteredGames;
    };

    const filteredGames = filterAndSortGames(shuffledGames);

    return (
        <div className="app min-h-screen flex flex-col bg-PS-main-purple">
            <Header/>
            <section className="flex-grow flex flex-col mt-5 justify-center items-center align-middle">
                <CircleLayout/>
                <section
                    className="w-full flex-grow flex flex-col relative mt-5 items-center bg-PS-light-yellow p-4 gap-6">
                    <div className="w-full flex flex-col items-center mt-[-10px] mb-[20px]">
                        <div
                            className={`absolute top-0 left-1/2 transform -translate-x-1/2 translate-y-[-50%]
                            border-3 border-PS-light-black bg-PS-dark-yellow 
                            text-PS-light-black text-5xl font-bold py-2 px-4 rounded-lg shadow-md w-200 
                            items-center flex justify-center ${cherryBomb.className}`}
                        >
                            Most Popular Games
                        </div>
                    </div>
                    <div className="flex justify-center items-center gap-4 w-full">
                        <SearchBar placeholder="Search..." onSearch={handleSearch}/>
                        <FilterBar onFilterChange={handleFilterChange}/>
                    </div>

                    {filteredGames.length === 0 ? (
                        <div className="text-PS-dark-yellow font-bold text-xl">
                            No games found. Try adjusting the filters.
                        </div>
                    ) : (
                        filteredGames.map((game, index) => (
                            <PopularGameCard
                                key={index}
                                gameSubject={game.gameSubject}
                                gameNumber={game.gameNumber}
                                isCompleted={game.isCompleted}
                                medalType={game.medalType}
                            />
                        ))
                    )}
                </section>
            </section>
            <Footer/>
        </div>
    );
}

export default Index;
