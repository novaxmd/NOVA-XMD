import middleware from '../../utils/botUtil/middleware.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default async (context) => {
    await middleware(context, async () => {
        const { client, m } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });


const response = await client.groupRequestParticipantsList(m.chat);

if (response.length === 0) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
    return m.reply(`📌 *REQUESTS*\n━━━━━━━━━━━━━━━━\nThere are no pending join requests.\n━━━━━━━━━━━━━━━━\n© bmb tech`);
}

let jids = ''; 

response.forEach((participant, index) => {
    jids +='+' + participant.jid.split('@')[0];
    if (index < response.length - 1) {
        jids += '\n│ '; 
    }
});

 sendInteractive(client, m, `📌 *PENDING REQUESTS*\n━━━━━━━━━━━━━━━━\n${jids}\nUse .approve-all or .reject-all\nto handle these join requests.\n━━━━━━━━━━━━━━━━\n© bmb tech`); 


})

}
