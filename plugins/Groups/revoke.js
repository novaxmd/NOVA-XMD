import middleware from '../../utils/botUtil/middleware.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default async (context) => {
    await middleware(context, async () => {
        const { client, m, groupMetadata } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        try {
            await client.groupRevokeInvite(m.chat);
            const newCode = await client.groupInviteCode(m.chat);
            const newLink = `https://chat.whatsapp.com/${newCode}`;
            const dmJid = typeof m.sender === 'string' && m.sender.endsWith('@s.whatsapp.net') ? m.sender : null;
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            if (dmJid) {
                await sendInteractive(client, m, `📌 *REVOKED*\n━━━━━━━━━━━━━━━━\nGroup link revoked!\nNew link sent to your DM.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
                await client.sendMessage(dmJid, {
                    text: `📌 *NEW LINK*\n━━━━━━━━━━━━━━━━\n${newLink}\nNew group link for ${groupMetadata?.subject || m.chat}\n━━━━━━━━━━━━━━━━\n© bmb tech`
                });
            } else {
                await sendInteractive(client, m, `📌 *REVOKED*\n━━━━━━━━━━━━━━━━\nGroup link revoked!\nNew link: ${newLink}\n━━━━━━━━━━━━━━━━\n© bmb tech`);
            }
        } catch (e) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            await sendInteractive(client, m, `│ Failed to revoke link: ${e.message?.slice(0, 60)}\n╰───────────────\n> ©BMB TECH`);
        }
    });
};
