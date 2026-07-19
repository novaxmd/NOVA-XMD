import { resetWarn, getWarnCount } from '../../database/config.js';
import { resolveTargetJid } from '../../lib/lidResolver.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default {
    name: 'resetwarn',
    alias: ['delwarn', 'clearwarn'],
    description: 'Reset warns for a user',
    run: async (context) => {
        const { client, m, isAdmin, isBotAdmin } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        if (!m.isGroup) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, `⚠️ *RESETWARN*\n━━━━━━━━━━━━━━━━\nGroup only.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }
        if (!isAdmin) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, `⚠️ *RESETWARN*\n━━━━━━━━━━━━━━━━\nAdmin only.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }

        let rawJid = m.quoted?.sender || m.mentionedJid?.[0];
        if (!rawJid) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, `⚠️ *RESETWARN*\n━━━━━━━━━━━━━━━━\nReply or mention the user.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }

        const groupMetadata = await client.groupMetadata(m.chat);
        const participants = groupMetadata.participants;
        const target = resolveTargetJid(rawJid, participants);
        if (!target) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, `⚠️ *RESETWARN*\n━━━━━━━━━━━━━━━━\nCouldn't find that person in this group.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }

        const userNum = target.split('@')[0].split(':')[0];
        await resetWarn(m.chat, userNum);
        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });

        return client.sendMessage(m.chat, {
            text: `⚠️ *RESETWARN*\n━━━━━━━━━━━━━━━━\nWarns cleared for @${userNum} 🧹\n━━━━━━━━━━━━━━━━\n© bmb tech`,
            mentions: [target]
        });
    }
};
