import { sendInteractive } from '../../lib/sendInteractive.js';
const MORE = String.fromCharCode(8206);
const READ_MORE = MORE.repeat(4001);

export default {
    name: 'readmore',
    alias: ['spoiler', 'hidetext', 'blur'],
    description: 'Hide text behind a read more button',
    run: async (context) => {
        const { client, m, text, prefix } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        if (!text) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, `📌 *READ MORE*\n━━━━━━━━━━━━━━━━\nUsage: ${prefix}readmore visible text|hidden text\nThe text after | will be hidden.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }
        const parts = text.split('|');
        const visible = parts[0] || '';
        const hidden = parts[1] || '';
        await client.sendMessage(m.chat, { text: visible + READ_MORE + hidden });
    }
};
