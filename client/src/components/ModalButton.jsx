const ModalButton = ({ text, onClick, color = "gray" }) => {
    const base = "px-4 py-2 rounded-lg transition";
    const colorClass = {
        red: "bg-red-500 text-white hover:bg-red-600",
        gray: "bg-gray-300 text-gray-700 hover:bg-gray-400",
        green: "bg-green-500 text-white hover:bg-green-600"
    }[color];

    return (
        <button onClick={onClick} className={`${base} ${colorClass} cursor-pointer`}>
            {text}
        </button>
    );
};

export default ModalButton;