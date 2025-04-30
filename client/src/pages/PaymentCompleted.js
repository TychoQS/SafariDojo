import {useProfile} from "@/pages/context/ProfileContext";
import {useEffect} from "react";

export default function PaymentCompleted() {
    const {profile, updateProfile} = useProfile();

    useEffect(() => {
        const confirmPayment = async () => {
            if (!profile) return;

            try {
                updateProfile({...profile, isPremium: true});

                const requestBody = {
                    Email: profile.email,
                    Premium: true,
                };

                const response = await fetch("http://localhost:8080/api/updatePremium", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(requestBody),
                });

                const data = await response.json();

                if (!response.ok) {
                    console.error("Error updating premium after payment:", data.message);
                    alert(data.message);
                } else {
                    console.log("User upgraded to premium successfully:", data);
                }
            } catch (error) {
                console.error("Error confirming payment:", error);
            }
        };

        confirmPayment();
    }, [profile, updateProfile]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Completed!</h2>
                <p className="text-gray-600 mb-6">Your purchase has been successfully processed.</p>
                <button
                    onClick={() => window.history.go(-2)}
                    className="bg-[#FBAF00] text-gray-800 font-medium py-2 px-4 rounded hover:bg-[#FBAF00] transition-colors cursor-pointer"
                >
                    Close
                </button>
            </div>
        </div>
    );
}
