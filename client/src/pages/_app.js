import {ProfileProvider} from "@/pages/context/ProfileContext";
import "@/styles/globals.css";

function MyApp({Component, pageProps}) {
    return (
        <ProfileProvider>
            <Component {...pageProps} />
        </ProfileProvider>
    );
}

export default MyApp;