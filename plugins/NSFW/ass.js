import fetch from 'node-fetch';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default async (context) => {
    const { client, m } = context;

    try {
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        const res = await fetch('https://nekobot.xyz/api/image?type=ass');
        if (!res.ok) throw new Error(`API returned ${res.status}`);
        const data = await res.json();

        if (!data.success || !data.message) throw new Error('No image URL returned');

        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });

        await client.sendMessage(m.chat, {
            image: { url: data.message },
            caption: `📌 *NSFW*\n━━━━━━━━━━━━━━━━\nType: ass\nHere you go, you degenerate.\n━━━━━━━━━━━━━━━━\n© bmb tech`
        });

    } catch (error) {
        console.error('NSFW error:', error);
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
        await sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nFailed to fetch NSFW content.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
    }
};
