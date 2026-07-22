import { getAnime } from '../../lib/toxicApi.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default {
    name: 'kitsune',
    aliases: ['foxgirl', 'kitsuneani'],
    description: 'Get a random kitsune (fox girl) anime image',
    run: async (context) => {
        const { client, m } = context;
        try {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
            const url = await getAnime('kitsune');
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            await client.sendMessage(m.chat, {
                image: { url },
                caption: `📌 *KITSUNE*\n━━━━━━━━━━━━━━━━\n© bmb tech`
            });
        } catch (error) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            await sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nKitsune escaped!\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }
    }
};
