import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        try {
            const blocked = await client.fetchBlocklist();
            if (!blocked || blocked.length === 0) {
                await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                return sendInteractive(client, m, `🚫 *BLOCK LIST*\n━━━━━━━━━━━━━━━━\nNo blocked contacts. Clean slate!\n━━━━━━━━━━━━━━━━\n© bmb tech`);
            }
            const list = blocked.map((jid, i) => `│ ${i + 1}. +${jid.split('@')[0]}`).join('\n');
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            return sendInteractive(client, m, `🚫 *BLOCK LIST*\n━━━━━━━━━━━━━━━━\nBlocked (${blocked.length}):\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        } catch (e) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, `│ Failed to fetch blocklist: ${e.message?.slice(0, 60)}\n╰───────────────\n> ©BMB TECH`);
        }
    });
};
