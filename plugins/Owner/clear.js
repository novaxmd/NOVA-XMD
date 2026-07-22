import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, store } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        if (!m?.chat) return;

        if (m.chat.endsWith('@broadcast') || m.chat.endsWith('@newsletter')) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, `📌 *CLEAR*\n━━━━━━━━━━━━━━━━\nCannot clear this type of chat.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }

        try {
            let lastMessages;
            if (store?.chats?.[m.chat] && Array.isArray(store.chats[m.chat]) && store.chats[m.chat].length) {
                lastMessages = store.chats[m.chat].slice(-1);
            }

            await client.chatModify({ delete: true, lastMessages }, m.chat);
            await sendInteractive(client, m, '📌 *CLEARED*\n━━━━━━━━━━━━━━━━\nChat cleared.\n━━━━━━━━━━━━━━━━\n© bmb tech');
        } catch (err) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            if (err?.message?.includes('myAppStateKey') || err?.output?.statusCode === 404) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                return sendInteractive(client, m, '📌 *NOT READY*\n━━━━━━━━━━━━━━━━\nApp state not fully synced yet.\nWait a minute then try again.\n━━━━━━━━━━━━━━━━\n© bmb tech');
            }
            await sendInteractive(client, m, '❌ *ERROR*\n━━━━━━━━━━━━━━━━\nFailed to clear chat.\n━━━━━━━━━━━━━━━━\n© bmb tech');
        }
    });
};
