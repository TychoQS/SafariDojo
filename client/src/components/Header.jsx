/*
======================== USAGE ====================
        <Header/>
        <Header showButtons={false} />  // If you dont want any button
*/

import React from "react";
import { useAuth } from "@/pages/context/AuthContext";

export default function Header({ showButtons = true }) {
    const { isLoggedIn } = useAuth();

    const renderButtons = () => {
        if (!showButtons) {
            return null;
        }

        if (isLoggedIn) {
            return (
                <>
                    <a href="/MyProfile" className="text-black">
                        <button
                            className="py-1 px-6 bg-white text-black rounded-lg shadow-md border-4 border-orange-300 cursor-pointer">
                            My Profile
                        </button>
                    </a>
                    <a href="/LogOut">
                        <button
                            className="py-1 px-6 bg-white text-black rounded-lg shadow-md border-4 border-orange-300 cursor-pointer">
                            Log Out
                        </button>
                    </a>
                </>
            );
        } else {
            return (
                <>
                    <a href="/SignUpFirstStep" className="text-black">Sign Up</a>
                    <a href="/LogIn">
                        <button
                            className="py-1 px-6 bg-white text-black rounded-lg shadow-md border-4 border-orange-300 cursor-pointer">
                            Log In
                        </button>
                    </a>
                </>
            );
        }
    };

    return (
        <header className="flex items-center p-4 shadow-md bg-white h-[5rem]">
            <a href="..">
                <img src="/images/logo.svg" alt="Logo" className="m-4" />
            </a>
            <nav className="ml-4">
                <ul className="flex gap-6 list-none m-0 p-0 text-black">
                    <li>
                        <a href="..">Home</a>
                    </li>
                </ul>
            </nav>
            <div className="ml-auto flex items-center gap-4">
                {renderButtons()}
            </div>
        </header>
    );
}