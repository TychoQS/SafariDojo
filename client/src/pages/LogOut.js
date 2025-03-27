import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function LogOut() {
    return (
        <>
            <div className="app min-h-screen flex flex-col bg-PS-main-purple">
                <Header/>
                <section className="flex-grow flex items-center justify-center relative overflow-hidden">
                    <img className="w-[600px] h-auto" src={"/images/Cartel.svg"} alt="Cartel"/>
                </section>
                <Footer/>
            </div>
        </>
    )
}