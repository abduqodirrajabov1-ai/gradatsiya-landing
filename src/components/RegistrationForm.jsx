import { useState, useEffect } from 'react';
import './RegistrationForm.css';
import { sendToTelegram } from '../services/telegram';

const CITIES = [
    { value: 'toshkent', label: 'Toshkent shahri' },
    { value: 'another', label: 'Boshqa shaharlar' },
];

// Subject is fixed to Chinese
const SUBJECT_LABEL = 'Xitoy tili';

const RegistrationForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        city: '',
        phone: '',
        subject: 'chinese', // Default fixed subject
    });

    const [showWarning, setShowWarning] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [telegramSent, setTelegramSent] = useState(null); // null, true, or false
    const [errors, setErrors] = useState({});
    const [shouldRemind, setShouldRemind] = useState(false);

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

    // 15-second reminder system
    useEffect(() => {
        const reminderInterval = setInterval(() => {
            // Check if form is empty or partially filled but not submitted
            if (!showSuccess && !isLoading) {
                setShouldRemind(true);

                // Change page title
                const originalTitle = document.title;
                document.title = "⏰ Formani to'ldiring!";

                // Focus on first input
                const nameInput = document.getElementById('name');
                if (nameInput && !formData.name) {
                    nameInput.focus();
                }

                // Reset after 3 seconds
                setTimeout(() => {
                    setShouldRemind(false);
                    document.title = originalTitle;
                }, 3000);
            }
        }, 15000); // Every 15 seconds

        return () => clearInterval(reminderInterval);
    }, [formData, showSuccess, isLoading]);

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
            // Reset previous messages when starting new submission
            setShowSuccess(false);
            setTelegramSent(null);
            setIsLoading(true); // Start loading
            // Get labels for display
            const cityLabel = CITIES.find(c => c.value === formData.city)?.label || formData.city;

            // Send to Telegram
            const telegramData = {
                name: formData.name,
                cityLabel,
                phone: formData.phone,
                subjectLabel: SUBJECT_LABEL,
            };

            // Send notification to Telegram and track result
            sendToTelegram(telegramData).then(result => {
                setIsLoading(false); // Stop loading

                if (result.success) {
                    console.log('Telegram notification sent successfully');
                    setTelegramSent(true);
                } else {
                    console.error('Failed to send Telegram notification:', result.error);
                    setTelegramSent(false);
                }
            });

            console.log('Form submitted:', formData);
            setShowSuccess(true);

            // Don't auto-reset - let message stay until next submission
        }
    };

    return (
        <div className="form-container">
            <div className="form-header">
                <h1 className="form-title">Ro'yxatdan o'tish</h1>
                <p className="form-subtitle">
                    Phoenix o'quv markazida Xitoy tilini o'rganishni boshlash uchun ma'lumotlarni to'ldiring
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

            {showSuccess && telegramSent === true && (
                <div className="alert alert-success">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <div>
                        <strong>✅ Muvaffaqiyatli yuborildi!</strong> Arizangiz qabul qilindi. Tez orada siz bilan bog'lanamiz.
                        <br /><br />
                        <strong>Agar kutishni xohlamasangiz, hoziroq qo'ng'iroq qiling:</strong>
                        <br />
                        <a href="tel:+998903985050" style={{ color: '#065F46', fontWeight: 'bold', fontSize: '1.1em' }}>📞 +998 90 398 50 50</a>
                    </div>
                </div>
            )}

            {showSuccess && telegramSent === false && (
                <div className="alert alert-warning">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    <div>
                        <strong>⚠️ Xabar yuborilmadi!</strong> Arizangiz saqlandi, lekin xabar yuborishda xatolik yuz berdi.
                        <br /><br />
                        <strong>Iltimos, hoziroq qo'ng'iroq qiling:</strong>
                        <br />
                        <a href="tel:+998903985050" style={{ color: '#92400E', fontWeight: 'bold', fontSize: '1.1em' }}>📞 +998 90 398 50 50</a>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className={`registration-form ${shouldRemind ? 'remind-pulse' : ''}`}>
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
                    <label className="form-label">
                        Fan
                    </label>
                    <input
                        type="text"
                        className="form-input"
                        value="Xitoy tili"
                        disabled
                        style={{ backgroundColor: 'rgba(234, 88, 12, 0.1)', color: 'var(--color-primary)', fontWeight: 'bold' }}
                    />
                </div>

                <button type="submit" className="btn btn-primary submit-button" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <svg className="loading-spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" opacity="0.25"></circle>
                                <path d="M12 2 A10 10 0 0 1 22 12" strokeLinecap="round"></path>
                            </svg>
                            <span>Yuborilmoqda...</span>
                        </>
                    ) : (
                        <>
                            <span>Ro'yxatdan o'tish</span>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default RegistrationForm;
