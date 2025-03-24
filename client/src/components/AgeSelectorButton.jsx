/*
        USAGE

<AgeSelectorButton
    Text={"Ages"}
    Subject={"Subject"}>
</AgeSelectorButton>
*/



export default function AgeSelectorButton(props) {
    const {Age, Subject} = props;

    const getColor = {
        "Math": "hover:bg-[#1BA8E4] hover:border-[#9BD6EF] bg-[#9BD6EF] border-[#1BA8E4]",
        "English": "hover:bg-[#EFF66E] hover:border-[#FDFFCE] bg-[#FDFFCE] border-[#EFF66E]",
        "Geography": "hover:bg-[#ED6EF6] hover:border-[#E8B1EC] bg-[#E8B1EC] border-[#ED6EF6]",
        "Art": "hover:bg-[#F67C6E] hover:border-[#F2C1BB] bg-[#F2C1BB] border-[#F67C6E]",
        "Science": "hover:bg-[#6EF68B] hover:border-[#C9F1D2] bg-[#C9F1D2] border-[#6EF68B]"
    };

    return (
        <button className={"cursor-pointer w-48 h-16 border-4 rounded-lg text-black " +
            `${getColor[Subject]}`}>
            {Age}
        </button>
    )
}