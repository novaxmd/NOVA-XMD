import { sendInteractive } from '../../lib/sendInteractive.js';
export default async (context) => {
  const { client, m, chatUpdate, store, isBotAdmin, isAdmin } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

  if (!m.isGroup) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
    return sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nYo, dumbass, this command's\nfor groups only.\nStop screwing around.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
  }

  if (!isAdmin) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
    return sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nNice try, loser. You need\nadmin powers to pull this off.\nGet lost.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
  }

  if (!isBotAdmin) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
    return sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nI ain't got admin rights, moron.\nMake me admin or quit\nwasting my time.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
  }

  const responseList = await client.groupRequestParticipantsList(m.chat);

  if (responseList.length === 0) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
    return sendInteractive(client, m, `📌 *NO REQUESTS*\n━━━━━━━━━━━━━━━━\nWhat a surprise, no one's\nbegging to join this dumpster fire.\nNo pending requests, idiot.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
  }

  await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });

  for (const participant of responseList) {
    try {
      const response = await client.groupRequestParticipantsUpdate(
        m.chat,
        [participant.jid],
        "approve"
      );
      console.log(response);
    } catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
      console.error('Error approving participant:', error);
      return sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nShit hit the fan, couldn't approve\n@${participant.jid.split('@')[0]}.\nFix your group, dumbass.\n━━━━━━━━━━━━━━━━\n© bmb tech`, { mentions: [participant.jid] });
    }
  }

  sendInteractive(client, m, `✅ *APPROVED*\n━━━━━━━━━━━━━━━━\nUgh, fine, all the desperate\nwannabes got approved.\nHappy now, you pest?\n━━━━━━━━━━━━━━━━\n© bmb tech`);
};
