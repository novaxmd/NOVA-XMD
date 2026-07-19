import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default {
    name: 'clear',
    aliases: ['clearchat', 'wipe'],
    description: 'Clears all messages in a chat from the bot view',
    run: async (context) => {
        await ownerMiddleware(context, async () => {
            const { client, m } = context;

            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
            try {
                await client.clearChatMessages(m.chat, m);
                await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                await sendInteractive(client, m, '📌 *CLEARED*\n━━━━━━━━━━━━━━━━\nChat cleared from my view.\nGone. All of it. 🧹\n━━━━━━━━━━━━━━━━\n© bmb tech');
            } catch (error) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
                await sendInteractive(client, m, '❌ *ERROR*\n━━━━━━━━━━━━━━━━\nCouldn\'t clear this chat.\nTry again, genius.\n━━━━━━━━━━━━━━━━\n© bmb tech');
            }
        });
    }
};
