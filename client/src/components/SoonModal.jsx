import React from "react";
import {useRouter} from "next/router";

const SoonModal = ({onClose}) => {

    const handleOk = () => {
        if (onClose) onClose();
    };

    const baseBtn = "px-4 py-2 rounded-lg transition cursor-pointer mx-2";

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg max-w-md mx-auto text-center">
            <p className="text-lg text-gray-800 font-medium">Oops...</p>
            <p className="text-lg text-gray-800 font-medium">
                This game isn’t ready yet. It’ll be available soon</p>
            <div className="mt-4 flex justify-center">
                <button onClick={handleOk} className={`${baseBtn} bg-gray-300 text-gray-600 hover:bg-gray-400`}>
                    Got it!
                </button>
            </div>
        </div>
    );
};

export default SoonModal;
