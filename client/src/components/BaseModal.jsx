import ModalButton from "@/components/ModalButton";

export default function BaseModal({
                                      title,
                                      description,
                                      buttons = [],
                                      children,
                                      onClose
                                  }) {
    const buttonElements = buttons.length > 0
        ? buttons
        : [{ text: "Close", color: "gray", onClick: onClose }];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/20">
            <div className="bg-white p-6 rounded-2xl shadow-2xl w-[90%] max-w-md text-center space-y-4 animate-fade-in">
                {title && <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>}
                {description && <p className="text-lg text-gray-600">{description}</p>}
                {children}

                <div className={`flex justify-center ${buttonElements.length > 1 ? "gap-4" : ""}`}>
                    {buttonElements.map((btn, i) => (
                        <ModalButton
                            key={i}
                            text={btn.text}
                            color={btn.color}
                            onClick={btn.onClick}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
