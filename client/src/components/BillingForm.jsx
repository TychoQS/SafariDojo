import React from "react";
import Form from "next/form";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Title from "@/components/Title";

export default function BillingForm() {
    return (
        <section
            className="border-4 rounded-lg m-auto flex flex-col items-center justify-start bg-[#FFDEB6] border-[#FBAF00]
             mb-[-1vh] pt-[10px] pl-[50px] pr-[50px] pb-[30px]">
            <Title level={2} className="mb-4">Billing Information</Title>

            <Form id="BillingForm" className="flex flex-col items-center text-PS-light-black mt-[1.5rem] w-full gap-4">
                <Input
                    size="large"
                    id="CardholderName"
                    label="Cardholder Name"
                    rules={{required: true}}
                    onError={null}
                />

                <Input
                    size="large"
                    id="CardNumber"
                    label="Card Number"
                    rules={{required: true}}
                    onError={null}
                />

                <Input
                    size="large"
                    id="ValidityDate"
                    label="Validity Date"
                    rules={{required: true}}
                    onError={null}
                />

                <Button>Save</Button>
            </Form>
        </section>
    )
}