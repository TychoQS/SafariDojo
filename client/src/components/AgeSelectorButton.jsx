/*
        USAGE

<AgeSelectorButton
    Age={"Ages"}
    Subject={"Subject"}>
</AgeSelectorButton>
*/



export default function AgeSelectorButton(props) {
    const {Age, BackgroundColor, BorderColor} = props;

    return (
        <button className={"cursor-pointer w-40 h-16 border-6 rounded-2xl text-xl font-black text-black"}
        style={{backgroundColor: BackgroundColor, borderColor: BorderColor}}>
            {Age}
        </button>
    )
}