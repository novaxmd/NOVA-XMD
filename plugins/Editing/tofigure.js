import axios from 'axios';
import FormData from 'form-data';
import { sendInteractive } from '../../lib/sendInteractive.js';

async function uploadToCatbox(buffer) {
    const form = new FormData();
    form.append('reqtype', 'fileupload');
    form.append('fileToUpload', buffer, { filename: 'image.png' });
    const response = await axios.post('https://catbox.moe/user/api.php', form, { headers: form.getHeaders() });
    if (!response.data || !response.data.includes('catbox')) throw new Error('Upload Refused');
    return response.data;
}

export default async (context) => {
    const { client, m } = context;
    try {
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        const quoted = m.quoted ? m.quoted : m;
        const quotedMime = quoted.mimetype || '';
        if (!/image/.test(quotedMime)) return sendInteractive(client, m, `📌 *TO FIGURE*\n━━━━━━━━━━━━━━━━\nThat is not an image. Are your eyes\nbroken? Quote a real image, you imbecile.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        const media = await quoted.download();
        if (!media) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, `📌 *FAILED*\n━━━━━━━━━━━━━━━━\nFailed to download your worthless image.\nTry sending something that actually exists.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }
        if (media.length > 10 * 1024 * 1024) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, `📌 *FAILED*\n━━━━━━━━━━━━━━━━\nYour image is too large. 10MB MAX,\nyou digital hoarder.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }
        const imageUrl = await uploadToCatbox(media);
        const apiURL = `https://api.fikmydomainsz.xyz/imagecreator/tofigur?url=${encodeURIComponent(imageUrl)}`;
        const response = await axios.get(apiURL);
        if (!response.data || !response.data.status || !response.data.result) throw new Error('The API vomited nonsense back at me.');
        const resultUrl = response.data.result;
        const figureBuffer = (await axios.get(resultUrl, { responseType: 'arraybuffer' })).data;
        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
        await client.sendMessage(m.chat, { image: Buffer.from(figureBuffer), caption: `📌 *TO FIGURE*\n━━━━━━━━━━━━━━━━\nHere. It is now a "figure".\nYou are welcome.\n━━━━━━━━━━━━━━━━\n© bmb tech` });
    } catch (err) {
        console.error('tofigur error:', err);
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
        let userMessage = 'It failed. What a surprise.';
        if (err.message.includes('timeout')) userMessage = 'Took too long. Your image is probably as heavy as your stupidity.';
        if (err.message.includes('Network Error')) userMessage = 'Network error. Are you on dial-up?';
        if (err.message.includes('Upload Refused')) userMessage = "Couldn't even upload your image. Pathetic.";
        if (err.message.includes('API vomited')) userMessage = 'The art service rejected your image. It has standards.';
        await sendInteractive(client, m, `📌 *FAILED*\n━━━━━━━━━━━━━━━━\n${userMessage}\n━━━━━━━━━━━━━━━━\n© bmb tech`);
    }
};