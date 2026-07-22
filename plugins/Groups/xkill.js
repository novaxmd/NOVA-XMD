import middleware from '../../utils/botUtil/middleware.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default async (context) => {
    await middleware(context, async () => {
        const { client, m, isBotAdmin } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        if (!m.isGroup) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, `📌 *XKILL*\n━━━━━━━━━━━━━━━━\nThis command is meant for groups.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }
        if (!isBotAdmin) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, `📌 *XKILL*\n━━━━━━━━━━━━━━━━\nI need admin privileges.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }

        const normalizeJid = (jid) => {
            if (!jid) return '';
            return jid.split('@')[0].split(':')[0].replace(/\D/g, '') + '@s.whatsapp.net';
        };

        const resolveParticipantJid = (p) => {
            if (p.pn) return String(p.pn).replace(/\D/g, '') + '@s.whatsapp.net';
            const base = p.jid || p.id || '';
            if (base && !base.endsWith('@lid')) return normalizeJid(base);
            if (globalThis.resolvePhoneFromLid) {
                const phone = globalThis.resolvePhoneFromLid(base);
                if (phone && !phone.endsWith('@lid')) return normalizeJid(phone);
            }
            if (globalThis.lidPhoneCache) {
                const lidNum = base.split('@')[0].split(':')[0].replace(/\D/g, '');
                const cached = globalThis.lidPhoneCache.get(lidNum);
                if (cached) return String(cached).replace(/\D/g, '') + '@s.whatsapp.net';
            }
            return normalizeJid(base);
        };

        const groupMetadata = await client.groupMetadata(m.chat);
        const participants = groupMetadata.participants;
        const botJid = normalizeJid(client.user.id);
        const senderJid = normalizeJid(m.sender);

        const usersToKick = participants.filter(p => {
            const pJid = resolveParticipantJid(p);
            return pJid !== botJid && pJid !== senderJid;
        });

        await client.sendMessage(m.chat, { react: { text: '⚠️', key: m.reactKey } });
        await sendInteractive(client, m, `📌 *TERMINATION*\n━━━━━━━━━━━━━━━━\nGROUP TERMINATION INITIATED\nRemoving ${usersToKick.length} participants.\nThe group will be renamed.\nTHIS PROCESS CANNOT BE STOPPED.\n━━━━━━━━━━━━━━━━\n© bmb tech`);

        try { await client.groupUpdateSubject(m.chat, "Proven Useless🦄🚮"); } catch (e) {}
        try { await client.groupUpdateDescription(m.chat, "Terminated by Tσxιƈ-ɱԃȥ\n\nA collection of digital disappointments. Your contributions were as valuable as your existence—negligible."); } catch (e) {}
        try { await client.groupRevokeInvite(m.chat); } catch (e) {}
        try { await client.groupSettingUpdate(m.chat, 'announcement'); } catch (e) {}

        for (const p of usersToKick) {
            try {
                const jid = resolveParticipantJid(p);
                await client.groupParticipantsUpdate(m.chat, [jid], 'remove');
                await new Promise(res => setTimeout(res, 500));
            } catch (e) {}
        }

        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
        await sendInteractive(client, m, `📌 *COMPLETE*\n━━━━━━━━━━━━━━━━\nTERMINATION COMPLETE\nAll participants removed.\nGroup secured.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
    });
};
