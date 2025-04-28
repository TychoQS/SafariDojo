import React, {useRef} from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FormField from "@/components/FormField";
import {useAuth} from "@/pages/context/AuthContext";
import {useRouter} from "next/router";

const SignUpSecondStep = () => {
    const { logIn } = useAuth();
    const router = useRouter();
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
             style={{ backgroundImage: "url('/images/LogBackground.png')" }}>
            <Header showButtons={false} />
            <main className="flex-1 flex justify-center items-center align-middle">
                <FormField
                    title="Sign Up"
                    inputs={[
                        {
                            id: "Password", label: "Password", size: "large", placeholder: "********",
                            rules: {
                                required: true,
                                minLength: { value: 8, message: "Password must have at least 8 characters." },
                                pattern: {
                                    value: /^(?=.*[A-Z])(?=.*\d)/,
                                    message: "Password must contain at least one uppercase letter and one number.",
                                },
                            }
                        },
                        {
                            id: "ConfirmPassword", label: "Confirm Password", size: "large", placeholder: "********",
                            rules: {
                                required: true,
                                minLength: { value: 8, message: "Password must have at least 8 characters." },
                                pattern: {
                                    value: /^(?=.*[A-Z])(?=.*\d)/,
                                    message: "Password must contain at least one uppercase letter and one number.",
                                },
                            }
                        },
                    ]}
                    buttonText="Create"
                    buttonSize="small"
                    linkText="Already have an account?"
                    linkUrl="/LogIn"
                    onSubmit={handleSubmit}
                />
            </main>
            <Footer />
        </div>
    );
};

export default SignUpSecondStep;
