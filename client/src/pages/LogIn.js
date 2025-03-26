import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FormField from "@/components/FormField";

const LogIn = () => {
    return (
        <div className="flex flex-col min-h-screen bg-cover bg-center m-0"
             style={{ backgroundImage: "url('/images/LogBackground.png')" }}>
            <Header />
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
                                    message: "Please enter a valid email address."
                                },
                            },
                        },
                        {
                            id: "PasswordLogIn", label: "Password", size: "large", placeholder: "********",
                            rules: {
                                required: true
                            }
                        },
                    ]}
                    buttonLink=".."
                    buttonText="next"
                    buttonSize="small"
                    linkText="Forgot password?"
                    linkUrl="/AccountRecovery"
                />
            </main>
            <Footer />
        </div>
    );
};

export default LogIn;