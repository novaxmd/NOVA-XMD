import axios from 'axios';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default {
    name: 'capcut',
    alias: ['cc', 'capcutdl'],
    description: 'Download CapCut videos',
    run: async (context) => {
        const { client, m, text, prefix } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        if (!text) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, `📥 *CAPCUT DL*\n━━━━━━━━━━━━━━━━\nUsage: ${prefix}capcut <url>\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }
        if (!text.match(/capcut\.com/i)) return sendInteractive(client, m, 'That doesn\'t look like a CapCut link.');
        try {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
            const { data } = await axios.get(`https://api.siputzx.my.id/api/d/capcut?url=${encodeURIComponent(text)}`, { timeout: 15000 });
            if (!data?.data?.play) throw new Error('no data');
            const result = data.data;
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            await client.sendMessage(m.chat, {
                video: { url: result.play },
                caption: `🎬 *CAPCUT VIDEO*\n━━━━━━━━━━━━━━━━\nTitle: ${result.title || 'Unknown'}\nAuthor: ${result.author || 'Unknown'}\n━━━━━━━━━━━━━━━━\n© bmb tech`
            });
        } catch {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            sendInteractive(client, m, '│ Failed to download. Check the link and try again.\n╰───────────────\n> ©BMB TECH');
        }
    }
};
