import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BillingForm from "@/components/BillingForm";

export default function BillingInformation() {
    return (
        <>
            <div className="app min-h-screen flex flex-col bg-PS-main-purple">
                <Header mode="loggedIn" />
                <section className="flex-grow flex items-start justify-center relative overflow-hidden mt-2">
                    <BillingForm />
                </section>
                <Footer />
            </div>
        </>
    )
}