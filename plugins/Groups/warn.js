import { getWarnCount, addWarn, resetWarn, getGroupSettings } from '../../database/config.js';
import { resolveTargetJid, resolvePhoneNumber } from '../../lib/lidResolver.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

const DEV_NUMBER = '255767862457';

export default {
    name: 'warn',
    alias: ['warns', 'warnlist'],
    description: 'Warn a group member',
    run: async (context) => {
        const { client, m, isAdmin, isBotAdmin } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        if (!m.isGroup) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, `⚠️ *WARN*\n━━━━━━━━━━━━━━━━\nGroup only command.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }
        if (!isAdmin) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, `⚠️ *WARN*\n━━━━━━━━━━━━━━━━\nAdmin only.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }

        let rawJid = m.quoted?.sender || m.mentionedJid?.[0];
        if (!rawJid) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, `⚠️ *WARN*\n━━━━━━━━━━━━━━━━\nReply to or mention the rat you wanna warn.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }

        const groupMetadata = await client.groupMetadata(m.chat);
        const participants = groupMetadata.participants;
        const target = resolveTargetJid(rawJid, participants);
        if (!target) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, `⚠️ *WARN*\n━━━━━━━━━━━━━━━━\nCouldn't find that person in this group.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }

        const _targetNum = target.split('@')[0].replace(/\D/g, '');
        const _botNum = (client.user.id.split(':')[0].split('@')[0].replace(/\D/g, ''));
        if (_targetNum === DEV_NUMBER || _targetNum === _botNum) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, `⚠️ *WARN*\n━━━━━━━━━━━━━━━━\nThat command cannot be used on the dev or the bot.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }

        try {
            const gs = await getGroupSettings(m.chat);
            const warnLimit = gs.warn_limit || 3;
            const userNum = target.split('@')[0].split(':')[0];
            const count = await addWarn(m.chat, userNum);

            if (count >= warnLimit) {
                await resetWarn(m.chat, userNum);
                try { await client.groupParticipantsUpdate(m.chat, [target], 'remove'); } catch {}
                await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                return client.sendMessage(m.chat, {
                    text: `📌 *KICKED*\n━━━━━━━━━━━━━━━━\n@${userNum} hit \`${count}/${warnLimit}\` warns.\nBye bye rat 👋\n━━━━━━━━━━━━━━━━\n© bmb tech`,
                    mentions: [target]
                });
            }

            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            return client.sendMessage(m.chat, {
                text: `⚠️ *WARNED*\n━━━━━━━━━━━━━━━━\n@${userNum}\nWarns: \`${count}/${warnLimit}\`\nOne more and it's the door.\n━━━━━━━━━━━━━━━━\n© bmb tech`,
                mentions: [target]
            });
        } catch (error) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, `⚠️ *WARN*\n━━━━━━━━━━━━━━━━\nFailed to warn: ${error.message?.slice(0, 60)}\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }
    }
};
