import { ProfileProvider } from "@/pages/context/ProfileContext";
import { GoalsProvider } from "@/pages/context/GoalContext";
import { AuthProvider } from "@/pages/context/AuthContext";
import "@/styles/globals.css";
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';

function MyApp({ Component, pageProps }) {
    return (
        <I18nextProvider i18n={i18n}>
            <AuthProvider>
                <ProfileProvider>
                    <GoalsProvider>
                        <Component {...pageProps} />
                    </GoalsProvider>
                </ProfileProvider>
            </AuthProvider>
        </I18nextProvider>
    );
}

export default MyApp;