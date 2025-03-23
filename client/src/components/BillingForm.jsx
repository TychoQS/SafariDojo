import Form from "next/form";
import Input from "./Input";

export default function BillingForm() {
    return (
        <section className={"w-115 h-110 border-4 rounded-lg m-auto flex flex-col items-center " +
            "justify-center bg-[#FFDEB6] border-[#FBAF00]"}>
            <h1 className={"text-transparent bg-clip-text bg-gradient-to-b from-[#FFDEB6] to-[#FBAF00]"}>
                Billing information
            </h1>
            <Form id={"BillingForm"} className={"flex flex-col items-center text-[#372E55]"}>
                <Input size="large" id="CardholderName" label="Cardholder name"/>
                <Input size="large" id="CardNumber" label="Card Number"/>
                <Input size="large" id="ValidityDate" label="Validity Date"/>
            </Form>
        </section>
    )
}