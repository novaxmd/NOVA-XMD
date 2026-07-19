import middleware from '../../utils/botUtil/middleware.js';
import { resolveTargetJid } from '../../lib/lidResolver.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

const DEV_NUMBER = '255767862457';

export default {
    name: 'promote',
    aliases: ['makeadmin', 'addadmin', 'promoteuser'],
    description: 'Promotes a user to admin in a group',
    run: async (context) => {
        await middleware(context, async () => {
            const { client, m, prefix } = context;
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

            const groupMetadata = await client.groupMetadata(m.chat);
            const participants = groupMetadata.participants;

            let rawJid = null;
            if (m.quoted?.sender) {
                rawJid = m.quoted.sender;
            } else if (m.mentionedJid && m.mentionedJid.length > 0) {
                rawJid = m.mentionedJid[0];
            }

            if (!rawJid) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                return sendInteractive(client, m, `📌 *USAGE*\n━━━━━━━━━━━━━━━━\nMention or quote a user.\nExample: ${prefix}promote @user\n━━━━━━━━━━━━━━━━\n© bmb tech`);
            }

            const target = resolveTargetJid(rawJid, participants);
            if (!target) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                return sendInteractive(client, m, `📌 *PROMOTE*\n━━━━━━━━━━━━━━━━\nCouldn't find that person in this group.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
            }

            const _targetNum = target.split('@')[0].replace(/\D/g, '');
            const _botNum = (client.user.id.split(':')[0].split('@')[0].replace(/\D/g, ''));
            if (_targetNum === DEV_NUMBER || _targetNum === _botNum) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                return sendInteractive(client, m, `📌 *PROMOTE*\n━━━━━━━━━━━━━━━━\nThat command cannot be used on the dev or the bot.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
            }

            try {
                await client.groupParticipantsUpdate(m.chat, [target], 'promote');
                await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                await client.sendMessage(m.chat, {
                    text: `📌 *PROMOTED*\n━━━━━━━━━━━━━━━━\n@${target.split('@')[0]} is now an admin.\nDon't let the power go to\nyour empty head.\n━━━━━━━━━━━━━━━━\n© bmb tech`,
                    mentions: [target]
                });
            } catch (error) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                await sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nFailed to promote: ${error.message?.slice(0, 60)}\n━━━━━━━━━━━━━━━━\n© bmb tech`);
            }
        });
    }
};
