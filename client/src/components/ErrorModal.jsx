import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, AlertCircle, Send, Flag } from 'lucide-react';

export default function ErrorReportModal() {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        severityLevel: 'medium',
        screenshots: false,
        browser: '',
        contactEmail: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => {
        setIsOpen(false);
        setSubmitted(false);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Reporte enviado:', formData);
        setSubmitted(true);

        setTimeout(() => {
            setFormData({
                title: '',
                description: '',
                severityLevel: 'medium',
                screenshots: false,
                browser: '',
                contactEmail: '',
            });
        }, 500);
    };

    return (
        <div className="font-sans">
            <button
                onClick={handleOpen}
                className="flex items-center justify-center hover:bg-amber-50 text-PS-dark-yellow p-2 rounded-md transition-colors duration-200"
                title={t('report_error_button_title')}
            >
                <Flag size={30} />
            </button>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/20">
                    <div className="bg-white rounded-lg w-full max-w-md mx-4 shadow-xl relative overflow-hidden">
                        <div className="bg-gray-100 px-6 py-4 flex justify-between items-center border-b">
                            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <AlertCircle size={20} className="text-PS-dark-yellow" />
                                {t('report_error_title')}
                            </h2>
                            <button
                                onClick={handleClose}
                                className="text-gray-500 hover:text-gray-800 rounded-full p-1 hover:bg-gray-200 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6">
                            {!submitted ? (
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                            {t('title_label')} *
                                        </label>
                                        <input
                                            type="text"
                                            id="title"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-PS-dark-yellow placeholder-gray-500"
                                            placeholder={t('title_placeholder')}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                            {t('description_label')} *
                                        </label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows="4"
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-PS-dark-yellow placeholder-gray-500"
                                            placeholder={t('description_placeholder')}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="severityLevel" className="block text-sm font-medium text-gray-700 mb-1">
                                            {t('severity_label')}
                                        </label>
                                        <select
                                            id="severityLevel"
                                            name="severityLevel"
                                            value={formData.severityLevel}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-PS-dark-yellow"
                                        >
                                            <option value="low">{t('severity_low')}</option>
                                            <option value="medium">{t('severity_medium')}</option>
                                            <option value="high">{t('severity_high')}</option>
                                            <option value="critical">{t('severity_critical')}</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="browser" className="block text-sm font-medium text-gray-700 mb-1">
                                            {t('browser_label')}
                                        </label>
                                        <input
                                            type="text"
                                            id="browser"
                                            name="browser"
                                            value={formData.browser}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-PS-dark-yellow placeholder-gray-500"
                                            placeholder={t('browser_placeholder')}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                                            {t('contact_email_label')}
                                        </label>
                                        <input
                                            type="email"
                                            id="contactEmail"
                                            name="contactEmail"
                                            value={formData.contactEmail}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-PS-dark-yellow placeholder-gray-500"
                                            placeholder={t('contact_email_placeholder')}
                                        />
                                    </div>

                                    {/* Pie del formulario */}
                                    <div className="mt-6 flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={handleClose}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-structural-100 hover:bg-gray-200 rounded-md transition-colors"
                                        >
                                            {t('cancel_button')}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleSubmit}
                                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-PS-dark-yellow hover:bg-amber-700 rounded-md transition-colors"
                                        >
                                            <Send size={16} />
                                            {t('submit_button')}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <div className="mb-4 flex justify-center">
                                        <div className="bg-green-100 text-green-600 p-3 rounded-full">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-8 w-8"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">{t('success_title')}</h3>
                                    <p className="text-gray-600 mb-6">{t('success_message')}</p>
                                    <button
                                        onClick={handleClose}
                                        className="px-4 py-2 bg-PS-dark-yellow text-white rounded-md hover:bg-amber-700 transition-colors"
                                    >
                                        {t('close')}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}