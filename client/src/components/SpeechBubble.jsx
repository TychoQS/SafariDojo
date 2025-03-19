/*
======================== USAGE ====================
Just call the component giving a text and a subject in this format:
        <SpeechBubble
            Text={"Text to display"}
            Subject={"Related subject"}>
        </SpeechBubble>

======================== EXAMPLE ====================

        <SpeechBubble
            Text={"This is a very funny art game"}
            Subject={"Art"}>
        </SpeechBubble>

 */

export default function SpeechBubble(props) {
    const Text = props.Text
    const Subject = props.Subject

    const getSpeechBubbleOvalBackgroundColor = (Subject) => {
        switch (Subject) {
            case "Math":
                return "bg-[#1BA8E4]"
            case "English":
                return "bg-[#EFF66E]"
            case "Geography":
                return "bg-[#ED6EF6]"
            case "Art":
                return "bg-[#F67C6E]"
            case "Science":
                return "bg-[#Science]"
            default:
            return ""
        }
    }

    const getSpeechBubbleSquareBackgroundColor = (Subject) => {
        switch (Subject) {
            case "Math":
                return "border-[#1BA8E4]"
            case "English":
                return "border-[#EFF66E]"
            case "Geography":
                return "border-[#ED6EF6]"
            case "Art":
                return "border-[#F67C6E]"
            case "Science":
                return "border-[#Science]"
            default:
                return ""
        }
    }

    return (
        <section className={`relative mt-15 border-4 border-black rounded-[90px] mx-auto px-10 py-6 max-w-sm min-h-fit
                            ${getSpeechBubbleOvalBackgroundColor(Subject)}`}>
            <p className="text-center font-bold color text-black align-baseline">
                {Text}
            </p>
            <section className={`absolute top+[45%] right-[0.1rem]
                        border-l-[2.5vh] border-l-transparent
                        border-r-[3vh] border-r-transparent
                        border-t-[8vh] rotate-[-30deg] bg-bl
                        ${getSpeechBubbleSquareBackgroundColor(Subject)}`} >
            </section>
        </section>
    );
}