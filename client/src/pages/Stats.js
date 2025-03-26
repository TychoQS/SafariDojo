import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StatsPassport from "@/components/StatsPassport";
import Title from "@/components/Title";

function Stats () {
    return (
        <>
        <Header />
            <div className="flex justify-center bg-PS-main-purple"><Title>Stats</Title></div>

            <StatsPassport />
        <Footer/>
        </>
    )
}

export default Stats;