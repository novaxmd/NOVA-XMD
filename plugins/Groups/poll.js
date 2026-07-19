import { sendInteractive } from '../../lib/sendInteractive.js';
const polls = new Map();

export default {
    name: 'poll',
    alias: ['createpoll', 'vote'],
    description: 'Create a group poll',
    run: async (context) => {
        const { client, m } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        if (!m.isGroup) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return m.reply(`📌 *POLL*\n━━━━━━━━━━━━━━━━\nGroup only command, dumbass.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }

        const input = (context.text || context.q || '').trim();
        if (!input.includes('|')) return m.reply(`📌 *POLL*\n━━━━━━━━━━━━━━━━\nFormat: .poll Question | Option1 | Option2 | ...\nExample: .poll Best bot? | NOVA-XMD | Other bots\n━━━━━━━━━━━━━━━━\n© bmb tech`);

        const parts = input.split('|').map(s => s.trim()).filter(Boolean);
        if (parts.length < 3) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return m.reply(`📌 *POLL*\n━━━━━━━━━━━━━━━━\nNeed at least a question + 2 options.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }

        const question = parts[0];
        const options = parts.slice(1).slice(0, 12);

        try {
            await client.sendMessage(m.chat, {
                poll: {
                    name: question,
                    values: options,
                    selectableCount: 1
                }
            });
        } catch {
            const nums = ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟','⓫','⓬'];
            const optText = options.map((o,i) => `${nums[i]||'•'} ${o}`).join('\n');
            await sendInteractive(client, m, `📌 *POLL*\n━━━━━━━━━━━━━━━━\n❓ ${question}\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }
    }
};
