import React, { useState, useEffect } from 'react';

const languages = [
    { code: 'en', name: 'EN', flag: '/flags/en.svg' },
    { code: 'es', name: 'ES', flag: '/flags/es.svg' },
    { code: 'fr', name: 'FR', flag: '/flags/fr.svg' },
    { code: 'de', name: 'DE', flag: '/flags/de.svg' },
];

const LanguageSelector = ({ onLanguageChange }) => {
    const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const savedLang = localStorage.getItem('selectedLanguage');
        if (savedLang) {
            const lang = languages.find((l) => l.code === savedLang);
            if (lang) {
                setSelectedLanguage(lang);
            }
        }
    }, []);

    const handleSelectLanguage = (language) => {
        setSelectedLanguage(language);
        setOpen(false);
        localStorage.setItem('selectedLanguage', language.code);
        if (onLanguageChange) {
            onLanguageChange(language.code);
        }
    };

    return (
        <div className="relative inline-block text-left">
            <div>
                <button
                    onClick={() => setOpen(!open)}
                    type="button"
                    className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    <img
                        src={selectedLanguage.flag}
                        alt={selectedLanguage.name}
                        className="w-5 h-5 mr-2"
                    />
                    {selectedLanguage.name}
                    <svg
                        className="-mr-1 ml-2 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.061l-4.24 4.243a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>

            {open && (
                <div className="origin-top-right absolute right-0 mt-2 w-44 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                        {languages.map((language, index) => (
                            <button
                                key={language.code}
                                onClick={() => handleSelectLanguage(language)}
                                className={`flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                                    index !== languages.length - 1 ? 'border-b border-gray-200' : ''
                                }`}
                            >
                                <img
                                    src={language.flag}
                                    alt={language.name}
                                    className="w-5 h-5 mr-2"
                                />
                                {language.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LanguageSelector;
