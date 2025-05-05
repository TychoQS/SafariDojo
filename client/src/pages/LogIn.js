import React, {useState} from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FormField from "@/components/FormField";
import {useRouter} from "next/router";
import {useAuth} from "@/pages/context/AuthContext";
import {useProfile} from "@/pages/context/ProfileContext";
import BaseModal from "@/components/BaseModal";


const LogIn = () => {
    const {logIn} = useAuth();
    const {updateProfile} = useProfile();
    const [showModal, setShowModal] = useState(false);

    const hashPassword = async (password) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(byte => byte.toString(16).padStart(2, "0")).join("");
    };

    const handleLogin = async (data) => {
        const UserData = {
            Email: data.UserEmail,
            Password: await hashPassword(data.PasswordLogIn),
        }

        const Response = await fetch("http://localhost:8080/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(UserData),
        });

        const ResponseData = await Response.json();
        if (Response.ok) {
            const token = `fakeTokenForUser-${Date.now()}`;
            logIn(token, ResponseData);

            const getMedalsResponse = await fetch(`http://localhost:8080/api/getUserMedals?userId=${ResponseData.userId}`);

            if (getMedalsResponse.ok) {
                const medalsData = await getMedalsResponse.json();

                medalsData.forEach((quiz) => {
                    const {quizName, GoldMedal, SilverMedal, BronzeMedal} = quiz;
                    localStorage.setItem(`${quizName}_GoldMedal`, GoldMedal);
                    localStorage.setItem(`${quizName}_SilverMedal`, SilverMedal);
                    localStorage.setItem(`${quizName}_BronzeMedal`, BronzeMedal);
                });
            } else {
                console.error("Error fetching user medals");
            }

            const redirectFrom = sessionStorage.getItem("loginRedirectFrom");

            if (redirectFrom === "quizGamePreview") {
                updateProfile(ResponseData);
                logIn(token, ResponseData);
                sessionStorage.removeItem("loginRedirectFrom");
                window.history.go(-1);
            } else {
                window.location.href = "/..";
            }
        } else {
            setShowModal(true);
        }
    };


    return (
        <div className="flex flex-col min-h-screen bg-cover bg-center m-0"
             style={{backgroundImage: "url('/images/LogBackground.png')"}}>
            <Header showButtons={false}/>
            <main className="flex-1 flex justify-center items-center align-middle">
                <FormField
                    title="Log In"
                    inputs={[
                        {
                            id: "UserEmail", label: "Email", size: "large", placeholder: "example@example.com",
                            rules: {
                                required: true,
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Please enter a valid email."
                                },
                            },
                        },
                        {
                            id: "PasswordLogIn", label: "Password", size: "large", placeholder: "********",
                            rules: {required: true}
                        },
                    ]}
                    buttonText="Enter"
                    buttonSize="small"
                    linkText="Forgot your password?"
                    linkUrl="/AccountRecovery"
                    onSubmit={handleLogin}
                />

                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/20">
                        <BaseModal
                            title="Oooops"
                            description="Invalid credentials. Please, try again."
                            buttons={[
                                {text: "Got it!", color: "gray", onClick: () => setShowModal(false)},
                            ]}
                        />
                    </div>
                )}
            </main>
            <Footer/>
        </div>
    );
};

export default LogIn;
