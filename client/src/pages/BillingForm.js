import {useState} from 'react';
import {CreditCard, Calendar, Lock, User, ChevronRight} from 'lucide-react';
import { useRouter } from 'next/router';

export default function PaymentGateway() {
    const [formData, setFormData] = useState({
        cardNumber: '',
        expiryDate: '',
        cvc: '',
        name: '',
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleChange = (e) => {
        const {name, value} = e.target;

        if (name === 'cardNumber') {
            const formattedValue = value
                .replace(/\s/g, '')
                .replace(/(\d{4})/g, '$1 ')
                .trim()
                .slice(0, 19);

            setFormData({
                ...formData,
                [name]: formattedValue
            });
            return;
        }

        if (name === 'expiryDate') {
            const cleaned = value.replace(/\D/g, '');
            let formattedValue = cleaned;

            if (cleaned.length > 2) {
                formattedValue = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
            }

            setFormData({
                ...formData,
                [name]: formattedValue
            });
            return;
        }

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const processPayment = () => {
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
        }, 2000);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const { cardNumber, expiryDate, cvc, name } = formData;

        if (!cardNumber || !expiryDate || !cvc || !name) {
            alert("Please complete all fields before proceeding with the payment.");
            return;
        }

        processPayment();
    };

    const cardTypes = {
        visa: /^4/,
        mastercard: /^5[1-5]/,
        amex: /^3[47]/,
    };

    const getCardType = () => {
        const {cardNumber} = formData;
        if (!cardNumber) return null;

        if (cardTypes.visa.test(cardNumber)) return 'Visa';
        if (cardTypes.mastercard.test(cardNumber)) return 'MasterCard';
        if (cardTypes.amex.test(cardNumber)) return 'American Express';

        return null;
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Completed!</h2>
                    <p className="text-gray-600 mb-6">Your purchase has been successfully processed.</p>
                    <button
                        onClick={() => {
                            router.back();
                            setSuccess(false);
                            setFormData({
                                cardNumber: '',
                                expiryDate: '',
                                cvc: '',
                                name: '',
                            });
                        }}
                        className="bg-[#FBAF00] text-gray-800 font-medium py-2 px-4 rounded hover:bg-[#FBAF00] transition-colors cursor-pointer"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-[#FBAF00] p-4 text-gray-800">
                    <h2 className="text-xl font-bold">Secure Payment Gateway</h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="cardNumber">
                            Card Number
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <CreditCard className="h-5 w-5 text-gray-400"/>
                            </div>
                            <input
                                className="w-full pl-10 pr-3 py-2 border text-gray-700 placeholder-gray-400 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FBAF00]"
                                id="cardNumber"
                                name="cardNumber"
                                type="text"
                                placeholder="1234 5678 9012 3456"
                                value={formData.cardNumber}
                                onChange={handleChange}
                                maxLength="19"
                                required
                            />
                            {getCardType() && (
                                <span
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm font-medium text-gray-600">
                                {getCardType()}
                            </span>
                            )}
                        </div>
                    </div>

                    <div className="flex mb-6 space-x-4">
                        <div className="w-1/2">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="expiryDate">
                                Expiry Date
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Calendar className="h-5 w-5 text-gray-400"/>
                                </div>
                                <input
                                    className="w-full pl-10 pr-3 py-2 border text-gray-700 placeholder-gray-400 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FBAF00]"
                                    id="expiryDate"
                                    name="expiryDate"
                                    type="text"
                                    placeholder="MM/YY"
                                    value={formData.expiryDate}
                                    onChange={handleChange}
                                    maxLength="5"
                                    required
                                />
                            </div>
                        </div>

                        <div className="w-1/2">
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="cvc">
                                CVC/CVV
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400"/>
                                </div>
                                <input
                                    className="w-full pl-10 pr-3 py-2 border text-gray-700 placeholder-gray-400 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FBAF00]"
                                    id="cvc"
                                    name="cvc"
                                    type="text"
                                    placeholder="123"
                                    value={formData.cvc}
                                    onChange={handleChange}
                                    maxLength="4"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">
                            Name on Card
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400"/>
                            </div>
                            <input
                                className="w-full pl-10 pr-3 py-2 border text-gray-700 placeholder-gray-400 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FBAF00]"
                                id="name"
                                name="name"
                                type="text"
                                placeholder="John Doe Doe"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-6 flex items-center">
                        <input
                            id="saveInfo"
                            type="checkbox"
                            className="h-4 w-4 text-[#FBAF00] focus:ring-[#FBAF00] border-gray-300 rounded cursor-pointer"
                        />
                        <label htmlFor="saveInfo" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                            Save info for future purchases
                        </label>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="text-sm text-gray-600 hover:underline cursor-pointer "
                        >
                            ← Back
                        </button>
                        <button
                            type="submit"
                            className="bg-[#FBAF00] text-gray-800 font-medium py-2 px-4 rounded hover:bg-[#FBAF00] transition-colors flex items-center cursor-pointer"
                            disabled={loading}
                        >
                            {loading ? (
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-800"
                                     xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                            strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor"
                                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : null}
                            Pay now
                            {!loading && <ChevronRight className="ml-1 h-4 w-4"/>}
                        </button>
                    </div>

                    <div className="mt-6 flex items-center justify-center">
                        <div className="text-center">
                            <div className="flex items-center justify-center space-x-2 mb-2">
                                <Lock className="h-4 w-4 text-green-600"/>
                                <span className="text-sm text-gray-600 font-medium">Secure Payment</span>
                            </div>
                            <div className="flex justify-center space-x-2">
                                <img src="/visa.svg" alt="Visa" className="h-6"/>
                                <img src="/mastercard.svg" alt="MasterCard" className="h-6"/>
                                <img src="/american-express.svg" alt="American Express" className="h-6"/>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}