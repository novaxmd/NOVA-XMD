import yts from 'yt-search';
import fetch from 'node-fetch';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default async (context) => {
    const { client, m, text } = context;
    await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

    if (!text) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        return sendInteractive(client, m, "🎬 *VIDEO*\n━━━━━━━━━━━━━━━━\nGive me a video name, it's not rocket science.\n━━━━━━━━━━━━━━━━\n© bmb tech");
    }
    if (text.length > 100) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        return sendInteractive(client, m, "🎬 *VIDEO*\n━━━━━━━━━━━━━━━━\nTitle longer than your attention span. Under 100 chars!\n━━━━━━━━━━━━━━━━\n© bmb tech");
    }

    try {
        const searchQuery = `${text} official`;
        const searchResult = await yts(searchQuery);
        const video = searchResult.videos[0];

        if (!video) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, `🎬 *VIDEO*\n━━━━━━━━━━━━━━━━\nNothing found for "${text}". Your taste doesn't exist.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }

        const encodedUrl = encodeURIComponent(video.url);
        const apiUrl = `https://api.deline.web.id/downloader/youtube?url=${encodedUrl}`;
        const response = await fetch(apiUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Accept": "application/json"
            }
        });
        const data = await response.json();

        if (!data.status || !data.result || !data.result.medias || !data.result.medias.length) {
            throw new Error('API returned no valid video data.');
        }

        const result = data.result;
        const title = result.title || "Untitled";
        const thumbnailUrl = result.thumbnail;

        const chosen =
            result.medias.find(mformat => mformat.type === 'video' && mformat.label?.includes('720')) ||
            result.medias.find(mformat => mformat.type === 'video') ||
            result.medias[0];

        const videoUrl = chosen.url || chosen.downloadUrl || chosen.link || chosen.download;
        if (!videoUrl) {
            throw new Error('No usable video URL found. Keys: ' + Object.keys(chosen).join(', '));
        }

        // Download the actual video bytes with proper headers first
        const videoResponse = await fetch(videoUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Referer": "https://www.youtube.com/"
            }
        });

        if (!videoResponse.ok) {
            throw new Error(`Failed to fetch video bytes, status ${videoResponse.status}`);
        }

        const videoBuffer = Buffer.from(await videoResponse.arrayBuffer());

        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
        await client.sendMessage(m.chat, {
            video: videoBuffer,
            mimetype: "video/mp4",
            fileName: `${title}.mp4`,
            contextInfo: {
                externalAdReply: {
                    title: title,
                    body: "Powered by NOVA-XMD",
                    thumbnailUrl,
                    sourceUrl: video.url,
                    mediaType: 2,
                    renderLargerThumbnail: true
                }
            }
        });

    } catch (error) {
        console.error(`[VIDEO ERROR]`, error);
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
        await sendInteractive(client, m, `❌ *VIDEO ERROR*\n━━━━━━━━━━━━━━━━\n${error.message}\n━━━━━━━━━━━━━━━━\n© bmb tech`);
    }
};