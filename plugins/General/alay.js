import { sendInteractive } from '../../lib/sendInteractive.js';
export default {
    name: 'alay',
    alias: ['leet', 'l33t'],
    description: 'Convert text to alay/leet style',
    run: async (context) => {
        const { client, m, text } = context;
        const input = text || m.quoted?.text;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        if (!input) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, `📌 *ALAY TEXT*\n━━━━━━━━━━━━━━━━\nGive me text to alay-ify, genius.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }
        const alay = input.split('').map(v => {
            const r = Math.random();
            const char = r > .5 ? v.toUpperCase() : v.toLowerCase();
            if (r > .6) {
                switch (v.toLowerCase()) {
                    case 'a': return '4';
                    case 'e': return '3';
                    case 'i': return '1';
                    case 'o': return '0';
                    case 's': return '5';
                    case 'g': return '9';
                    case 'b': return '8';
                    case 't': return '7';
                }
            }
            return char;
        }).join('');
        await sendInteractive(client, m, `📌 *ALAY TEXT*\n━━━━━━━━━━━━━━━━\n${alay}\n━━━━━━━━━━━━━━━━\n© bmb tech`);
    }
};
