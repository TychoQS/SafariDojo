import React from "react";
import { useAuth } from "@/pages/context/AuthContext";
import { useRouter } from "next/router";

export default function Header({ showButtons = true }) {
    const { isLoggedIn, logOut, user } = useAuth();
    const router = useRouter();

    const handleLogOut = () => {
        logOut();
        router.push("/LogOut");
    };

    const renderButtons = () => {
        if (!showButtons) {
            return null;
        }

        const isOnMyProfilePage = router.pathname === "/MyProfile";

        if (isLoggedIn) {
            return (
                <>
                    {!isOnMyProfilePage && (
                        <a href="/MyProfile" className="text-black">
                            <button
                                className="py-1 px-6 bg-white text-black rounded-lg shadow-md border-4 border-orange-300 cursor-pointer">
                                My Profile
                            </button>
                        </a>
                    )}
                    <button
                        onClick={handleLogOut}
                        className="py-1 px-6 bg-white text-black rounded-lg shadow-md border-4 border-orange-300 cursor-pointer">
                        Log Out
                    </button>
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
                <img src="/images/logo.svg" alt="Logo" className="m-4"/>
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