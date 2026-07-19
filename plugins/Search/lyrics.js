import fetch from 'node-fetch';
import { generateWAMessageFromContent } from '@whiskeysockets/baileys';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default async (context) => {
  const { client, m, text } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

  if (!text) {
    return sendInteractive(client, m, `📌 *CTA_COPY*\n━━━━━━━━━━━━━━━━\nTell me a song name you dumbass!\nExample: .lyrics Alone ft ava max\n━━━━━━━━━━━━━━━━\n© bmb tech`);
  }

  try {
    const encodedText = encodeURIComponent(text);
    const apiUrl = `https://api.deline.web.id/tools/lyrics?title=${encodedText}`;
    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data.status || !data.result || data.result.length === 0) {
      return sendInteractive(client, m, `📌 *CTA_COPY*\n━━━━━━━━━━━━━━━━\nNo lyrics found for "${text}". Maybe the song sucks.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
    }

    const song = data.result[0];
    if (!song.plainLyrics) {
      return sendInteractive(client, m, `📌 *CTA_COPY*\n━━━━━━━━━━━━━━━━\nNo plain lyrics for this one. Try another song, loser.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
    }

    const cleanLyrics = song.plainLyrics;
    const songTitle = song.trackName || song.name || 'Unknown';
    const artistName = song.artistName || 'Unknown Artist';
    const bodyText = `📌 *LYRICS*\n━━━━━━━━━━━━━━━━\n${songTitle} - ${artistName}\n━━━━━━━━━━━━━━━━\n© bmb tech`;
    const copyCode = `${songTitle} - ${artistName}\n\n${cleanLyrics}`.slice(0, 4096);

    try {
      const msg = generateWAMessageFromContent(
        m.chat,
        {
          interactiveMessage: {
            body: { text: bodyText },
            footer: { text: '' },
            nativeFlowMessage: {
              buttons: [
                {
                  name: 'cta_copy',
                  buttonParamsJson: JSON.stringify({
                    display_text: '📋 Copy Lyrics',
                    copy_code: copyCode
                  })
                }
              ]
            }
          }
        }
      );
      await client.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
    } catch {
      await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
      await client.sendMessage(m.chat, { text: bodyText });
    }
  } catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
    await sendInteractive(client, m, `❌ *LYRICS ERROR*\n━━━━━━━━━━━━━━━━\nCan't get lyrics for "${text}". Shit broke.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
  }
};
