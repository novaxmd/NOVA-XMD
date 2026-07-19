import { sendInteractive } from '../../lib/sendInteractive.js';
export default async (context) => {
  const { client, m } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

  const message = `📌 *SUPPORT LINKS*\n━━━━━━━━━━━━━━━━\n*Owner*\nhttps:\n*Channel Link*\nhttps:\n*Group*\nhttps:\n━━━━━━━━━━━━━━━━\n© bmb tech`;

  try {
    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
    await client.sendMessage(
      m.chat,
      { text: message }
    );
  } catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
    console.error("Support command error:", error);
    await sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nFailed to send support links.\nTry again, you impatient fool.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
  }
};
