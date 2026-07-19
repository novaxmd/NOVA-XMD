import axios from 'axios';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default {
    name: 'catfact',
    aliases: ['catfacts', 'meowfact'],
    description: 'Get a random cat fact',
    run: async (context) => {
        const { client, m } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        try {
            const res = await axios.get('https://catfact.ninja/fact', { timeout: 8000 });
            const f = res.data?.fact || 'Cats are superior. That\'s the only fact.';
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
            return sendInteractive(client, m, `📌 *CAT FACT*\n━━━━━━━━━━━━━━━━\n🐱 ${f}\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        } catch {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, `📌 *CAT FACT*\n━━━━━━━━━━━━━━━━\nEven the cats won't talk to me right now.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }
    }
};
