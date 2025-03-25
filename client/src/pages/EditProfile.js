import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Input from "@/components/Input";
import Title from "@/components/Title";
import Button from "@/components/Button";
import AnimalIcon from "@/components/AnimalIcon";
import {useState} from "react";
import Link from "next/link";
import {useProfile} from "@/pages/context/ProfileContext";
import DisplayField from "@/components/DisplayField";

export default function EditProfile() {
    const {profile, updateProfile} = useProfile();
    const [name, setName] = useState(profile.name);

    const handleSave = () => {
        updateProfile({name});
    };

    return (
        <div className="app min-h-screen flex flex-col bg-PS-main-purple">
            <Header mode="loggedIn"/>
            <section
                className="grid grid-cols-2 grid-rows-[auto,auto,auto,auto] border-4 rounded-lg m-auto flex-col items-center justify-start bg-[#FFDEB6] border-[#FBAF00] mb-[-5vh] pb-[12vh] px-[8vh] gap-6">
                <div className="col-span-2 flex justify-center items-center">
                    <Title>Edit your profile</Title>
                </div>

                <div className="col-start-2 row-start-3 flex flex-col items-end space-y-6">
                    <Input size="large" label="Name" value={name} onChange={(e) => setName(e.target.value)}/>
                    <DisplayField size="large" label="Email" value={profile.email}/>
                </div>

                <div className="col-start-1 row-start-2 flex justify-center items-start space-y-6 mb-[20px] relative">
                    <AnimalIcon animalName={profile.icon} size="large" borderThickness={5} backgroundColor={"#FBC078"}/>
                    <Link href="/ChangeIcon"
                          className="absolute top-0 right-8 p-2 cursor-pointer hover:scale-110 transition-transform duration-300">
                        <img src="/images/EditIcon.svg" alt="Edit Icon" className="w-8 h-8"/>
                    </Link>
                </div>

                <div className="col-start-1 col-span-2 row-start-4 flex justify-between items-center">
                    <Link href="/MyProfile">
                        <Button size="large">cancel</Button>
                    </Link>
                    <Link href="/MyProfile">
                        <Button size="large" onClick={() => {
                            handleSave();
                        }}>save</Button>
                    </Link>
                </div>
            </section>
            <Footer/>
        </div>
    );
}
