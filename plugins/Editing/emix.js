import { Sticker, createSticker, StickerTypes } from 'wa-sticker-formatter';
import axios from 'axios';
import { sendInteractive } from '../../lib/sendInteractive.js';
export default async (context) => {
        const { client, m, botname, text } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });



if (!text) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
    return sendInteractive(client, m, `📌 *EMIX*\n━━━━━━━━━━━━━━━━\nNo emojis provided?\nAre you braindead?\n━━━━━━━━━━━━━━━━\n© bmb tech`)
}


  const emojis = text.split('+');

  if (emojis.length !== 2) {
    sendInteractive(client, m, `📌 *EMIX*\n━━━━━━━━━━━━━━━━\nSpecify the emojis and separate\nwith '+', you dense fool.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
    return;
  }

  const emoji1 = emojis[0].trim();
  const emoji2 = emojis[1].trim();

  await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
  try {
    const response = await axios.get(`https://levanter.onrender.com/emix?q=${emoji1}${emoji2}`);

    if (response.data.status === true) {
    

      let stickerMess = new Sticker(response.data.result, {
        pack: botname,
        type: StickerTypes.CROPPED,
        categories: ["🤩", "🎉"],
        id: "12345",
        quality: 70,
        background: "transparent" });
      const stickerBuffer2 = await stickerMess.toBuffer();
      await client.sendMessage(m.chat, { sticker: stickerBuffer2 });
      await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });

    } else {
      sendInteractive(client, m, `📌 *FAILED*\n━━━━━━━━━━━━━━━━\nUnable to create emoji mix.\nYour emoji combo is trash.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
    }
  } catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
    sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nAn error occurred while creating\nthe emoji mix.\n${error}\n━━━━━━━━━━━━━━━━\n© bmb tech`);
  }


}