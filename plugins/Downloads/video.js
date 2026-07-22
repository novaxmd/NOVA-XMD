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
        // Step 1: Search YouTube for the video
        const searchQuery = `${text} official`;
        const searchResult = await yts(searchQuery);
        const video = searchResult.videos[0];

        if (!video) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, `🎬 *VIDEO*\n━━━━━━━━━━━━━━━━\nNothing found for "${text}". Your taste doesn't exist.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }

        // Step 2: Send that video's URL to Deline downloader
        const encodedUrl = encodeURIComponent(video.url);
        const response = await fetch(`https://api.deline.web.id/downloader/youtube?url=${encodedUrl}`, {
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

        // Step 3: Pick a video format (prefer 720p, fallback to first video type)
        const medias = result.medias;
        const chosen =
            medias.find(mformat => mformat.type === 'video' && mformat.label?.includes('720')) ||
            medias.find(mformat => mformat.type === 'video') ||
            medias[0];

        if (!chosen || !chosen.url) {
            throw new Error('No downloadable video URL found in response.');
        }

        const videoUrl = chosen.url;

        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
        await client.sendMessage(m.chat, {
            video: { url: videoUrl },
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
        console.error(`Video error:`, error);
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
        let userMessage = 'Download failed. The universe despises your video choice.';
        if (error.message.includes('API returned')) userMessage = 'The video service rejected the request.';
        await sendInteractive(client, m, `❌ *VIDEO ERROR*\n━━━━━━━━━━━━━━━━\n${userMessage}\n${error.message}\n━━━━━━━━━━━━━━━━\n© bmb tech`);
    }
};
