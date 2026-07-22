import middleware from '../../utils/botUtil/middleware.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default {
    name: 'pin',
    aliases: ['pinmsg', 'unpin'],
    description: 'Pin or unpin a message in a group',
    run: async (context) => {
        await middleware(context, async () => {
            const { client, m, args } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

            if (!m.quoted) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                return sendInteractive(client, m, '📌 *PIN*\n━━━━━━━━━━━━━━━━\nQuote a message to pin it,\nyou absolute muppet.\n━━━━━━━━━━━━━━━━\n© bmb tech');
            }

            const isUnpin = (args[0] || '').toLowerCase() === 'unpin';

            const messageKey = {
                id: m.quoted.id,
                remoteJid: m.chat,
                participant: m.quoted.sender
            };

            try {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
                await client.pinMessage(m.chat, messageKey, isUnpin ? 0 : 1);
                await sendInteractive(client, m, `📌 *${isUnpin ? 'UNPINNED' : 'PINNED'}*\n━━━━━━━━━━━━━━━━\nMessage ${isUnpin ? 'unpinned' : 'pinned'} successfully.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
            } catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                console.error('[PIN ERROR]', error?.message || error);
                const msg = error?.message || String(error);
                const isAuth = msg.includes('forbidden') || msg.includes('not-authorized') || msg.includes('403');
                if (isAuth) {
                    await sendInteractive(client, m, '❌ *ERROR*\n━━━━━━━━━━━━━━━━\nFailed to pin. Make sure I\'m admin.\n━━━━━━━━━━━━━━━━\n© bmb tech');
                } else {
                    await sendInteractive(client, m, '❌ *ERROR*\n━━━━━━━━━━━━━━━━\nPin failed: ' + msg.slice(0, 80) + '\n━━━━━━━━━━━━━━━━\n© bmb tech');
                }
            }
        });
    }
};
