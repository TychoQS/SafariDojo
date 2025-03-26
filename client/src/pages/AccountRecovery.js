import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Input from "@/components/Input";
import Title from "@/components/Title";
import Button from "@/components/Button";

const AccountRecovery = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    const handleError = (id, errorMsg) => {
        if (id === "UserEmail") setError(errorMsg);
    };

    const handleSubmit = () => {
        if (!error && email) {
            console.log("Recovery email sent to:", email);
            alert("Check your email for recovery instructions.");
        }
    };

    return (
        <div className="app min-h-screen flex flex-col bg-PS-main-purple"
             style={{ backgroundImage: "url('/images/Clouds.svg')" }}>
            <Header/>
            <main className="flex-1 flex justify-center items-center">
                <div className="flex flex-col justify-center items-center gap-15">
                    <Title>Account Recovery</Title>
                    <Input
                        id="UserEmail"
                        label="Email"
                        size="large"
                        placeholder="example@example.com"
                        value={email}
                        onChange={handleChange}
                        onError={handleError}
                        rules={{
                            required: true,
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Please enter a valid email."
                            }
                        }}
                    />
                    <Button size="small" onClick={handleSubmit} disabled={!!error || !email}>
                        Send
                    </Button>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default AccountRecovery;