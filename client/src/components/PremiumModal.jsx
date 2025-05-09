import BaseModal from "@/components/BaseModal";
import {useTranslation} from "react-i18next";

export default function PremiumModal({
                                         isPremium,
                                         confirmLeave,
                                         onClose,
                                         onLeaveClick,
                                         onTogglePremium,
                                     }) {
    const { t } = useTranslation();

    if (isPremium) {
        if (confirmLeave) {
            return (
                <BaseModal
                    title= {t('modalElite')}
                    description= {t('modalEliteDescription')}
                    buttons={[
                        {text: t("yes"), color: "red", onClick: onTogglePremium},
                        {text: t("no"), color: "gray", onClick: onClose},
                    ]}
                />
            );
        } else {
            return (
                <BaseModal
                    title= {t('modalElite')}
                    children={
                        <p
                            className="text-lg text-gray-600 hover:underline cursor-pointer"
                            onClick={onLeaveClick}
                        > {t("leaveElite")} </p>
                    }
                    buttons={[
                        {text: t("close"), color: "gray", onClick: onClose}
                    ]}
                />
            );
        }
    } else {
        return (
            <BaseModal
                title= {t("modalNonElite")}
                description= {t("modalNonEliteDescription")}
                buttons={[
                    {text: t("yes"), color: "green", onClick: onTogglePremium},
                    {text: t("no"), color: "gray", onClick: onClose},
                ]}
            />
        );
    }
}
