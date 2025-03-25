import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CircleLayout from "@/components/AnimalCircleLayout";
import PopularGameCard from "@/components/PopularGameCard";
import SearchBar from "@/components/SearchBar";

function Index() {
    const [searchResult, setSearchResult] = useState("");

    const handleSearch = (term) => {
        setSearchResult(`Resultados para: ${term}`);
    };

    return (
        <>
            <div className="app min-h-screen flex flex-col bg-PS-main-purple">
                <Header mode="guest"/>
                <section className="flex-grow flex flex-col relative mt-5 justify-center items-center align-middle">
                    <CircleLayout />
                    <section className="w-full flex-grow flex flex-col relative mt-5 justify-center items-center bg-[#FFDEB6] gap-6">
                        <SearchBar placeholder="Search..." onSearch={handleSearch} />

                        {searchResult && <p className="mt-4 text-lg">{searchResult}</p>}

                        <PopularGameCard gameSubject="English" isCompleted={true} medalType="gold" />
                        <PopularGameCard gameSubject="Maths" isCompleted={false} medalType="bronze" />
                        <PopularGameCard gameSubject="Science" isCompleted={false} medalType="silver" />
                    </section>
                </section>
                <Footer />
            </div>
        </>
    );
}

export default Index;
