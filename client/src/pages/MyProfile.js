import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Title from "@/components/Title";
import Button from "@/components/Button";
import AnimalIcon from "@/components/AnimalIcon";
import Link from "next/link";
import DisplayField from "@/components/DisplayField";
import {useProfile} from "@/pages/context/ProfileContext";

export default function MyProfile() {
    const {profile} = useProfile();
    console.log(profile);

    return (
        <div className="app min-h-screen flex flex-col bg-PS-main-purple">
            <Header mode="loggedIn"/>
            <section
                className="grid grid-cols-2 grid-rows-[auto,auto,auto,auto] border-4 rounded-lg m-auto flex-col items-center justify-start bg-[#FFDEB6] border-[#FBAF00] mb-[-5vh] pb-[12vh] px-[8vh] gap-6">
                <div className="col-span-2 flex justify-center items-center">
                    <Title>My profile</Title>
                </div>

                <div className="col-start-2 row-start-3 flex flex-col items-end space-y-6">
                    <DisplayField size="large" label="Name" value={profile.name}/>
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
                    <div className="flex space-x-8">
                        <a href=".." target="_blank">
                            <img src="/images/StatsButton.svg" alt="Stats Button"
                                 className="w-16 h-16 cursor-pointer hover:scale-110 transition-transform duration-300"/>
                        </a>
                        <a href=".." target="_blank">
                            <img src="/images/Diana.svg" alt="Diana"
                                 className="w-16 h-16 cursor-pointer hover:scale-110 transition-transform duration-300"/>
                        </a>
                        <a href=".." target="_blank">
                            <img src="/images/Medals.svg" alt="Medals"
                                 className="w-16 h-16 cursor-pointer hover:scale-110 transition-transform duration-300"/>
                        </a>
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
