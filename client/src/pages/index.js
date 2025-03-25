import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CircleLayout from "@/components/AnimalCircleLayout";
import PopularGameCard from "@/components/PopularGameCard";
import SearchBar from "@/components/SearchBar";
import FilterBar from "@/components/FilterBar";

function Index() {
    const [filters, setFilters] = useState({
        filterBy: "",
    });
    const [searchTerm, setSearchTerm] = useState("");

    const games = [
        { gameSubject: "English", isCompleted: true, medalType: "gold" },
        { gameSubject: "Maths", isCompleted: false, medalType: "bronze" },
        { gameSubject: "Science", isCompleted: false, medalType: "silver" },
        { gameSubject: "Art", isCompleted: true, medalType: "silver" },
        { gameSubject: "Art", isCompleted: false, medalType: "bronze" },
    ];

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const handleFilterChange = (value) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            filterBy: value,
        }));
    };

    const filterAndGroupGames = (games) => {
        let filteredGames = [...games];
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
                const medalOrder = { gold: 1, silver: 2, bronze: 3 };
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

    const filteredGames = filterAndGroupGames(games);

    return (
        <>
            <div className="app min-h-screen flex flex-col bg-PS-main-purple">
                <Header mode="guest" />
                <section className="flex-grow flex flex-col relative mt-5 justify-center items-center align-middle">
                    <CircleLayout />
                    <section className="w-full flex-grow flex flex-col relative mt-5 justify-center items-center bg-[#FFDEB6] p-4 gap-6">
                        <div className="flex justify-center items-center gap-4 w-full">
                            <SearchBar placeholder="Buscar..." onSearch={handleSearch} />
                            <FilterBar onFilterChange={handleFilterChange} />
                        </div>

                        {filteredGames.map((game, index) => (
                            <PopularGameCard
                                key={index}
                                gameSubject={game.gameSubject}
                                isCompleted={game.isCompleted}
                                medalType={game.medalType}
                            />
                        ))}
                    </section>
                </section>
                <Footer />
            </div>
        </>
    );
}

export default Index;
