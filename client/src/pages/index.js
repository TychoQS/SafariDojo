import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CircleLayout from "@/components/AnimalCircleLayout";
import PopularGameCard from "@/components/PopularGameCard";
import SearchBar from "@/components/SearchBar";
import { cherryBomb } from '@/styles/fonts';
import { useTranslation } from 'react-i18next';

function Index() {
    const { t } = useTranslation(); // Hook called at top level
    const [searchTerm, setSearchTerm] = useState("");
    const [popularGames, setPopularGames] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPopularGames = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:8080/api/popularGames');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();

                const formattedGames = data.popularGames.map(game => {
                    return {
                        gameSubject: game.Name,
                        gameNumber: game.QuizId,
                        gameName: game.QuizName,
                        isCompleted: false,
                    };
                });

                setPopularGames(formattedGames);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching popular games:", err);
                setError(t('errorLoadingGames'));
                setLoading(false);
            }
        };

        fetchPopularGames();
    }, [t]);

    const handleSearch = async (term) => {
        setSearchTerm(term);

        if (!term.trim()) {
            setSearchResults([]);
            return;
        }

        try {
            setSearching(true);
            const response = await fetch(`http://localhost:8080/api/searchGames?query=${encodeURIComponent(term)}`);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            const formattedResults = data.games.map(game => {
                return {
                    gameSubject: game.Name,
                    gameNumber: game.QuizId,
                    gameName: game.QuizName,
                    isCompleted: false,
                };
            });

            setSearchResults(formattedResults);
            setSearching(false);
        } catch (err) {
            console.error("Error searching games:", err);
            setError(t('errorSearchingGames'));
            setSearching(false);
        }
    };

    const displayGames = searchTerm ? searchResults : popularGames;

    return (
        <div className="app min-h-screen flex flex-col bg-PS-main-purple">
            <Header />
            <section className="flex-grow flex flex-col mt-5 justify-center items-center align-middle">
                <div className={`text-PS-dark-yellow text-5xl font-bold py-1 px-4 items-center flex justify-center ${cherryBomb.className}`}>
                    {t('chooseMaster')}
                </div>
                <CircleLayout />
                <section className="w-full flex-grow flex flex-col relative mt-5 items-center bg-PS-light-yellow p-4 gap-6">
                    <div className="w-full flex flex-col items-center mt-[-10px] mb-[20px]">
                        <div
                            className={`absolute top-0 left-1/2 transform -translate-x-1/2 translate-y-[-50%] border-3 border-PS-light-black bg-PS-dark-yellow text-PS-light-black text-5xl font-bold py-2 px-4 rounded-lg shadow-md w-200 items-center flex justify-center ${cherryBomb.className}`}
                        >
                            {searchTerm ? t('searchResults') : t('popularGames')}
                        </div>
                    </div>
                    <div className="flex justify-center items-center gap-4 w-full">
                        <SearchBar placeholder={t('searchPlaceholder')} onSearch={handleSearch} />
                    </div>

                    {loading || searching ? (
                        <div className="text-PS-dark-yellow font-bold text-xl">
                            {searching ? t('searchingGames') : t('loadingGames')}
                        </div>
                    ) : error ? (
                        <div className="text-red-500 font-bold text-xl">
                            {error}
                        </div>
                    ) : displayGames.length === 0 ? (
                        <div className="text-PS-dark-yellow font-bold text-xl">
                            {searchTerm ? t('noGamesFound') : t('noPopularGames')}
                        </div>
                    ) : (
                        displayGames.map((game, index) => (
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
            <Footer />
        </div>
    );
}

export default Index;