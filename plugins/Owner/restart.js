import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m } = context;
        await client.sendMessage(m.chat, { react: { text: '🔄', key: m.reactKey } });
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        await sendInteractive(client, m, `📌 *RESTART*\n━━━━━━━━━━━━━━━━\nRestarting NOVA-XMD...\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        setTimeout(() => { process.exit(0); }, 3000);
    });
};
