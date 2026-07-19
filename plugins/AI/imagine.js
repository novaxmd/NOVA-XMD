import fetch from 'node-fetch';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default {
    name: 'imagine',
    aliases: ['aiimage', 'dream', 'generate'],
    description: 'Generates AI images from text prompts using Pollinations.ai',
    run: async (context) => {
        const { client, m, prefix, botname } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        const prompt = m.body.replace(new RegExp(`^${prefix}(imagine|aiimage|dream|generate)\\s*`, 'i'), '').trim();

        if (!prompt) {
            return client.sendMessage(m.chat, {
                text: `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nForgot the prompt? Typical.\nExample: ${prefix}imagine a cat playing football\n━━━━━━━━━━━━━━━━\n© bmb tech`,
                mentions: [m.sender]
            });
        }

        try {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

            const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=768&height=768&model=flux&nologo=true&seed=${Math.floor(Math.random() * 99999)}`;

            const imgRes = await fetch(imageUrl, { timeout: 60000 });
            if (!imgRes.ok) throw new Error(`Image generation failed: ${imgRes.status}`);

            const buffer = Buffer.from(await imgRes.arrayBuffer());

            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });

            await client.sendMessage(
                m.chat,
                {
                    image: buffer,
                    caption: `🤖 *AI IMAGE*\n━━━━━━━━━━━━━━━━\nPrompt: ${prompt}\nPowered by ${botname}\n━━━━━━━━━━━━━━━━\n© bmb tech`
                }
            );

        } catch (error) {
            console.error('Imagine command error:', error);
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            await sendInteractive(client, m, `📌 *FAILED*\n━━━━━━━━━━━━━━━━\nImage generation failed.\n${error.message}\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }
    }
};
