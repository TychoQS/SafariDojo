import Form from "next/form";

export default function BillingForm() {
    return (
        <section className={"w-115 h-110 border-4 rounded-lg m-auto flex flex-col items-center " +
            "justify-center bg-[#FFDEB6] border-[#FBAF00]"}>
            <h1 className={"text-transparent bg-clip-text bg-gradient-to-b from-[#FFDEB6] to-[#FBAF00]"}>
                Billing information
            </h1>
            <Form id={"BillingForm"} className={"flex flex-col items-center text-[#372E55]"}>
                <label htmlFor={"CardholderName"}>Cardholder name</label>
                <input id={"CardholderName"} className={"border-b-8 border-2 rounded-xl border-[#372E55]"}/>
                <label htmlFor={"CardNumber"}>Card number</label>
                <input id={"CardNumber"} className={"border-b-8 border-2 rounded-xl border-[#372E55]"}/>
                <label htmlFor={"ValidityDate"}>Validity Date</label>
                <input id={"ValidityDate"} className={"border-b-8 border-2 rounded-xl border-[#372E55]"}/>
            </Form>
        </section>
    )
}