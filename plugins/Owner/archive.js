import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, store } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        if (!m?.chat) return;

        if (m.chat.endsWith('@broadcast') || m.chat.endsWith('@newsletter')) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, `📌 *ARCHIVE*\n━━━━━━━━━━━━━━━━\nCannot archive this type of chat.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }

        let lastMessages;
        if (store?.chats?.[m.chat] && Array.isArray(store.chats[m.chat]) && store.chats[m.chat].length) {
            lastMessages = store.chats[m.chat].slice(-1);
        }

        try {
            await client.chatModify(
                {
                    archive: true,
                    lastMessages
                },
                m.chat
            );

            await sendInteractive(client, m, `📌 *ARCHIVED*\n━━━━━━━━━━━━━━━━\nChat archived.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        } catch (err) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            console.error('Archive chat failed:', err);
            await sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nFailed to archive chat.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }
    });
};
