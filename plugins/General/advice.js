import axios from 'axios';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default {
    name: 'advice',
    aliases: ['tip', 'lifetip', 'suggest'],
    description: 'Get a random piece of life advice',
    run: async (context) => {
        const { client, m } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        try {
            const res = await axios.get('https://api.adviceslip.com/advice', { timeout: 8000 });
            const advice = res.data?.slip?.advice || 'Stop asking for advice and figure it out.';
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
            return sendInteractive(client, m, `📌 *ADVICE*\n━━━━━━━━━━━━━━━━\n💡 ${advice}\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        } catch {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, `📌 *ADVICE*\n━━━━━━━━━━━━━━━━\nMy advice? Try again later.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }
    }
};
