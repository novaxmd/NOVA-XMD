import acrcloud from 'acrcloud';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default async (context) => {
    const { client, m } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

    try {
        const acr = new acrcloud({
            host: 'identify-ap-southeast-1.acrcloud.com',
            access_key: '26afd4eec96b0f5e5ab16a7e6e05ab37',
            access_secret: 'wXOZIqdMNZmaHJP1YDWVyeQLg579uK2CfY6hWMN8'
        });

        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        if (!m.quoted) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, `📌 *SHAZAM*\n━━━━━━━━━━━━━━━━\nQuote an audio/video message, you deaf imbecile.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }

        const p = m.quoted ? m.quoted : m;
        const buffer = await p.download();

        const { status, metadata } = await acr.identify(buffer);
        if (status.code !== 0) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            return sendInteractive(client, m, `📌 *SHAZAM*\n━━━━━━━━━━━━━━━━\nSong not recognized.\nYour audio is as indecipherable as your life choices.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }

        const { title, artists, album, genres, release_date } = metadata.music[0];
        let txt = `🎵 *SHAZAM*\n━━━━━━━━━━━━━━━━\n`;
        txt += `Title: ${title}\n`;
        if (artists) txt += `Artists: ${artists.map(v => v.name).join(', ')}\n`;
        if (album) txt += `Album: ${album.name}\n`;
        if (genres) txt += `Genres: ${genres.map(v => v.name).join(', ')}\n`;
        if (release_date) txt += `Release: ${release_date}\n`;
        txt += `━━━━━━━━━━━━━━━━\n© bmb tech`;

        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
        await sendInteractive(client, m, txt);

    } catch (error) {
        console.error('Music recognition error:', error);
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
        await sendInteractive(client, m, `❌ *SHAZAM ERROR*\n━━━━━━━━━━━━━━━━\nMusic recognition failed. Your audio is garbage.\n${error.message}\n━━━━━━━━━━━━━━━━\n© bmb tech`);
    }
};
