import { useState } from 'react';
import './RegistrationForm.css';

const CITIES = [
    { value: 'toshkent', label: 'Toshkent shahri' },
    { value: 'samarqand', label: 'Samarqand' },
    { value: 'buxoro', label: 'Buxoro' },
    { value: 'fargona', label: "Farg'ona" },
    { value: 'namangan', label: 'Namangan' },
    { value: 'andijon', label: 'Andijon' },
    { value: 'qashqadaryo', label: 'Qashqadaryo' },
    { value: 'surxondaryo', label: 'Surxondaryo' },
    { value: 'jizzax', label: 'Jizzax' },
    { value: 'sirdaryo', label: 'Sirdaryo' },
    { value: 'navoiy', label: 'Navoiy' },
    { value: 'qoraqalpogiston', label: "Qoraqalpog'iston" },
];

const SUBJECTS = [
    { value: '', label: 'Fanni tanlang' },
    { value: 'matematika', label: 'Matematika' },
    { value: 'fizika', label: 'Fizika' },
    { value: 'kimyo', label: 'Kimyo' },
    { value: 'biologiya', label: 'Biologiya' },
    { value: 'ingliz-tili', label: 'Ingliz tili' },
    { value: 'rus-tili', label: 'Rus tili' },
    { value: 'tarix', label: 'Tarix' },
    { value: 'informatika', label: 'Informatika' },
];

const RegistrationForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        city: '',
        phone: '',
        subject: '',
    });

    const [showWarning, setShowWarning] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [errors, setErrors] = useState({});

    const formatPhoneNumber = (value) => {
        // Remove all non-digit characters
        const digits = value.replace(/\D/g, '');

        // Start with +998
        let formatted = '+998';

        // Add the rest of the digits with proper spacing
        if (digits.length > 3) {
            const remaining = digits.slice(3);
            if (remaining.length > 0) formatted += ' ' + remaining.slice(0, 2);
            if (remaining.length > 2) formatted += ' ' + remaining.slice(2, 5);
            if (remaining.length > 5) formatted += ' ' + remaining.slice(5, 7);
            if (remaining.length > 7) formatted += ' ' + remaining.slice(7, 9);
        }

        return formatted;
    };

    const handlePhoneChange = (e) => {
        const formatted = formatPhoneNumber(e.target.value);
        setFormData({ ...formData, phone: formatted });

        if (errors.phone) {
            setErrors({ ...errors, phone: '' });
        }
    };

    const handleCityChange = (e) => {
        const city = e.target.value;
        setFormData({ ...formData, city });

        if (city && city !== 'toshkent') {
            setShowWarning(true);
        } else {
            setShowWarning(false);
        }

        if (errors.city) {
            setErrors({ ...errors, city: '' });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Ism kiritish majburiy';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Ism kamida 2 ta belgidan iborat bo\'lishi kerak';
        }

        if (!formData.city) {
            newErrors.city = 'Yashash manzilini tanlang';
        }

        // Check if phone number is complete (+998 XX XXX XX XX = 17 characters with spaces)
        if (!formData.phone || formData.phone.length < 17) {
            newErrors.phone = 'To\'liq telefon raqamini kiriting';
        }

        if (!formData.subject) {
            newErrors.subject = 'Fan tanlang';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            console.log('Form submitted:', formData);
            setShowSuccess(true);

            // Reset form after 3 seconds
            setTimeout(() => {
                setFormData({
                    name: '',
                    city: '',
                    phone: '',
                    subject: '',
                });
                setShowSuccess(false);
                setShowWarning(false);
            }, 3000);
        }
    };

    return (
        <div className="form-container">
            <div className="form-header">
                <h1 className="form-title">Ro'yxatdan o'tish</h1>
                <p className="form-subtitle">
                    Gradatsiya o'quv markazida o'qishni boshlash uchun quyidagi ma'lumotlarni to'ldiring
                </p>
            </div>

            {showWarning && (
                <div className="alert alert-warning">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    <div>
                        <strong>Diqqat!</strong> Bizning kurslarimiz faqat Toshkent shahrida offline tarzda o'tiladi.
                    </div>
                </div>
            )}

            {showSuccess && (
                <div className="alert alert-success">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <div>
                        <strong>Muvaffaqiyatli!</strong> Arizangiz qabul qilindi. Tez orada siz bilan bog'lanamiz.
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="registration-form">
                <div className="form-group">
                    <label htmlFor="name" className="form-label">
                        Ism
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className={`form-input ${errors.name ? 'error' : ''}`}
                        placeholder="Ismingizni kiriting"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="city" className="form-label">
                        Yashash manzili
                    </label>
                    <select
                        id="city"
                        name="city"
                        className={`form-select ${errors.city ? 'error' : ''}`}
                        value={formData.city}
                        onChange={handleCityChange}
                    >
                        <option value="">Shaharni tanlang</option>
                        {CITIES.map((city) => (
                            <option key={city.value} value={city.value}>
                                {city.label}
                            </option>
                        ))}
                    </select>
                    {errors.city && <span className="error-message">{errors.city}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="phone" className="form-label">
                        Telefon raqam
                    </label>
                    <input
                        type="text"
                        id="phone"
                        name="phone"
                        className={`form-input ${errors.phone ? 'error' : ''}`}
                        placeholder="+998 XX XXX XX XX"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        maxLength="17"
                    />
                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="subject" className="form-label">
                        Fan
                    </label>
                    <select
                        id="subject"
                        name="subject"
                        className={`form-select ${errors.subject ? 'error' : ''}`}
                        value={formData.subject}
                        onChange={handleChange}
                    >
                        {SUBJECTS.map((subject) => (
                            <option key={subject.value} value={subject.value}>
                                {subject.label}
                            </option>
                        ))}
                    </select>
                    {errors.subject && <span className="error-message">{errors.subject}</span>}
                </div>

                <button type="submit" className="btn btn-primary submit-button">
                    <span>Ro'yxatdan o'tish</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </button>
            </form>
        </div>
    );
};

export default RegistrationForm;
