import BaseModal from "@/components/BaseModal";

export default function PremiumModal({
                                         isPremium,
                                         confirmLeave,
                                         onClose,
                                         onLeaveClick,
                                         onTogglePremium,
                                     }) {
    if (isPremium) {
        if (confirmLeave) {
            return (
                <BaseModal
                    title="You belong to the elite!"
                    description="Are you sure? You will lose all your elite advantages."
                    buttons={[
                        {text: "Yes", color: "red", onClick: onTogglePremium},
                        {text: "No", color: "gray", onClick: onClose},
                    ]}
                />
            );
        } else {
            return (
                <BaseModal
                    title="You belong to the elite!"
                    children={
                        <p
                            className="text-lg text-gray-600 hover:underline cursor-pointer"
                            onClick={onLeaveClick}
                        > Leave the elite. </p>
                    }
                    buttons={[
                        {text: "Close", color: "gray", onClick: onClose}
                    ]}
                />
            );
        }
    } else {
        return (
            <BaseModal
                title="Do you want to join the elite?"
                description="The subscription price is €14.99 per month."
                buttons={[
                    {text: "Yes", color: "green", onClick: onTogglePremium},
                    {text: "No", color: "gray", onClick: onClose},
                ]}
            />
        );
    }
}
