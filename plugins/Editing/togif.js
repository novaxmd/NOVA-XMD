import fetch from 'node-fetch';
import { sendInteractive } from '../../lib/sendInteractive.js';

function emojiToTwemojiUrl(emoji) {
    const codepoints = [...emoji]
        .map(c => c.codePointAt(0).toString(16).toLowerCase())
        .filter(cp => cp !== 'fe0f');
    return `https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/72x72/${codepoints.join('-')}.png`;
}

export default async (context) => {
    const { client, m, text } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

    try {
        if (!text) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, `📌 *EMOJI ART*\n━━━━━━━━━━━━━━━━\nGive me an emoji!\nExample: .togif 😂\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }

        const emojiMatch = text.match(/\p{Emoji}/u);
        if (!emojiMatch) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, `📌 *EMOJI ART*\n━━━━━━━━━━━━━━━━\nThat's not an emoji. Give me a real one.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }

        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        const emoji = emojiMatch[0];
        const imgUrl = emojiToTwemojiUrl(emoji);

        const res = await fetch(imgUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        if (!res.ok) throw new Error(`Emoji not found in Twemoji set`);

        const buffer = Buffer.from(await res.arrayBuffer());

        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
        await client.sendMessage(m.chat, {
            image: buffer,
            caption: `📌 *EMOJI ART*\n━━━━━━━━━━━━━━━━\n${emoji}\n━━━━━━━━━━━━━━━━\n© bmb tech`
        });

    } catch (error) {
        console.error("togif command error:", error);
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
        await sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nFailed to fetch emoji art:\n${error.message}\n━━━━━━━━━━━━━━━━\n© bmb tech`);
    }
};
