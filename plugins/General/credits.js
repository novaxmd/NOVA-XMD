import { generateWAMessageFromContent } from '@whiskeysockets/baileys';
import { sendInteractive } from '../../lib/sendInteractive.js';
export default async (context) => {
  const { client, m, prefix, text } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

  const toFancyFont = (text, isUpperCase = false) => {
    const fonts = {
      'A': '𝘼', 'B': '𝘽', 'C': '𝘾', 'D': '𝘿', 'E': '𝙀', 'F': '𝙁', 'G': '𝙂', 'H': '𝙃', 'I': '𝙄', 'J': '𝙅', 'K': '𝙆', 'L': '𝙇', 'M': '𝙈',
      'N': '𝙉', 'O': '𝙊', 'P': '𝙋', 'Q': '𝙌', 'R': '𝙍', 'S': '𝙎', 'T': '𝙏', 'U': '𝙐', 'V': '𝙑', 'W': '𝙒', 'X': '𝙓', 'Y': '𝙔', 'Z': '𝙕',
      'a': '𝙖', 'b': '𝙗', 'c': '𝙘', 'd': '𝙙', 'e': '𝙚', 'f': '𝙛', 'g': '𝙜', 'h': '𝙝', 'i': '𝙞', 'j': '𝙟', 'k': '𝙠', 'l': '𝙡', 'm': '𝙢',
      'n': '𝙣', 'o': '𝙤', 'p': '𝙥', 'q': '𝙦', 'r': '𝙧', 's': '𝙨', 't': '𝙩', 'u': '𝙪', 'v': '𝙫', 'w': '𝙬', 'x': '𝙭', 'y': '𝙮', 'z': '𝙯'
    };
    return (isUpperCase ? text.toUpperCase() : text.toLowerCase())
      .split('')
      .map(char => fonts[char] || char)
      .join('');
  };

  if (text) {
    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
    return client.sendMessage(m.chat, { text: `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nYo, @${m.sender.split('@')[0].split(':')[0]}, what's with the extra\nbullshit? Just say ${prefix}credits, you moron.\n━━━━━━━━━━━━━━━━\n© bmb tech` }, { mentions: [m.sender] });
  }

  try {
    const replyText = `📌 *CREDITS*\n━━━━━━━━━━━━━━━━\nAll hail *bmbtech*, the badass who\nbuilt this bot from the ground up.\nNobody else gets credit—fuck 'em.\nThis is my empire, and I run this\nshit solo.\nBow down to *bmbtech*\n━━━━━━━━━━━━━━━━\n© bmb tech`;

    await client.sendMessage(m.chat, {
      text: replyText,
      footer: `©BMB TECH`,
      viewOnce: true
    });
  } catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
    console.error('Error in credits command:', error);
    await sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nShit went sideways, can't show credits.\nTry again later, loser.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
  }
};
