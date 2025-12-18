const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

export const sendToTelegram = async (formData) => {
    try {
        // Format message with better structure
        const message = `
🎓 <b>YANGI RO'YXATDAN O'TISH</b>
━━━━━━━━━━━━━━━━━━━━

👤 <b>Ism:</b> ${formData.name}
📍 <b>Manzil:</b> ${formData.cityLabel}
📱 <b>Telefon:</b> ${formData.phone}
📚 <b>Fan:</b> ${formData.subjectLabel}

━━━━━━━━━━━━━━━━━━━━
⏰ <i>${new Date().toLocaleString('uz-UZ', {
            timeZone: 'Asia/Tashkent',
            dateStyle: 'short',
            timeStyle: 'short'
        })}</i>
    `.trim();

        // Create interactive inline keyboard
        const keyboard = {
            inline_keyboard: [
                [
                    {
                        text: '✅ Tasdiqlash',
                        callback_data: `confirm_${Date.now()}`
                    }
                ]
            ]
        };

        const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'HTML',
                reply_markup: keyboard,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.description || 'Telegram API error');
        }

        return { success: true, data };
    } catch (error) {
        console.error('Telegram notification error:', error);
        // Don't throw - we don't want to break the user experience if Telegram fails
        return { success: false, error: error.message };
    }
};
