import { ProfileProvider } from "@/pages/context/ProfileContext";
import { GoalsProvider } from "@/pages/context/GoalContext";
import { AuthProvider } from "@/pages/context/AuthContext";
import "@/styles/globals.css";
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import ClientOnly from '@/components/ClientOnly';

function MyApp({ Component, pageProps }) {
    return (
        <AuthProvider>
            <ProfileProvider>
                <GoalsProvider>
                    <ClientOnly>
                        <I18nextProvider i18n={i18n}>
                            <Component {...pageProps} />
                        </I18nextProvider>
                    </ClientOnly>
                </GoalsProvider>
            </ProfileProvider>
        </AuthProvider>
    );
}

export default MyApp;
