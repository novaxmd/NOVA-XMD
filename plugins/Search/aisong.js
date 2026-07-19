import { makeSong } from '../../lib/toxicApi.js';
import { getSettings } from '../../database/config.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default {
    name: 'aisong',
    aliases: ['gensong', 'songgenerator'],
    description: 'Generate a song using AI',
    category: 'Search',
    run: async (context) => {
        const { client, m } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        const settings = await getSettings();
        const prefix = settings.prefix || '.';

        const prompt = (m.text || '').replace(/^\S+\s*/, '').trim();

        if (!prompt) {
            return sendInteractive(client, m, `❌ *ERROR*\n━━━━━━━━━━━━━━━━\nGive me something to work with.\nExample: ${prefix}aisong a sad love song about rain\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }

        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        try {
            const result = await makeSong(prompt);
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });

            const audioUrl = typeof result === 'string' ? result
                : (result?.audio || result?.url || result?.song || result?.output || '');

            if (audioUrl && audioUrl.startsWith('http')) {
                await client.sendMessage(m.chat, {
                    audio: { url: audioUrl },
                    mimetype: 'audio/mpeg',
                    ptt: false,
                    fileName: 'song.mp3'
                });
                await sendInteractive(client, m, `🤖 *AI SONG*\n━━━━━━━━━━━━━━━━\nPrompt: ${prompt}\nGenerated successfully.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
            } else {
                const display = typeof result === 'string' ? result : JSON.stringify(result);
                await sendInteractive(client, m, `🤖 *AI SONG*\n━━━━━━━━━━━━━━━━\nPrompt: ${prompt}\n${display}\n━━━━━━━━━━━━━━━━\n© bmb tech`);
            }
        } catch {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            await sendInteractive(client, m, `📌 *FAILED*\n━━━━━━━━━━━━━━━━\nSong generation failed. Try again.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }
    }
};