import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Input from "@/components/Input";
import Title from "@/components/Title";

const AccountRecovery = () => {
    return (
        <div className="app min-h-screen flex flex-col bg-PS-main-purple"
             style={{ backgroundImage: "url('/images/Clouds.svg')" }}>
            <Header />
            <main className="flex-1 flex justify-center items-center">
                <div className="flex flex-col justify-center items-center">
                    <Title>Account Recovery</Title>
                    <Input
                        size="large"
                        id="recovery"
                        label="Email"
                        placeholder="example@example.com"
                    />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default AccountRecovery;