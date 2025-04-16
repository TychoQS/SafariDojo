import React, {useEffect} from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FormField from "@/components/FormField";
import {useRouter} from "next/router";

const SignUpFirstStep = () => {
    const router = useRouter();

    useEffect(() => {
        const emailInput = document.getElementById("UserEmail");
        if (emailInput) {
            emailInput.addEventListener("input", () => clearErrors(emailInput));
        }
    }, []);

    const clearErrors = (emailInput) => {
        const existingError = document.getElementById("custom-email-error");
        if (existingError) {
            existingError.remove();
        }
        emailInput.classList.remove('border-red-500');
    };

    function handleUsedEmail(message) {
        const emailInput = document.getElementById("UserEmail");
        const parentDiv = emailInput.closest('div');
        const existingError = document.getElementById("custom-email-error");
        if (existingError) {
            existingError.textContent = message;
        } else {
            const errorElement = document.createElement('p');
            errorElement.id = "custom-email-error";
            errorElement.textContent = message;
            errorElement.className = "text-red-500 text-sm mt-1 text-center";
            emailInput.classList.add('border-red-500');
            parentDiv.appendChild(errorElement);
        }
    }

    const handleSubmit = async (formData) => {
        const {FullName, UserEmail} = formData;
        const Response = await fetch("http://localhost:8080/api/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({Email: UserEmail}),
        });
        if (!Response.ok) {
            const ResponseMessage = await Response.json()
            handleUsedEmail(ResponseMessage.message);
            return;
        }

        const userData = {
            Name: FullName,
            Email: UserEmail,
        };
        sessionStorage.setItem('signupData', JSON.stringify(userData));
        router.push("/SignUpSecondStep");
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