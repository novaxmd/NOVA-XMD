import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

const toBlockJid = (jid) => {
    if (!jid) return null;
    const user = jid.split('@')[0].split(':')[0].replace(/\D/g, '');
    if (!user) return null;
    return user + '@s.whatsapp.net';
};

const resolveLid = (jid) => {
    if (!jid || !jid.endsWith('@lid')) return jid;
    if (globalThis.resolvePhoneFromLid) {
        const phone = globalThis.resolvePhoneFromLid(jid);
        if (phone && !phone.endsWith('@lid')) return phone;
    }
    if (globalThis.lidPhoneCache) {
        const lidNum = jid.split('@')[0].split(':')[0].replace(/\D/g, '');
        const cached = globalThis.lidPhoneCache.get(lidNum);
        if (cached) return String(cached).replace(/\D/g, '') + '@s.whatsapp.net';
    }
    return jid;
};

export default async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, text } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        if (!m.quoted && (!m.mentionedJid || m.mentionedJid.length === 0) && !text) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, `🚫 *UNBLOCK*\n━━━━━━━━━━━━━━━━\nTag or reply to a user to unblock.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }

        const rawJid = m.mentionedJid?.[0] || m.quoted?.sender || text;
        const raw = resolveLid(rawJid);
        const users = toBlockJid(raw);

        if (!users) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, `🚫 *UNBLOCK*\n━━━━━━━━━━━━━━━━\nCouldn't resolve that user's JID. 😤\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }

        const parts = users.split('@')[0];

        try {
            await client.updateBlockStatus(users, 'unblock');
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            await sendInteractive(client, m, `🚫 *UNBLOCKED*\n━━━━━━━━━━━━━━━━\n${parts} is unblocked. Don't make\nme regret this.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        } catch (e) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            await sendInteractive(client, m, `🚫 *UNBLOCK*\n━━━━━━━━━━━━━━━━\nFailed to unblock ${parts}. 😒\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }
    });
};
