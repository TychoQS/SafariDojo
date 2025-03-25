import React from "react";
import {mavenPro} from "@/styles/fonts";

const FilterBar = ({ onFilterChange }) => {
    return (
        <select
            onChange={(e) => onFilterChange(e.target.value)}
            className={`w-5px h-5px px-4 border-2 border-[#372E55] text-[#372E55] rounded-lg 
                shadow-md focus:outline-none bg-white ${mavenPro.className}`}
                >
            <option value="">Filter</option>
            <option value="subject">By subject</option>
            <option value="medal">By type of medal</option>
            <option value="completed">Completed</option>
        </select>
    );
};

export default FilterBar;
