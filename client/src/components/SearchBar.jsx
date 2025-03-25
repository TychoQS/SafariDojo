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
        <div className="relative w-full max-w-sm">
            <input
                type="text"
                value={searchTerm}
                onChange={handleChange}
                placeholder={placeholder}
                className={`w-full h-5px px-4 border-2 border-PS-light-black text-PS-light-black rounded-lg 
                shadow-md focus:outline-none bg-white ${mavenPro.className}`}
            />
            <button
                onClick={handleSearch}
                className="absolute top-1/2 right-2 transform -translate-y-1/2 p-2 text-white rounded-lg focus:outline-none"
            >
                🔍
            </button>
        </div>
    );
}
