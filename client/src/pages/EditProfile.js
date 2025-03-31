import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Input from "@/components/Input";
import Title from "@/components/Title";
import Button from "@/components/Button";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import {useAuth} from "@/pages/context/AuthContext";
import {useRouter} from "next/router";
import AnimalIcon from "@/components/AnimalIcon";
import DisplayField from "@/components/DisplayField";

export default function EditProfile() {
    const [error, setError] = useState("");
    const router = useRouter();

    const {user, setUser} = useAuth();
    const [name, setName] = useState(user?.name || "");
    const [userName, setUserName] = useState(user?.name || "");
    const [profilePhoto, setProfilePhoto] = useState(user?.profilePhoto || "default");

    useEffect(() => {
        const storedName = localStorage.getItem("name");
        const storedPhoto = localStorage.getItem("profilePhoto");

        if (storedName) {
            setUserName(storedName);
            setName(storedName);
        }
        if (storedPhoto) setProfilePhoto(storedPhoto);

        const handleStorageChange = () => {
            const updatedName = localStorage.getItem("name");
            const updatedPhoto = localStorage.getItem("profilePhoto");

            if (updatedName) {
                setUserName(updatedName);
                setName(updatedName);
            }
            if (updatedPhoto) setProfilePhoto(updatedPhoto);
        };

        window.addEventListener("storage", handleStorageChange);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    const handleSave = async () => {
        if (!error && name.trim()) {
            const response = await fetch('/api/UpdateNameProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: user?.email,
                    name,
                }),
            });

            if (response.ok) {
                localStorage.setItem('name', name);
                setUser(prevUser => ({
                    ...prevUser,
                    name: name,
                }));
                setUserName(name);
                router.push("/MyProfile");
            } else {
                const result = await response.json();
                alert(`Error: ${result.message}`);
            }
        }
    }

    const handleError = (id, errorMsg) => {
        if (id === "UserName") setError(errorMsg);
    };

    return (
        <div className="app min-h-screen flex flex-col bg-PS-main-purple">
            <Header/>
            <section
                className="grid grid-cols-2 grid-rows-[auto,auto,auto,auto] border-4 rounded-lg m-auto flex-col items-center justify-start bg-PS-light-yellow border-PS-dark-yellow mb-[-5vh] pb-[12vh] px-[8vh] gap-6"
            >
                <div className="col-span-2 flex justify-center items-center">
                    <Title>Edit your profile</Title>
                </div>

                <div className="col-start-2 row-start-3 flex flex-col items-end space-y-6">
                    <Input
                        id="UserName"
                        size="large"
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onError={handleError}
                        rules={{
                            required: true,
                            minLength: {value: 2, message: "Name must be at least 2 characters."},
                        }}
                    />
                    <DisplayField size="large" label="Email" value={user?.email || "N/A"}/>
                </div>

                <div className="col-start-1 row-start-2 flex justify-center items-start space-y-6 mb-[20px] relative">
                    <AnimalIcon animalName={profilePhoto} size="large" borderThickness={5}
                                backgroundColor={"#FBC078"}/>
                    <Link
                        href="/ChangeIcon"
                        className="absolute top-0 right-8 p-2 cursor-pointer hover:scale-110 transition-transform duration-300"
                    >
                        <img src="/images/EditIcon.svg" alt="Edit Icon" className="w-8 h-8"/>
                    </Link>
                </div>

                <div className="col-start-1 col-span-2 row-start-4 flex justify-between items-center">
                    <Link href="/MyProfile">
                        <Button size="large">cancel</Button>
                    </Link>
                    <Button size="large" onClick={handleSave} disabled={!!error || !name.trim()}>
                        save
                    </Button>
                </div>
            </section>
            <Footer/>
        </div>
    );
}
