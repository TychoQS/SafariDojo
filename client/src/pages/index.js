import React, {useEffect, useState} from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CircleLayout from "@/components/AnimalCircleLayout";
import PopularGameCard from "@/components/PopularGameCard";
import SearchBar from "@/components/SearchBar";
import {cherryBomb} from '@/styles/fonts';

function Index() {
    const [searchTerm, setSearchTerm] = useState("");
    const [popularGames, setPopularGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPopularGames = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:8080/api/popularGames');
                console.log(response);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();

                const formattedGames = data.popularGames.map(game => {
                    return {
                        gameSubject: game.Name,
                        gameNumber: game.QuizId,
                        isCompleted: false,
                    };
                });

                setPopularGames(formattedGames);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching popular games:", err);
                setError("Failed to load popular games. Please try again later.");
                setLoading(false);
            }
        };

        fetchPopularGames();
    }, []);

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const filteredGames = popularGames.filter(game =>
        searchTerm ? game.gameSubject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            game.gameName.toLowerCase().includes(searchTerm.toLowerCase())
            : true
    );

    return (
        <div className="app min-h-screen flex flex-col bg-PS-main-purple">
            <Header/>
            <section className="flex-grow flex flex-col mt-5 justify-center items-center align-middle">
                <div className={`text-PS-dark-yellow text-5xl font-bold py-1 px-4 
                                items-center flex justify-center ${cherryBomb.className}`}
                >
                    Choose any Master!
                </div>
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
                    </div>

                    {loading ? (
                        <div className="text-PS-dark-yellow font-bold text-xl">
                            Loading popular games...
                        </div>
                    ) : error ? (
                        <div className="text-red-500 font-bold text-xl">
                            {error}
                        </div>
                    ) : filteredGames.length === 0 ? (
                        <div className="text-PS-dark-yellow font-bold text-xl">
                            No games found. Try adjusting your search.
                        </div>
                    ) : (
                        filteredGames.map((game, index) => (
                            <PopularGameCard
                                key={index}
                                gameSubject={game.gameSubject}
                                gameNumber={game.gameNumber}
                                isCompleted={game.isCompleted}
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