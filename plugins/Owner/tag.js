import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js'; 
import { sendInteractive } from '../../lib/sendInteractive.js';

export default async (context) => {
    await ownerMiddleware(context, async () => {


        const { client, m, args, participants, text } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });


if (!m.isGroup) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
    return sendInteractive(client, m, `📌 *TAG*\n━━━━━━━━━━━━━━━━\nCommand meant for groups.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
}



client.sendMessage(m.chat, { text : text ? text : 'Attention Here' , mentions: participants.map(a => a.id)});

});

}
