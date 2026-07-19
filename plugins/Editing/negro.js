import axios from 'axios';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default async (context) => {
    const { client, mime, m, text, botname } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

    if (m.quoted && /image/.test(mime)) {
        const buffer = await m.quoted.download();
        const base64Image = buffer.toString('base64');

        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        try {
            const response = await axios.post("https://negro.consulting/api/process-image", {
                filter: "hitam",
                imageData: "data:image/png;base64," + base64Image
            });

            const resultBuffer = Buffer.from(
                response.data.processedImageUrl.replace("data:image/png;base64,", ""),
                "base64"
            );

            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });

            await client.sendMessage(m.chat, {
                image: resultBuffer,
                caption: `📌 *NEGRO FILTER*\n━━━━━━━━━━━━━━━━\nDone! Your image now has the\n*black* filter applied.\n━━━━━━━━━━━━━━━━\n© bmb tech`
            });
        } catch (error) {
            console.error('Error while processing image:', error);
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            await sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nImage processing failed. Try again.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }
    } else {
        await sendInteractive(client, m, `📌 *NEGRO*\n━━━━━━━━━━━━━━━━\nQuote an image and type *negro*\nto apply the black filter, genius.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
    }
};
