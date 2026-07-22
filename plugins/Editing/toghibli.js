import axios from 'axios';
import FormData from 'form-data';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import fs from 'fs';
import path from 'path';
import { sendInteractive } from '../../lib/sendInteractive.js';

async function uploadImage(buffer) {
    const tempFilePath = path.join(__dirname, `temp_${Date.now()}.jpg`);
    fs.writeFileSync(tempFilePath, buffer);

    const form = new FormData();
    form.append('files[]', fs.createReadStream(tempFilePath));

    try {
        const response = await axios.post('https://qu.ax/upload.php', form, {
            headers: form.getHeaders() });

        const link = response.data?.files?.[0]?.url;
        if (!link) throw new Error('No URL returned in response');

        fs.unlinkSync(tempFilePath);
        return { url: link };
    } catch (error) {
        if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
        throw new Error(`Upload error: ${error.message}`);
    }
}

export default async (context) => {
    const { client, mime, m } = context;
    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

    const quoted = m.quoted ? m.quoted : m;
    const quotedMime = quoted.mimetype || mime || '';

    if (!/image/.test(quotedMime)) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        return sendInteractive(client, m, `📌 *TO GHIBLI*\n━━━━━━━━━━━━━━━━\nPlease reply to or send an image\nwith this command, genius.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
    }

    await sendInteractive(client, m, `📌 *TO GHIBLI*\n━━━━━━━━━━━━━━━━\nCreating your Ghibli-style artwork...\nPlease wait.\n━━━━━━━━━━━━━━━━\n© bmb tech`);

    try {
        const media = await quoted.download();
        if (!media) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, `📌 *FAILED*\n━━━━━━━━━━━━━━━━\nFailed to download the image.\nTry again, loser.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }

        if (media.length > 10 * 1024 * 1024) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, `📌 *FAILED*\n━━━━━━━━━━━━━━━━\nThe image is too large (max 10MB).\nCompress it, you hoarder.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }

        const { url: imageUrl } = await uploadImage(media);

        const response = await axios.get('https://fgsi.koyeb.app/api/ai/image/toGhibli', {
            params: {
                apikey: 'fgsiapi-2dcdfa06-6d',
                url: imageUrl },
            responseType: 'arraybuffer' });

        const ghibliImage = Buffer.from(response.data);

        await client.sendMessage(
            m.chat,
            {
                image: ghibliImage,
                caption: `📌 *GHIBLI STYLE*\n━━━━━━━━━━━━━━━━\nYour image has been reimagined in\n*Studio Ghibli* style!\n━━━━━━━━━━━━━━━━\n© bmb tech` }
        );
    } catch (err) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        await sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nError while generating Ghibli-style\nimage generation failed.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
    }
};