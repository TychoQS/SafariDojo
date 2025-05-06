import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {margarine} from "@/styles/fonts";
import {useTranslation} from "react-i18next";

export default function LogOut() {
    const {t} = useTranslation();

    return (
        <div className="app min-h-screen flex flex-col bg-PS-main-purple">
            <Header/>
            <section className="flex-grow flex items-center justify-center relative overflow-hidden mt-2">
                <div className="animate-pendulum [transform-origin:top_center] flex flex-col items-center relative">
                    <img
                        className="w-[400px] h-auto"
                        src={"/images/Cartel.svg"}
                        alt="Cartel"
                    />
                    <div
                        className={`absolute top-[70%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-PS-main-purple font-bold text-2xl w-[80%] max-w-[600px] ${margarine.className}`}
                    >
                        <p>{t("logOutText1")}</p>
                        <p>{t("logOutText2")}</p>
                    </div>
                </div>
            </section>
            <Footer/>
        </div>
    );
}