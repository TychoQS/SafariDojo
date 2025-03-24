/*
======================== USAGE ====================
Just call the component giving a text and a subject in this format:
        <SpeechBubble
            Text={"Text to display"}
            Subject={"Related subject"}>
        </SpeechBubble>

======================== EXAMPLE ====================

        <SpeechBubble
            Text={"This is a fun and engaging art game where you need to recognize famous paintings, guess their names,
             and test your knowledge of classic and modern masterpieces. Challenge yourself, discover new artworks,
             and learn interesting facts along the way!"}
            Subject={"Art"}>
        </SpeechBubble>

 */

export default function SpeechBubble(props) {
    const Text = props.Text
    const Subject = props.Subject

    const getBackgroundColorBasedOn = (Subject) => {
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
                return "bg-[#6EF68B]"
            default:
                return ""
        }
    }

    const getBackgroundHexColorBasedOn = (Subject) => {
        switch (Subject) {
            case "Math":
                return "#1BA8E4"
            case "English":
                return "#EFF66E"
            case "Geography":
                return "#ED6EF6"
            case "Art":
                return "#F67C6E"
            case "Science":
                return "#6EF68B"
            default:
                return ""
        }
    }

    return (
        <section id={"BubbleSpeechContainer"} className={"flex"}>
            <section id={"BubbleSpeech"} className={`relative mt-15 border-4  ml-auto mr-auto border-black
                                 flex flex-col justify-end items-end rounded-tr-3xl rounded-tl-3xl rounded-bl-3xl rounded-br-3xl 
                                ${getBackgroundColorBasedOn(Subject)}`}>
                <p id={"BubbleSpeechText"}
                   className="text-xl text-center font-bold color text-black align-baseline w-96 mx-auto p-4">
                    {Text}
                </p>
                <svg id={"BubbleSpeechTail"} viewBox="0 0 200 100"
                     className={"absolute bottom-0 transform rotate-160 translate-y-51 translate-x-32 stroke-3"}>
                    <polygon points="40,60 115,147 96,490" fill={getBackgroundHexColorBasedOn(Subject)} stroke="black"
                             strokeWidth="2.2"/>
                </svg>
            </section>
        </section>
    );
}