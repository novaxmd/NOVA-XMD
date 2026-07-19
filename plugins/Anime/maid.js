import { getAnime } from '../../lib/toxicApi.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default {
    name: 'maid',
    aliases: ['animemaid', 'maidpic'],
    description: 'Get a random anime maid image',
    run: async (context) => {
        const { client, m } = context;
        try {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
            const url = await getAnime('maid');
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            await client.sendMessage(m.chat, {
                image: { url },
                caption: `📌 *MAID*\n━━━━━━━━━━━━━━━━\n© bmb tech`
            });
        } catch (error) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            await sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nMaid is busy!\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }
    }
};
