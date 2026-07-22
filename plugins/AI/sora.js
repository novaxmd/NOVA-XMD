import fetch from 'node-fetch';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default {
    name: 'sora',
    aliases: ['soraai', 'genvideo', 'aifilm'],
    description: 'Generate an AI cinematic image scene from a text prompt',
    run: async (context) => {
        const { client, m, prefix } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        const prompt = m.body.replace(new RegExp(`^${prefix}(sora|soraai|genvideo|aifilm)\\s*`, 'i'), '').trim();

        if (!prompt) {
            return sendInteractive(client, m, `🤖 *SORA AI*\n━━━━━━━━━━━━━━━━\nDescribe a scene to generate.\nExample: ${prefix}sora a dragon flying over Tokyo\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }

        try {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

            const cinemaPrompt = `cinematic film scene, ultra detailed, 8k, ${prompt}, dramatic lighting, movie quality, epic composition`;
            const seed = Math.floor(Math.random() * 999999);
            const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(cinemaPrompt)}?width=1280&height=720&model=flux&nologo=true&seed=${seed}`;

            const imgRes = await fetch(imageUrl, { timeout: 60000 });
            if (!imgRes.ok) throw new Error('Scene generation failed');
            const buffer = Buffer.from(await imgRes.arrayBuffer());

            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            await client.sendMessage(m.chat, {
                image: buffer,
                caption: `🤖 *SORA AI SCENE*\n━━━━━━━━━━━━━━━━\nPrompt: ${prompt}\nResolution: 1280×720\n━━━━━━━━━━━━━━━━\n© bmb tech`
            });

        } catch (error) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            await sendInteractive(client, m, `📌 *FAILED*\n━━━━━━━━━━━━━━━━\nCould not generate scene.\nTry a different prompt.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }
    }
};
