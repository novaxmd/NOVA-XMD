import { setAfk, removeAfk, isAfk } from '../../features/afk.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default {
    name: 'afk',
    alias: ['away', 'brb'],
    description: 'Set yourself as AFK',
    run: async (context) => {
        const { client, m } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        const senderNum = m.sender.split('@')[0].split(':')[0];
        const reason = context.text || context.q || 'no reason';

        if (isAfk(senderNum)) {
            removeAfk(senderNum);
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, `💤 *AFK*\n━━━━━━━━━━━━━━━━\nAFK removed. Welcome back, ghost. 👁️\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }

        setAfk(senderNum, reason);
        return client.sendMessage(m.chat, {
            text: `💤 *AFK SET*\n━━━━━━━━━━━━━━━━\n@${senderNum} went AFK.\nReason: ${reason}\nDon't bother them. 🚫\n━━━━━━━━━━━━━━━━\n© bmb tech`,
            mentions: [m.sender]
        });
    }
};
