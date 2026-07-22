import axios from 'axios';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default {
    name: 'shorten',
    aliases: ['shorturl', 'tinyurl', 'shrinkurl'],
    description: 'Shorten a URL',
    run: async (context) => {
        const { client, m, text } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        const url = (text || '').trim();
        if (!url || !url.startsWith('http')) {
            return sendInteractive(client, m, `📤 *URL SHORTENER*\n━━━━━━━━━━━━━━━━\nGive me a valid URL to shorten.\nUsage: .shorten https://example.com/very/long/url\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }
        try {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
            const res = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`, { timeout: 8000 });
            const short = res.data;
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            return sendInteractive(client, m, `📤 *URL SHORTENER*\n━━━━━━━━━━━━━━━━\n🔗 Original: ${url.slice(0,60)}${url.length>60?'...':''}\n✅ Shortened: ${short}\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        } catch {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            return sendInteractive(client, m, `📤 *URL SHORTENER*\n━━━━━━━━━━━━━━━━\nCouldn't shorten that. It stays long.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }
    }
};
