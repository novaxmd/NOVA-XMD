import { uploadToUrl } from '../../lib/toUrl.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default async (context) => {
    const { client, m } = context;
    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

    const quoted = m.quoted ? m.quoted : m;
    const mime = quoted.mimetype || m.mimetype || '';

    if (!/image/.test(mime)) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        return sendInteractive(client, m, `🖼️ *MISSING IMAGE*\n━━━━━━━━━━━━━━━━\nGive me an image you dumbass\nReply to an image first\n━━━━━━━━━━━━━━━━\n© bmb tech`);
    }

    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

    try {
        const media = await quoted.download();
        const imgUrl = await uploadToUrl(media);
        
        const formData = new FormData();
        const imageResponse = await fetch(imgUrl);
        const imageBlob = await imageResponse.blob();
        formData.append('image', imageBlob, 'image.png');
        formData.append('scale', '2');
        formData.append('apikey', 'tIdZJ');

        const resultResponse = await fetch('https://api.theresav.biz.id/tools/hd', {
            method: 'POST',
            body: formData
        });

        const resultBuffer = await resultResponse.buffer();

        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
        await client.sendMessage(m.chat, {
            image: resultBuffer,
            caption: `🖼️ *ENHANCED IMAGE*\n━━━━━━━━━━━━━━━━\nYour shitty image is now HD.\nStill looks like garbage though.\n━━━━━━━━━━━━━━━━\n© bmb tech`
        });
    } catch {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
        await sendInteractive(client, m, `📌 *FAILED*\n━━━━━━━━━━━━━━━━\nEnhancement failed. Try again.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
    }
};