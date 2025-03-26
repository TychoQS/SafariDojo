import {ProfileProvider} from "@/pages/context/ProfileContext";
import {GoalsProvider} from "@/pages/context/GoalContext";
import {AuthProvider} from "@/pages/context/AuthContext";
import "@/styles/globals.css";

function MyApp({Component, pageProps}) {
    return (
        <AuthProvider>
            <ProfileProvider>
                <GoalsProvider>
                    <Component {...pageProps} />
                </GoalsProvider>
            </ProfileProvider>
        </AuthProvider>
    );
}

export default MyApp;
