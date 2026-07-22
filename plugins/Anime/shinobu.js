import { getAnime } from '../../lib/toxicApi.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default {
    name: 'shinobu',
    aliases: ['shinobukocho', 'demonslayergirl'],
    description: 'Get a random Shinobu anime image',
    run: async (context) => {
        const { client, m } = context;
        try {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
            const url = await getAnime('shinobu');
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            await client.sendMessage(m.chat, {
                image: { url },
                caption: `📌 *SHINOBU*\n━━━━━━━━━━━━━━━━\n© bmb tech`
            });
        } catch (error) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            await sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nShinobu vanished!\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }
    }
};
