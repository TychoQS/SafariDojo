import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FormField from "@/components/FormField";

const SignUpSecondStep = () => {
    return (
        <div className="flex flex-col min-h-screen bg-cover bg-center m-0"
             style={{ backgroundImage: "url('/images/LogBackground.png')" }}>
            <Header />
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
                    buttonLink="/MyProfile"
                    linkText="Already have an account?"
                    linkUrl="/LogIn"
                />
            </main>
            <Footer />
        </div>
    );
};

export default SignUpSecondStep;
