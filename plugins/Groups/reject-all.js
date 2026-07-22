import middleware from '../../utils/botUtil/middleware.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default async (context) => {
  await middleware(context, async () => {
    const { client, m, isBotAdmin, isAdmin } = context;
    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

    if (!m.isGroup) {
      await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
      return sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nYo, genius, this command's\nfor groups. Quit embarrassing\nyourself.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
    }

    if (!isAdmin) {
      await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
      return sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nPfft, you? Admin? Get real,\nloser. Only admins can do this.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
    }

    if (!isBotAdmin) {
      await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
      return sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nI'm not admin, dipshit.\nPromote me or stop wasting\nmy time.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
    }

    const responseList = await client.groupRequestParticipantsList(m.chat);

    if (responseList.length === 0) {
      await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
      return sendInteractive(client, m, `📌 *NO REQUESTS*\n━━━━━━━━━━━━━━━━\nWow, no one's dumb enough to\nwanna join this trash group.\nNo requests to reject, moron.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
    }

    for (const participant of responseList) {
      try {
        const response = await client.groupRequestParticipantsUpdate(
          m.chat,
          [participant.jid],
          "reject"
        );
        console.log(response);
      } catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        console.error('Error rejecting participant:', error);
        return sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nScrew-up alert! Couldn't reject\n@${participant.jid.split('@')[0]}.\nFix your damn group, idiot.\n━━━━━━━━━━━━━━━━\n© bmb tech`, { mentions: [participant.jid] });
      }
    }

    sendInteractive(client, m, `📌 *REJECTED*\n━━━━━━━━━━━━━━━━\nAll those pathetic join requests?\nREJECTED. Go cry about it, losers.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
  });
};
