import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FormField from "@/components/FormField";

const LogIn = () => {
    return (
        <div style={styles.page}>
            <Header />
            <main style={styles.main}>
                <FormField
                    title="Log In"
                    inputs={[
                        { id: "FullName", label: "Email", size: "large" },
                        { id: "UserEmail", label: "Password", size: "large" }
                    ]}
                    buttonText="Next"
                    buttonSize="medium"
                    linkText="Forgot password?"
                    linkUrl="#"
                />
            </main>
            <Footer />
        </div>
    );
};

const styles = {
    page: {
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundImage: "url('/images/LogBackground.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        margin: 0,
    },
    main: {
        flex: 1,
        alignSelf: "center",
    },
};

export default LogIn;