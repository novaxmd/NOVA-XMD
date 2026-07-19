import middleware from '../../utils/botUtil/middleware.js';
import { resolveTargetJid } from '../../lib/lidResolver.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

const DEV_NUMBER = '255767862457';

export default {
    name: 'demote',
    aliases: ['unadmin', 'removeadmin', 'deadmin', 'demoteuser'],
    description: 'Demotes a user from admin in a group',
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
                return sendInteractive(client, m, `📌 *DEMOTE*\n━━━━━━━━━━━━━━━━\nMention or quote a user. ${prefix}demote @user\n━━━━━━━━━━━━━━━━\n© bmb tech`);
            }

            const target = resolveTargetJid(rawJid, participants);
            if (!target) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                return sendInteractive(client, m, `📌 *DEMOTE*\n━━━━━━━━━━━━━━━━\nCouldn't find that person in this group.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
            }

            const _targetNum = target.split('@')[0].replace(/\D/g, '');
            const _botNum = (client.user.id.split(':')[0].split('@')[0].replace(/\D/g, ''));
            if (_targetNum === DEV_NUMBER || _targetNum === _botNum) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                return sendInteractive(client, m, `📌 *DEMOTE*\n━━━━━━━━━━━━━━━━\nThat command cannot be used on the dev or the bot.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
            }

            try {
                await client.groupParticipantsUpdate(m.chat, [target], 'demote');
                await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                await client.sendMessage(m.chat, {
                    text: `📌 *DEMOTED*\n━━━━━━━━━━━━━━━━\n@${target.split('@')[0]} got stripped of admin.\nBack to being a nobody.\n━━━━━━━━━━━━━━━━\n© bmb tech`,
                    mentions: [target]
                });
            } catch (error) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                await sendInteractive(client, m, `📌 *DEMOTE*\n━━━━━━━━━━━━━━━━\nDemote failed: ${error.message?.slice(0, 60)}\n━━━━━━━━━━━━━━━━\n© bmb tech`);
            }
        });
    } };
