import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default async (context) => {
    await ownerMiddleware(context, async () => {
        const { m } = context;
        await client.sendMessage(m.chat, { react: { text: '💀', key: m.reactKey } });
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        await sendInteractive(client, m, `📌 *SHUTDOWN*\n━━━━━━━━━━━━━━━━\n💀 NOVA-XMD going offline...\nDon't cry.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
        setTimeout(() => process.exit(0), 2000);
    });
};
