import Form from "next/form";
import Input from "./Input";

export default function BillingForm() {
    return (
        <section className={"w-115 h-105 border-4 rounded-lg m-auto flex flex-col items-center " +
            "justify-evenly bg-[#FFDEB6] border-[#FBAF00]"}>
            <div className={"text-5xl text-transparent drop-shadow-[2px_2px_0px_black] bg-clip-text bg-gradient-to-b from-[#FFDEB6] to-[#FBAF00]"}>
                Billing information
            </div>
            <Form id={"BillingForm"} className={"flex flex-col items-center text-[#372E55]"}>
                <Input size="large" id="CardholderName" label="Cardholder name"/>
                <Input size="large" id="CardNumber" label="Card Number"/>
                <Input size="large" id="ValidityDate" label="Validity Date"/>
                <button className="cursor-pointer w-40 h-12 border-b-6 rounded-full hover:bg-orange-400 hover:border-none bg-[#FBAF00] border-b-[#403C61] font-black text-xl shadow-md">
                    Save
                </button>
            </Form>
        </section>
    )
}