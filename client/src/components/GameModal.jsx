import React from "react";
import { useRouter } from "next/router";
import {useTranslation} from "react-i18next";

const GameModal = ({ mode = "registrado", navigateTo = {}, onClose }) => {
    const router = useRouter();
    const {t } = useTranslation();

    const messages = {
        premium: t('modal.premiumGame'),
        registrado: t('modal.registerGame')
    };

    const handleYes = () => {
        router.push(navigateTo).then();
    };

    const handleNo = () => {
        if (onClose) onClose();
    };

    const baseBtn = "px-4 py-2 rounded-lg transition cursor-pointer mx-2";

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg max-w-md mx-auto text-center">
            <p className="text-lg text-gray-800 font-medium">{messages[mode]}</p>
            <div className="mt-4 flex justify-center">
                <button onClick={handleYes} className={`${baseBtn} bg-green-500 text-gray hover:bg-green-600`}>
                    {t('yes')}
                </button>
                <button onClick={handleNo} className={`${baseBtn} bg-gray-300 text-gray-600 hover:bg-gray-400`}>
                    {t('no')}
                </button>
            </div>
        </div>
    );
};

export default GameModal;
