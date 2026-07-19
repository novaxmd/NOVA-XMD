import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js'; 
import { sendInteractive } from '../../lib/sendInteractive.js';

export default async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, Owner, isBotAdmin } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

                 if (!m.isGroup) {
                     await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                     return sendInteractive(client, m, `👮 *OADMIN*\n━━━━━━━━━━━━━━━━\nThis command is meant for groups.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
                 }
         if (!isBotAdmin) {
             await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
             return sendInteractive(client, m, `👮 *OADMIN*\n━━━━━━━━━━━━━━━━\nI need admin privileges.\n━━━━━━━━━━━━━━━━\n© bmb tech`); 
         }

                 await client.groupParticipantsUpdate(m.chat,  [m.sender], 'promote'); 
 sendInteractive(client, m, `📌 *PROMOTED*\n━━━━━━━━━━━━━━━━\nPromoted. Now you have power.\n━━━━━━━━━━━━━━━━\n© bmb tech`); 
          })

}
