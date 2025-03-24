import Form from "next/form";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Title from "@/components/Title";

export default function BillingForm() {
    return (
        <section className={"w-115 h-135 border-4 rounded-lg m-auto flex flex-col items-center " +
            "justify-start bg-[#FFDEB6] border-[#FBAF00]"}>
            <Title level={2}>Billing Information</Title>
            <Form id={"BillingForm"} className={"flex flex-col items-center text-[#372E55]"}>
                <Input size="large" id="CardholderName" label="Cardholder name"/>
                <Input size="large" id="CardNumber" label="Card Number"/>
                <Input size="large" id="ValidityDate" label="Validity Date"/>
                <Button>Save
                </Button>
            </Form>
        </section>
    )
}