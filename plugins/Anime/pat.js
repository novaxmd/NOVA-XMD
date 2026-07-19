import { getAnime } from '../../lib/toxicApi.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default {
    name: 'pat',
    aliases: ['headpat', 'animepat'],
    description: 'Send a headpat anime gif',
    run: async (context) => {
        const { client, m } = context;
        try {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
            const url = await getAnime('pat');
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            await client.sendMessage(m.chat, {
                image: { url },
                caption: `📌 *PAT*\n━━━━━━━━━━━━━━━━\n© bmb tech`
            });
        } catch (error) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            await sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nNo pats available!\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }
    }
};
