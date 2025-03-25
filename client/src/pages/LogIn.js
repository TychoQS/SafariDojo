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
                        { id: "FullName", label: "Email", size: "large", placeholder: "example@example.com" },
                        { id: "UserEmail", label: "Password", size: "large", placeholder: "********" },
                    ]}
                    buttonText="next"
                    buttonSize="small"
                    linkText="Forgot password?"
                    linkUrl="#"
                />
            </main>
            <Footer />
        </div>
    );
};

export default LogIn;