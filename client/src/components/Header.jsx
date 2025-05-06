import React, { useState } from "react";
import { useAuth } from "@/pages/context/AuthContext";
import { useRouter } from "next/router";
import LanguageSelector from "@/components/LanguageSelector";
import BaseModal from "@/components/BaseModal";
import { useTranslation } from 'react-i18next';

export default function Header({ showButtons = true }) {
    const { t } = useTranslation();
    const { isLoggedIn, logOut, user } = useAuth();
    const router = useRouter();
    const [showLogOutModal, setShowLogOutModal] = useState(false);

    const handleLogOut = async () => {
        try {
            const medalsMap = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                const match = key.match(/^(.+?)_(GoldMedal|SilverMedal|BronzeMedal)$/);
                if (match) {
                    const game = match[1];
                    const medalType = match[2];
                    const isMedalAcquired = localStorage.getItem(key) === "1";
                    if (!medalsMap[game]) {
                        medalsMap[game] = {
                            quizName: game,
                            GoldMedal: false,
                            SilverMedal: false,
                            BronzeMedal: false,
                        };
                    }
                    medalsMap[game][medalType] = isMedalAcquired;
                    console.log("Medalla encontrada:", game, medalType, isMedalAcquired);
                }
            }
            const allMedals = Object.values(medalsMap);
            console.log("Medallas a enviar:", allMedals);

            const allScores = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                const match = key.match(/^(.+?)_(easy|medium|hard)_bestScore$/);
                if (match) {
                    const game = match[1];
                    const difficulty = match[2];
                    const score = parseInt(localStorage.getItem(key), 10) || 0;
                    if (!allScores[game]) allScores[game] = {};
                    allScores[game][difficulty] = score;
                }
            }

            if (user && user.userId && allMedals.length > 0) {
                const response = await fetch("http://localhost:8080/api/updateMedals", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: user.userId, medals: allMedals }),
                });
                const result = await response.json();
                console.log("Respuesta actualización de medallas:", result);
            }

            if (user && user.userId && Object.keys(allScores).length > 0) {
                console.log("Entre a actualizar los juegos");
                const response = await fetch("http://localhost:8080/api/updateBestScore", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: user.email, scores: allScores }),
                });
                const result = await response.json();
                console.log("Respuesta actualización de puntuaciones:", result);
            }

            logOut();
            router.push("/LogOut");
            setShowLogOutModal(false);
        } catch (error) {
            console.error("Error saving medals or scores before logout:", error);
            logOut();
            i18nrouter.push("/LogOut");
            setShowLogOutModal(false);
        }
    };

    const handleCancelLogOut = () => {
        setShowLogOutModal(false);
    };

    const isOnMyProfilePage = router.pathname === "/MyProfile";

    const handleLanguageChange = (langCode) => {
        console.log("Idioma seleccionado:", langCode);
    };

    return (
        <header className="flex items-center p-4 shadow-md bg-white h-[5rem]">
            <a href="..">
                <img src="/images/logo.svg" alt="Logo" className="m-4" />
            </a>
            <nav className="ml-4">
                <ul className="flex gap-6 list-none m-0 p-0 text-black items-center">
                    <li>
                        <a href="..">{t('home')}</a>
                    </li>
                    {isLoggedIn && !isOnMyProfilePage && (
                        <li>
                            <a href="/MyProfile">{t('profile')}</a>
                        </li>
                    )}
                    <li>
                        <LanguageSelector onLanguageChange={handleLanguageChange} />
                    </li>
                </ul>
            </nav>
            {showButtons && (
                <div className="ml-auto flex items-center gap-4">
                    {isLoggedIn ? (
                        <button
                            onClick={() => setShowLogOutModal(true)}
                            className="py-1 px-6 bg-white text-black rounded-lg shadow-md border-4 border-orange-300 cursor-pointer"
                        >
                            {t('logout')}
                        </button>
                    ) : (
                        <>
                            <a href="/SignUpFirstStep" className="text-black">
                                {t('signup')}
                            </a>
                            <a href="/LogIn">
                                <button className="py-1 px-6 bg-white text-black rounded-lg shadow-md border-4 border-orange-300 cursor-pointer">
                                    {t('login')}
                                </button>
                            </a>
                        </>
                    )}
                </div>
            )}

            {showLogOutModal && (
                <BaseModal
                    title={t('logoutModalTitle')}
                    description={t('logoutModalDescription')}
                    buttons={[
                        { text: t('yes'), color: "red", onClick: handleLogOut },
                        { text: t('no'), color: "gray", onClick: handleCancelLogOut },
                    ]}
                />
            )}
        </header>
    );
}