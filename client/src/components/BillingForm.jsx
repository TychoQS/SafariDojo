import Form from "next/form";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Title from "@/components/Title";

export default function BillingForm() {
    return (
        <section className={"w-[50rem] h-[40rem] border-4 rounded-lg m-auto flex flex-col items-center " +
            "justify-start bg-[#FFDEB6] border-[#FBAF00] p-6 mt-[1rem] mb-[-30rem]"}>
            <Title level={2} className="mb-4">Billing Information</Title>
            <Form id={"BillingForm"} className={"flex flex-col items-center text-[#372E55] mt-[1.5rem] w-full gap-4"}>
                <Input size="large" id="CardholderName" label="Cardholder name"/>
                <Input size="large" id="CardNumber" label="Card Number"/>
                <Input size="large" id="ValidityDate" label="Validity Date"/>
                <Button>Save</Button>
            </Form>
        </section>
    )
}