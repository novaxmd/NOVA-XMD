import { getAnime } from '../../lib/toxicApi.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default {
    name: 'waifu',
    aliases: ['animegirl', 'waifupic'],
    description: 'Get a random waifu image',
    run: async (context) => {
        const { client, m } = context;
        try {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
            const url = await getAnime('waifu');
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            await client.sendMessage(m.chat, {
                image: { url },
                caption: `📌 *WAIFU*\n━━━━━━━━━━━━━━━━\n© bmb tech`
            });
        } catch (error) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            await sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nWaifu ran away!\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }
    }
};
