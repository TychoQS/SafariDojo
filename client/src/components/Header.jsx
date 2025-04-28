import React from "react";
import {useAuth} from "@/pages/context/AuthContext";
import {useRouter} from "next/router";
import LanguageSelector from "@/components/LanguajeSelector";

export default function Header({showButtons = true}) {
    const {isLoggedIn, logOut, user} = useAuth();
    const router = useRouter();

    const handleLogOut = () => {
        logOut();
        router.push("/LogOut");
    };

    const isOnMyProfilePage = router.pathname === "/MyProfile";

    const handleLanguageChange = (langCode) => {
        console.log("Idioma seleccionado:", langCode);
    };

    return (
        <header className="flex items-center p-4 shadow-md bg-white h-[5rem]">
            <a href="..">
                <img src="/images/logo.svg" alt="Logo" className="m-4"/>
            </a>
            <nav className="ml-4">
                <ul className="flex gap-6 list-none m-0 p-0 text-black items-center">
                    <li>
                        <a href="..">Home</a>
                    </li>
                    {isLoggedIn && !isOnMyProfilePage && (
                        <li>
                            <a href="/MyProfile">Profile</a>
                        </li>
                    )}
                    <li>
                        <LanguageSelector onLanguageChange={handleLanguageChange}/>
                    </li>
                </ul>
            </nav>
            {showButtons && (
                <div className="ml-auto flex items-center gap-4">
                    {isLoggedIn ? (
                        <button
                            onClick={handleLogOut}
                            className="py-1 px-6 bg-white text-black rounded-lg shadow-md border-4 border-orange-300 cursor-pointer">
                            Log Out
                        </button>
                    ) : (
                        <>
                            <a href="/SignUpFirstStep" className="text-black">Sign Up</a>
                            <a href="/LogIn">
                                <button
                                    className="py-1 px-6 bg-white text-black rounded-lg shadow-md border-4 border-orange-300 cursor-pointer">
                                    Log In
                                </button>
                            </a>
                        </>
                    )}
                </div>
            )}
        </header>
    );
}