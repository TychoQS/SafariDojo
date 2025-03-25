import React, { useState } from "react";
import { mavenPro } from "@/styles/fonts";

export default function SearchBar({ placeholder, onSearch }) {
    const [searchTerm, setSearchTerm] = useState("");

    const handleChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearch = () => {
        onSearch(searchTerm);
    };

    return (
        <div className="relative w-full max-w-sm mx-auto">
            <input
                type="text"
                value={searchTerm}
                onChange={handleChange}
                placeholder={placeholder}
                className={`w-full h-1.5 px-4 border-2 border-[#372E55] text-[#372E55] rounded-lg 
                shadow-md focus:outline-none bg-white ${mavenPro.className}`}
            />
            <button
                onClick={handleSearch}
                className="absolute top-1/2 right-2 transform -translate-y-1/2 p-2 text-white bg-[#372E55] rounded-lg focus:outline-none"
            >
                🔍
            </button>
        </div>
    );
}
