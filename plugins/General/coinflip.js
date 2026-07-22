import { sendInteractive } from '../../lib/sendInteractive.js';

export default {
    name: 'coinflip',
    aliases: ['flip', 'coin', 'headstails'],
    description: 'Flip a coin',
    run: async (context) => {
        const { client, m } = context;
        const result = Math.random() < 0.5 ? '🪙 Heads' : '🪙 Tails';
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        return sendInteractive(client, m, `📌 *COIN FLIP*\n━━━━━━━━━━━━━━━━\n${result}\nThere. Decision made.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
    }
};
