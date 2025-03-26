import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FormField from "@/components/FormField";
import {useRouter} from "next/router";
import {useAuth} from "@/pages/context/AuthContext";

const LogIn = () => {
    const {logIn} = useAuth();
    const router = useRouter();

    const handleLogin = (data) => {
        console.log("Form data:", data);

        if (data.UserEmail === "nelson@ulpgc.com" && data.PasswordLogIn === "Ps20242025") {
            logIn();
            router.push("..");
        } else {
            alert("Invalid credentials, please try again.");
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-cover bg-center m-0" style={{ backgroundImage: "url('/images/LogBackground.png')" }}>
            <Header showButtons={false} />
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
                            rules: { required: true }
                        },
                    ]}
                    buttonText="Enter"
                    buttonSize="small"
                    linkText="Forgot your password?"
                    linkUrl="/AccountRecovery"
                    onSubmit={handleLogin}
                />
            </main>
            <Footer/>
        </div>
    );
};

export default LogIn;