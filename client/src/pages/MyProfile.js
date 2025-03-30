import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Title from "@/components/Title";
import Button from "@/components/Button";
import Link from "next/link";
import DisplayField from "@/components/DisplayField";
import {useAuth} from "@/pages/context/AuthContext";
import React, {useEffect, useState} from "react";
import AnimalIcon from "@/components/AnimalIcon";

export default function MyProfile() {
    const {user} = useAuth();
    const [profilePhoto, setProfilePhoto] = useState('');
    const [userName, setUserName] = useState('');

    const currentUser = user || {name: "Unknown", email: "N/A", profilePhoto: "default"};

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


    return (
        <div className="app min-h-screen flex flex-col bg-PS-main-purple">
            <Header/>
            <section
                className="grid grid-cols-2 grid-rows-[auto,auto,auto,auto] border-4 rounded-lg m-auto flex-col items-center justify-start bg-PS-light-yellow border-PS-dark-yellow mb-[-5vh] pb-[12vh] px-[8vh] gap-6"
            >
                <div className="col-span-2 flex justify-center items-center">
                    <Title>My profile</Title>
                </div>

                <div className="col-start-2 row-start-3 flex flex-col items-end space-y-6">
                    <DisplayField size="large" label="Name" value={userName || currentUser.name}/>
                    <DisplayField size="large" label="Email" value={currentUser.email}/>
                </div>

                <div className="col-start-1 row-start-2 flex justify-center items-start space-y-6 mb-[20px] relative">
                    <AnimalIcon animalName={profilePhoto || currentUser.profilePhoto} size="large" borderThickness={5} backgroundColor={"#FBC078"}/>
                    <Link href="/ChangeIcon"
                          className="absolute top-0 right-8 p-2 cursor-pointer hover:scale-110 transition-transform duration-300">
                        <img src="/images/EditIcon.svg" alt="Edit Icon" className="w-8 h-8"/>
                    </Link>
                </div>

                <div className="col-start-1 col-span-2 row-start-4 flex justify-between items-center">
                    <div className="flex space-x-8">
                        <Link href="..">
                            <img
                                src="/images/StatsButton.svg"
                                alt="Stats Button"
                                className="w-16 h-16 cursor-pointer hover:scale-110 transition-transform duration-300"
                            />
                        </Link>
                        <Link href="/Goals">
                            <img
                                src="/images/Diana.svg"
                                alt="Diana"
                                className="w-16 h-16 cursor-pointer hover:scale-110 transition-transform duration-300"
                            />
                        </Link>
                        <Link href="..">
                            <img src="/images/Medals.svg" alt="Medals"
                                 className="w-16 h-16 cursor-pointer hover:scale-110 transition-transform duration-300"/>
                        </Link>
                    </div>
                    <Button size="large">
                        <Link href="/EditProfile">edit profile</Link>
                    </Button>
                </div>
            </section>
            <Footer/>
        </div>
    );
}