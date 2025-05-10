import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FormField from "@/components/FormField";
import {useAuth} from "@/pages/context/AuthContext";
import {useRouter} from "next/router";
import {useTranslation} from "react-i18next";

const SignUpSecondStep = () => {
    const {logIn} = useAuth();
    const router = useRouter();
    const {t} = useTranslation();

    const hashPassword = async (password) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(byte => byte.toString(16).padStart(2, "0")).join("");
    };

    const handleSubmit = async (formData) => {
        const PreviousData = JSON.parse(sessionStorage.getItem('signupData'));
        sessionStorage.removeItem(PreviousData);
        const {Password} = formData;
        const HashedPassword = await hashPassword(Password);
        const userData = {
            ...PreviousData,
            Password: HashedPassword,
            ProfilePhoto: "Sheep"
        };
        try {
            const response = await fetch("http://localhost:8080/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();
            if (response.ok) {
                const token = `fakeTokenForUser-${Date.now()}`;
                logIn(token, data);
                router.push("/");
            } else {
                console.error("Error en la respuesta:", data.message);
            }
        } catch (error) {
            console.error("Error en la petición:", error);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-cover bg-center m-0"
             style={{backgroundImage: "url('/images/LogBackground.png')"}}>
            <Header showButtons={false}/>
            <main className="flex-1 flex justify-center items-center align-middle">
                <FormField
                    title={t("signup")}
                    inputs={[
                        {
                            id: "Password", label: t("password"), size: "large", placeholder: "********",
                            rules: {
                                required: true,
                                minLength: {value: 8, message: t("passwordlengthMessage") },
                                pattern: {
                                    value: /^(?=.*[A-Z])(?=.*\d)/,
                                    message: t("passwordpatternMessage"),
                                },
                            }
                        },
                        {
                            id: "ConfirmPassword", label: t("confirmPassword"), size: "large", placeholder: "********",
                            rules: {
                                required: true,
                                minLength: {value: 8, message: t("passwordlengthMessage") },
                                pattern: {
                                    value: /^(?=.*[A-Z])(?=.*\d)/,
                                    message: t("passwordpatternMessage"),
                                },
                            }
                        },
                    ]}
                    buttonText={t("create")}
                    buttonSize="small"
                    linkText={ t("accountLink")}
                    linkUrl="/LogIn"
                    onSubmit={handleSubmit}
                />
            </main>
            <Footer/>
        </div>
    );
};

export default SignUpSecondStep;
