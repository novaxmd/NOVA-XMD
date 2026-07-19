import axios from 'axios';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default {
    name: 'fact',
    aliases: ['funfact', 'randomfact', 'trivia'],
    description: 'Get a random interesting fact',
    run: async (context) => {
        const { client, m } = context;
        try {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
            const res = await axios.get('https://uselessfacts.jsph.pl/api/v2/facts/random?language=en', { timeout: 8000 });
            const factText = res.data?.text || 'No fact available.';
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            return sendInteractive(client, m, `📌 *RANDOM FACT*\n━━━━━━━━━━━━━━━━\n🧠 ${factText}\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        } catch {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            return sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nFacts took a vacation. Try again.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }
    }
};
