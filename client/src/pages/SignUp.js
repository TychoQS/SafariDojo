import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FormField from "@/components/FormField";

const SignUp = () => {
    return (
        <div style={styles.page}>
            <Header />
            <main style={styles.main}>
                <FormField
                    title="Sign Up"
                    inputs={[
                        { id: "FullName", label: "Name", size: "large" },
                        { id: "UserEmail", label: "Email", size: "large" }
                    ]}
                    buttonText="Next"
                    buttonSize="medium"
                    linkText="Already have an account?"
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
    },
};

export default SignUp;