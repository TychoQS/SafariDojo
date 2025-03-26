import {ProfileProvider} from "@/pages/context/ProfileContext";
import {GoalsProvider} from "@/pages/context/GoalContext";
import "@/styles/globals.css";

function MyApp({ Component, pageProps }) {
    return (
        <ProfileProvider>
            <GoalsProvider>
                <Component {...pageProps} />
            </GoalsProvider>
        </ProfileProvider>
    );
}

export default MyApp;
