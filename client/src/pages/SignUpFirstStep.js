import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FormField from "@/components/FormField";

const SignUpFirstStep = () => {

    const handleSubmit = (formData) => {
        const { FullName, UserEmail } = formData;

        const userData = {
            name: FullName,
            email: UserEmail,
        };
        sessionStorage.setItem('signupData', JSON.stringify(userData));
    };

    return (
        <div className="flex flex-col min-h-screen bg-cover bg-center m-0"
             style={{backgroundImage: "url('/images/LogBackground.png')"}}>
            <Header showButtons={false} />
            <main className="flex-1 flex justify-center items-center align-middle">
                <FormField
                    title="Sign Up"
                    inputs={[
                        {
                            id: "FullName", label: "Name", size: "large", placeholder: "John Doe",
                            rules: {
                                required: true,
                                minLength: { value: 3, message: "The name must have at least 3 characters." },
                            },
                        },
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
                    ]}
                    buttonText="Next"
                    buttonSize="small"
                    buttonLink="/SignUpSecondStep"
                    linkText="Already have an account?"
                    linkUrl="/LogIn"
                    onSubmit={handleSubmit}
                />
            </main>
            <Footer/>
        </div>
    );
};

export default SignUpFirstStep;