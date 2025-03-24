/*
======================== USAGE ====================
        <Header/>
        <Header mode="guest" />   // Shows "Sign Up" and "Log In" buttons
        <Header mode="loggedIn" /> // Shows "Log Out" button
*/

import React from "react";

export default function Header({mode}) {
    const renderButtons = () => {
        switch (mode) {
            case "guest":
                return (
                    <>
                        <a href="..." className="text-black">Sign Up</a>
                        <a href="...">
                            <button
                                className="py-1 px-6 bg-white text-black rounded-lg shadow-md border-4 border-orange-300 cursor-pointer">
                                Log In
                            </button>
                        </a>
                    </>
                );
            case "loggedIn":
                return (
                    <a href="...">
                        <button
                            className="py-1 px-6 bg-white text-black rounded-lg shadow-md border-4 border-orange-300 cursor-pointer">
                            Log Out
                        </button>
                    </a>
                );
            default:
                return null;
        }
    };

    return (
        <header className="flex items-center p-4 shadow-md bg-white h-[5rem]">
            <a href="...">
                <img src="/images/logo.svg" alt="Logo" className="m-4"/>
            </a>
            <nav className="ml-4">
                <ul className="flex gap-6 list-none m-0 p-0 text-black">
                    <li>
                        <a href="...">Home</a>
                    </li>
                </ul>
            </nav>
            <div className="ml-auto flex items-center gap-4">{renderButtons()}</div>
        </header>
    );
};