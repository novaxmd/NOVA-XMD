import { sendInteractive } from '../../lib/sendInteractive.js';

const ALLOWED = /^[0-9+\-*/.()%^ ]+$/;

export default {
    name: 'calc',
    aliases: ['calculate', 'math', 'solve'],
    description: 'Evaluate a mathematical expression',
    run: async (context) => {
        const { client, m, text } = context;
        const expr = (text || '').trim();
        if (!expr) {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
            return sendInteractive(client, m, `📌 *CALCULATOR*\n━━━━━━━━━━━━━━━━\nGive me an expression. Usage: .calc 2+2\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }
        if (!ALLOWED.test(expr)) {
            return sendInteractive(client, m, `📌 *CALCULATOR*\n━━━━━━━━━━━━━━━━\nOnly numbers and operators please. No tricks.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }
        try {
            const result = Function('"use strict"; return (' + expr + ')')();
            if (result === undefined || result === null || !isFinite(result)) throw new Error('invalid result');
            return sendInteractive(client, m, `📌 *CALCULATOR*\n━━━━━━━━━━━━━━━━\n🔢 ${expr}\n= ${result}\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        } catch (e) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, `📌 *CALCULATOR*\n━━━━━━━━━━━━━━━━\nThat expression is broken. Fix your math.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        }
    }
};
