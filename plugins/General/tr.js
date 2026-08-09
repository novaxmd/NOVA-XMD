import { translate } from '@vitalets/google-translate-api';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default {
    name: 'translate',
    aliases: ['trt', 'trans'],
    description: 'Translates text to different languages',
    run: async (context) => {
        const { client, m, prefix } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        const fullText = m.body.replace(new RegExp(`^[^a-zA-Z]*(translate|tr|trans)\\s*`, 'i'), '').trim();

        if (!fullText && !m.quoted?.text) {
            return sendInteractive(client, m, `📌 *TRANSLATE*\n━━━━━━━━━━━━━━━━\nUsage:\n${prefix}tr ja Hello\n${prefix}tr es How are you?\nOr reply to msg: ${prefix}tr en\nCodes: ja es fr de zh ar hi sw ko ru\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }

        let lang, text;

        if (m.quoted?.text) {
            lang = fullText || 'en';
            text = m.quoted.text;
        } else {
            const parts = fullText.split(' ');
            if (parts.length >= 2 && parts[0].length <= 3 && /^[a-z]{2,3}$/.test(parts[0])) {
                lang = parts[0];
                text = parts.slice(1).join(' ');
            } else {
                lang = 'en';
                text = fullText;
            }
        }

        try {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
            const result = await translate(text, { to: lang });
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            await sendInteractive(client, m, `📌 *TRANSLATION*\n━━━━━━━━━━━━━━━━\n${result.text}\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        } catch (error) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            let errorMessage = 'Translation failed. Try again.';
            if (error.message && error.message.includes('Invalid target language')) {
                errorMessage = `Invalid language code "${lang}". Use: ja, es, fr, de, zh, ar, hi, ko, ru, etc.`;
            }
            return sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\n${errorMessage}\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }
    }
};
