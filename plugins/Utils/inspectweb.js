import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default async (context) => {
    const { client, m, text } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

    if (!text) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        return sendInteractive(client, m, `📌 *USAGE*\n━━━━━━━━━━━━━━━━\nProvide a valid web link to inspect, dimwit.\nBot will crawl HTML, CSS, JS, and media.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
    }

    if (!/^https?:\/\//i.test(text)) {
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        return sendInteractive(client, m, `📌 *INSPECTWEB*\n━━━━━━━━━━━━━━━━\nURL must start with http:// or https://, genius.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
    }

    try {
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        const response = await fetch(text);
        const html = await response.text();
        const $ = cheerio.load(html);

        const mediaFiles = [];
        $('img[src], video[src], audio[src]').each((i, element) => {
            let src = $(element).attr('src');
            if (src) {
                mediaFiles.push(src);
            }
        });

        const cssFiles = [];
        $('link[rel="stylesheet"]').each((i, element) => {
            let href = $(element).attr('href');
            if (href) {
                cssFiles.push(href);
            }
        });

        const jsFiles = [];
        $('script[src]').each((i, element) => {
            let src = $(element).attr('src');
            if (src) {
                jsFiles.push(src);
            }
        });

        await sendInteractive(client, m, `🌐 *HTML CONTENT*\n━━━━━━━━━━━━━━━━\n${html}\n━━━━━━━━━━━━━━━━\n© bmb tech`);

        if (cssFiles.length > 0) {
            for (const cssFile of cssFiles) {
                const cssResponse = await fetch(new URL(cssFile, text));
                const cssContent = await cssResponse.text();
                await sendInteractive(client, m, `🌐 *CSS FILE*\n━━━━━━━━━━━━━━━━\n${cssContent}\n━━━━━━━━━━━━━━━━\n© bmb tech`);
            }
        } else {
            await sendInteractive(client, m, `📌 *INSPECTWEB*\n━━━━━━━━━━━━━━━━\nNo external CSS files found.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }

        if (jsFiles.length > 0) {
            for (const jsFile of jsFiles) {
                const jsResponse = await fetch(new URL(jsFile, text));
                const jsContent = await jsResponse.text();
                await sendInteractive(client, m, `🌐 *JS FILE*\n━━━━━━━━━━━━━━━━\n${jsContent}\n━━━━━━━━━━━━━━━━\n© bmb tech`);
            }
        } else {
            await sendInteractive(client, m, `📌 *INSPECTWEB*\n━━━━━━━━━━━━━━━━\nNo external JavaScript files found.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }

        if (mediaFiles.length > 0) {
            await sendInteractive(client, m, `🌐 *MEDIA FILES*\n━━━━━━━━━━━━━━━━\n${mediaFiles.map(f => f).join('\n')}\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        } else {
            await sendInteractive(client, m, `📌 *INSPECTWEB*\n━━━━━━━━━━━━━━━━\nNo media files found. Empty site, empty soul.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }

    } catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        console.error(error);
        return sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nError fetching website content. Site's probably trash.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
    }
};
