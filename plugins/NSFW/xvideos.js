import axios from 'axios';
import * as cheerio from 'cheerio';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default async (context) => {
    const { client, m, text } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

    if (!text) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        return sendInteractive(client, m, `🎬 *XVIDEOS*\n━━━━━━━━━━━━━━━━\nYou dumb fuck, type something.\nI'm not psychic.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
    }
    if (text.length > 150) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        return sendInteractive(client, m, `🎬 *XVIDEOS*\n━━━━━━━━━━━━━━━━\nYour search is longer than your dick.\nKeep it under 150 chars, idiot.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
    }

    const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

    try {
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        const searchRes = await axios.get(`https://www.xvideos.com/?k=${encodeURIComponent(text.trim())}&sort=new`, {
            headers: { 'User-Agent': UA, 'Accept-Language': 'en-US,en;q=0.9' },
            timeout: 15000
        });

        const $s = cheerio.load(searchRes.data);
        let firstHref = null;
        $s('div.thumb-block a[href^="/video"]').each((i, el) => {
            if (!firstHref) firstHref = $s(el).attr('href');
        });

        if (!firstHref) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            return sendInteractive(client, m, `🎬 *XVIDEOS*\n━━━━━━━━━━━━━━━━\nCouldn't find shit for "${text}".\nTry better keywords, retard.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }

        const videoUrl = `https://www.xvideos.com${firstHref}`;
        const videoRes = await axios.get(videoUrl, {
            headers: { 'User-Agent': UA },
            timeout: 15000
        });

        const html = videoRes.data;
        const highUrl = /html5player\.setVideoUrlHigh\('([^']+)`\)/.exec(html)?.[1];
        const lowUrl = /html5player\.setVideoUrlLow\(`([^']+)'\)/.exec(html)?.[1];
        const thumb = /html5player\.setThumbUrl169\('([^']+)`\)/.exec(html)?.[1];
        const videoTitle = /html5player\.setVideoTitle\(`([^']+)'\)/.exec(html)?.[1] || 'Untitled';

        const mp4Url = highUrl || lowUrl;
        if (!mp4Url) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            return sendInteractive(client, m, `🎬 *XVIDEOS*\n━━━━━━━━━━━━━━━━\nFound it but no MP4 link.\nTry a different search, genius.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }

        const cleanTitle = `${videoTitle.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 60)}`;

        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });

        await client.sendMessage(m.chat, {
            video: { url: mp4Url },
            mimetype: 'video/mp4',
            fileName: `${cleanTitle}.mp4`,
            caption: `🎬 *XVIDEOS*\n━━━━━━━━━━━━━━━━\n*${videoTitle.slice(0, 80)}*\nGo jerk off somewhere else.\n━━━━━━━━━━━━━━━━\n© bmb tech`,
            contextInfo: {
                externalAdReply: {
                    title: videoTitle.length > 80 ? videoTitle.substring(0, 77) + '...' : videoTitle,
                    body: 'Suck it up',
                    thumbnailUrl: thumb || '',
                    sourceUrl: videoUrl,
                    mediaType: 2,
                    renderLargerThumbnail: true } } });

    } catch (error) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
        sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nEverything broke because\nyou're cursed. Fix your life.\n${error.message?.slice(0, 60)}\n━━━━━━━━━━━━━━━━\n© bmb tech`);
    }
};
