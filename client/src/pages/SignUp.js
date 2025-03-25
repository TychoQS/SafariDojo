import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FormField from "@/components/FormField";

const SignUp = () => {
    return (
        <div className="flex flex-col min-h-screen bg-cover bg-center m-0"
             style={{ backgroundImage: "url('/images/LogBackground.png')" }}>
            <Header />
            <main className="flex-1 flex justify-center items-center align-middle">
                <FormField
                    title="Sign Up"
                    inputs={[
                        { id: "FullName", label: "Full Name", size: "large", placeholder: "John Doe" },
                        { id: "UserEmail", label: "Email", size: "large", placeholder: "example@example.com" },
                    ]}
                    buttonText="Next"
                    buttonSize="small"
                    linkText="Already have an account?"
                    linkUrl="#"
                />
            </main>
            <Footer />
        </div>
    );
};

export default SignUp;