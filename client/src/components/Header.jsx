import { useState } from "react";

const Header = () => {
    const [mode, setMode] = useState("guest");

    const renderButtons = () => {
        switch (mode) {
            case "guest":
                return (
                    <>
                        <a href="...">Sign Up</a>
                        <a href="...">
                            <button className="font-bold py-2 px-6 bg-white rounded shadow-md border-4 border-orange-300 cursor-pointer">Log In</button>
                        </a>
                    </>
                );
            case "loggedIn":
                return (
                    <a href="...">
                        <button className="font-bold py-2 px-6 bg-white rounded shadow-md border-4 border-orange-300 cursor-pointer">Log Out</button>
                    </a>
                );
            case "about-to":
                return (
                    <>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <header className="flex items-center p-4 shadow-md">
            <a href="...">
                <img src="/images/logo.svg" alt="Logo" className="m-4" />
            </a>
            <nav className="ml-4">
                <ul className="flex gap-6 list-none m-0 p-0">
                    <li><a href="...">Home</a></li>
                </ul>
            </nav>
            <div className="ml-auto flex items-center gap-4">
                {renderButtons()}
            </div>
            <button onClick={() => setMode(mode === "guest" ? "loggedIn" : mode === "loggedIn" ? "about-to" : "guest")} className="ml-4 bg-gray-300 px-3 py-1 rounded">Switch Mode</button>
        </header>
    );
};

export default Header;
