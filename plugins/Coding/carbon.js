import fetch from 'node-fetch';
import { sendInteractive } from '../../lib/sendInteractive.js';
export default async (context) => {
  const { client, m, text, botname } = context;
  await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });


  let cap = `📌 *CARBON*\n━━━━━━━━━━━━━━━━\nConverted By ${botname}\n━━━━━━━━━━━━━━━━\n© bmb tech`;

  if (m.quoted && m.quoted.text) {
    const forq = m.quoted.text;

    try {
      let response = await fetch('https://carbonara.solopov.dev/api/cook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: forq,
          backgroundColor: '#1F816D' }) });

      if (!response.ok) {
          await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
          return sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nAPI failed to fetch a valid response.\nTry again later, genius.\n━━━━━━━━━━━━━━━━\n© bmb tech`)
      }

      let per = await response.buffer();

      await client.sendMessage(m.chat, { image: per, caption: cap });
    } catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
      sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nAn error occured, you broke it.\n${error}\n━━━━━━━━━━━━━━━━\n© bmb tech`)
    }
  } else {
    sendInteractive(client, m, `📌 *CARBON*\n━━━━━━━━━━━━━━━━\nQuote a code message, idiot.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
  }
}