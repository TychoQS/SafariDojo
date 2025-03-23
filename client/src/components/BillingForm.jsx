import Form from "next/form";
import Input from "./Input";
import Title from "./Title";

export default function BillingForm() {
    return (
        <section className={"w-115 h-120 border-4 rounded-lg m-auto flex flex-col items-center " +
            "justify-start bg-[#FFDEB6] border-[#FBAF00]"}>
            <Title level={2}>Billing Information</Title>
            <Form id={"BillingForm"} className={"flex flex-col items-center text-[#372E55]"}>
                <Input size="large" id="CardholderName" label="Cardholder name"/>
                <Input size="large" id="CardNumber" label="Card Number"/>
                <Input size="large" id="ValidityDate" label="Validity Date"/>
                <button className="cursor-pointer w-40 h-12 border-b-6 rounded-full
                hover:bg-orange-400 hover:border-none bg-[#FBAF00] border-b-[#403C61] font-black text-xl shadow-md">
                    Save
                </button>
            </Form>
        </section>
    )
}