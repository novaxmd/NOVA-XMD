import middleware from '../../utils/botUtil/middleware.js';
import { resolveTargetJid } from '../../lib/lidResolver.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

const DEV_NUMBER = '255767862457';

export default {
  name: 'remove',
  aliases: ['kick', 'yeet', 'boot', 'removemember'],
  description: 'Removes a user from a group',
  run: async (context) => {
    await middleware(context, async () => {
      const { client, m, prefix } = context;
      await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

      let rawJid = null;
      if (m.mentionedJid && m.mentionedJid.length > 0) rawJid = m.mentionedJid[0];
      if (!rawJid && m.quoted?.sender) rawJid = m.quoted.sender;

      if (!rawJid) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        return sendInteractive(client, m, `📌 *REMOVE*\n━━━━━━━━━━━━━━━━\nMention or quote a user. ${prefix}kick @user\n━━━━━━━━━━━━━━━━\n© bmb tech`);
      }

      const groupMetadata = await client.groupMetadata(m.chat);
      const participants = groupMetadata.participants;
      const targetJid = resolveTargetJid(rawJid, participants);
      const botJid = (client.user.id.split(':')[0].split('@')[0].replace(/\D/g, '')) + '@s.whatsapp.net';

      if (!targetJid) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        return sendInteractive(client, m, `📌 *REMOVE*\n━━━━━━━━━━━━━━━━\nCouldn't find that person in this group.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
      }

      const _targetNum = targetJid.split('@')[0].replace(/\D/g, '');
      const _botNum = botJid.split('@')[0].replace(/\D/g, '');
      if (_targetNum === DEV_NUMBER || _targetNum === _botNum) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        return sendInteractive(client, m, `📌 *REMOVE*\n━━━━━━━━━━━━━━━━\nThat command cannot be used on the dev or the bot.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
      }

      try {
        await client.groupParticipantsUpdate(m.chat, [targetJid], 'remove');
        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
        await client.sendMessage(m.chat, {
          text: `📌 *KICKED*\n━━━━━━━━━━━━━━━━\n@${targetJid.split('@')[0]} got yeeted out.\nGood riddance, trash.\n━━━━━━━━━━━━━━━━\n© bmb tech`,
          mentions: [targetJid]
        });
      } catch (error) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        await sendInteractive(client, m, `📌 *REMOVE*\n━━━━━━━━━━━━━━━━\nCouldn't kick that user.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
      }
    });
  }
};
