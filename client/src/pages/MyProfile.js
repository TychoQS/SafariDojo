import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Title from "@/components/Title";
import Button from "@/components/Button";
import Link from "next/link";
import DisplayField from "@/components/DisplayField";
import React, {useEffect, useState} from "react";
import AnimalIcon from "@/components/AnimalIcon";
import {deliciousHandDrawn} from "@/styles/fonts";
import {useRouter} from "next/router";
import {useProfile} from "@/pages/context/ProfileContext";
import ModalButton from "@/components/ModalButton";
import PremiumModal from "@/components/PremiumModal";
import {useTranslation} from "react-i18next";

export default function MyProfile() {
    const {profile, updateProfile} = useProfile();
    const [profilePhoto, setProfilePhoto] = useState('');
    const [userName, setUserName] = useState('');
    const [showPremiumModal, setShowPremiumModal] = useState(false);
    const router = useRouter();
    const [confirmLeave, setConfirmLeave] = useState(false);
    const { t } = useTranslation();

    const currentUser = profile || {name: "Unknown", email: "N/A", profilePhoto: "default", isPremium: false};

    useEffect(() => {
        const storedName = localStorage.getItem("name");
        const storedPhoto = localStorage.getItem("profilePhoto");

        if (storedName) setUserName(storedName);
        if (storedPhoto) setProfilePhoto(storedPhoto);

        const handleStorageChange = () => {
            const updatedName = localStorage.getItem("name");
            const updatedPhoto = localStorage.getItem("profilePhoto");

            if (updatedName) setUserName(updatedName);
            if (updatedPhoto) setProfilePhoto(updatedPhoto);
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    const handlePremiumToggle = async () => {
        setShowPremiumModal(false);

        if (currentUser.isPremium) {
            try {
                updateProfile({...currentUser, isPremium: false});

                const requestBody = {
                    Email: currentUser.email,
                    Premium: false,
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
                    console.error("Error updating user:", data.message);
                    alert(data.message);
                } else {
                    console.log("Premium status updated successfully:", data);
                }
            } catch (error) {
                console.error('Error updating premium status:', error);
                alert("An unexpected error occurred.");
            }
        } else {
            await router.push("/BillingForm");
        }
    };

    return (
        <div className="app min-h-screen flex flex-col bg-PS-main-purple">
            <Header/>
            <section
                className="grid grid-cols-2 grid-rows-[auto,auto,auto,auto] border-4 rounded-lg m-auto flex-col items-center justify-start bg-PS-light-yellow border-PS-dark-yellow mb-[-5vh] pb-[12vh] px-[8vh] gap-6">
                <div className="col-span-2 flex justify-center items-center gap-4">
                    <Title>{t('myprofile')}</Title>
                    <div className="relative group flex items-center justify-center">
                        <svg
                            onClick={() => setShowPremiumModal(true)}
                            width="800px"
                            height="800px"
                            viewBox="0 0 24 24"
                            fill={currentUser.isPremium ? "#FBAF00" : "#1C274C"}
                            className="w-12 h-12 ml-4 mt-8 animate-pulse hover:scale-250 transition-transform duration-200 cursor-pointer"
                        >
                            <path
                                opacity="0.5"
                                d="M19.6872 14.0932L19.8706 12.3885C19.9684 11.479 20.033 10.8784 19.9823 10.5C19.5357 10.4948 19.1359 10.2944 18.8645 9.98019C18.5384 10.1814 18.1122 10.6061 17.4705 11.2452C16.9762 11.7376 16.729 11.9838 16.4533 12.0219C16.3005 12.0431 16.1449 12.0213 16.0038 11.9592C15.7492 11.8471 15.5794 11.5427 15.2399 10.934L13.4505 7.72546C13.241 7.3499 13.0657 7.03565 12.9077 6.78271C12.6353 6.92169 12.3268 7.00006 12 7.00006C11.6732 7.00006 11.3647 6.92169 11.0923 6.78272C10.9343 7.03566 10.759 7.34991 10.5495 7.72547L8.76006 10.934C8.42056 11.5427 8.25081 11.8471 7.99621 11.9592C7.85514 12.0213 7.69947 12.0431 7.5467 12.0219C7.27097 11.9838 7.02381 11.7376 6.5295 11.2452C5.88785 10.6061 5.46157 10.1814 5.13553 9.98019C4.86406 10.2944 4.46434 10.4948 4.01771 10.5C3.96702 10.8784 4.03162 11.479 4.12945 12.3885L4.3128 14.0932C4.34376 14.3809 4.37312 14.6645 4.40192 14.9425C4.65422 17.3783 4.86292 19.3932 5.71208 20.1532C6.65817 21.0001 8.07613 21.0001 10.9121 21.0001H13.0879C15.9239 21.0001 17.3418 21.0001 18.2879 20.1532C19.1371 19.3932 19.3458 17.3783 19.5981 14.9426C19.6269 14.6645 19.6562 14.3809 19.6872 14.0932Z"
                            />
                            <path
                                d="M20 10.5C20.8284 10.5 21.5 9.82843 21.5 9C21.5 8.17157 20.8284 7.5 20 7.5C19.1716 7.5 18.5 8.17157 18.5 9C18.5 9.37466 18.6374 9.71724 18.8645 9.98013C19.1359 10.2944 19.5357 10.4947 19.9823 10.4999L20 10.5Z"
                            />
                            <path
                                d="M12 3C10.8954 3 10 3.89543 10 5C10 5.77778 10.444 6.45187 11.0923 6.78265C11.3647 6.92163 11.6732 7 12 7C12.3268 7 12.6353 6.92163 12.9077 6.78265C13.556 6.45187 14 5.77778 14 5C14 3.89543 13.1046 3 12 3Z"
                            />
                            <path
                                d="M2.5 9C2.5 9.82843 3.17157 10.5 4 10.5L4.01771 10.4999C4.46434 10.4947 4.86406 10.2944 5.13553 9.98012C5.36264 9.71724 5.5 9.37466 5.5 9C5.5 8.17157 4.82843 7.5 4 7.5C3.17157 7.5 2.5 8.17157 2.5 9Z"
                            />
                            <path
                                d="M4.84862 18.25C4.75064 17.7997 4.67228 17.2952 4.60254 16.75H19.3968C19.327 17.2952 19.2487 17.7997 19.1507 18.25H4.84862Z"
                            />
                        </svg>
                        <div
                            className={`absolute top-full mt-4 text-PS-light-black text-lg px-3 py-1 bg-transparent rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 whitespace-nowrap ${deliciousHandDrawn.className}`}>
                            {currentUser.isPremium ? "You belong to elite!" : "Become premium to stand out!"}
                        </div>
                    </div>
                </div>

                <div className="col-start-2 row-start-3 flex flex-col items-end space-y-6">
                    <DisplayField size="large" label={t('name')} value={userName || currentUser.name} />
                    <DisplayField size="large" label={t('email')} value={currentUser.email}/>

                    <Button size="large">
                        <Link href="/EditProfile">{t('editprofile')}</Link>
                    </Button>
                </div>

                <div className="col-start-1 row-start-2 flex justify-center items-start space-y-6 mb-[10px] relative">
                    <AnimalIcon animalName={profilePhoto || currentUser.profilePhoto} size="large" borderThickness={5}
                                backgroundColor={"#FBC078"}/>
                    <Link href="/ChangeIcon"
                          className="absolute top-0 right-8 p-2 cursor-pointer hover:scale-110 transition-transform duration-300">
                        <img src="/images/EditIcon.svg" alt="Edit Icon" className="w-8 h-8"/>
                    </Link>
                </div>
            </section>

            {showPremiumModal && (
                <PremiumModal
                    isPremium={currentUser.isPremium}
                    confirmLeave={confirmLeave}
                    onClose={() => {
                        setConfirmLeave(false);
                        setShowPremiumModal(false);
                    }}
                    onLeaveClick={() => setConfirmLeave(true)}
                    onTogglePremium={handlePremiumToggle}
                />
            )}


            <Footer/>
        </div>
    );
}
