import Header from "@/components/Header";
import Footer from "@/components/Footer";

const LoadingPage = () => {
    return (
        <div className={"app min-h-screen flex flex-col bg-PS-main-purple relative"}>
            <Header />
            <div className="flex-grow flex items-center justify-center">
                <div className="text-white text-2xl">
                    <div className="w-16 h-16 border-t-4 border-b-4 border-white rounded-full animate-spin mx-auto mb-4"></div>
                    Loading...
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default LoadingPage;